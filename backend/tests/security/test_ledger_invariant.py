"""SECURITY T-03 — escrow ledger invariants (no double-release, no lost funds).

Guardrail (PRD §7): escrow breaks = 0. These are the money-core invariants;
written first (TDD), they must hold for every deal.
"""

from __future__ import annotations

import pytest
from app.core.deals.ledger import (
    LedgerEntry,
    build_hold_entry,
    build_refund_entries,
    build_release_entries,
    can_apply,
    escrow_balance,
    is_settled,
)
from app.core.deals.schemas import compute_commission

pytestmark = pytest.mark.security

AMOUNT = 100_000  # kopecks
COMMISSION = 10_000  # 10%
DEAL = "deal-1"
HOLD = [build_hold_entry(DEAL, AMOUNT)]


def test_hold_holds_the_full_amount() -> None:
    assert escrow_balance(HOLD) == AMOUNT
    assert not is_settled(HOLD)  # funds are held, not settled


def test_release_settles_to_zero() -> None:
    entries = [*HOLD, *build_release_entries(DEAL, AMOUNT, COMMISSION)]
    assert escrow_balance(entries) == 0
    assert is_settled(entries)


def test_release_conserves_money() -> None:
    # commission + payout must equal the held amount — no money created or lost
    rel = build_release_entries(DEAL, AMOUNT, COMMISSION)
    assert sum(e.amount_kopecks for e in rel) == AMOUNT


def test_refund_settles_to_zero() -> None:
    entries = [*HOLD, *build_refund_entries(DEAL, AMOUNT)]
    assert is_settled(entries)


def test_double_release_is_rejected() -> None:
    rel = build_release_entries(DEAL, AMOUNT, COMMISSION)
    assert can_apply(HOLD, rel) is True  # first release ok
    settled = [*HOLD, *rel]
    assert can_apply(settled, rel) is False  # second release would go negative


def test_release_then_refund_is_rejected() -> None:
    settled = [*HOLD, *build_release_entries(DEAL, AMOUNT, COMMISSION)]
    assert can_apply(settled, build_refund_entries(DEAL, AMOUNT)) is False


def test_cannot_disburse_more_than_held() -> None:
    too_much = build_release_entries(DEAL, AMOUNT * 2, COMMISSION)
    assert can_apply(HOLD, too_much) is False


def test_negative_amounts_rejected() -> None:
    assert can_apply(HOLD, [LedgerEntry(DEAL, "payout", -1)]) is False


def test_commission_is_ten_percent_floor() -> None:
    assert compute_commission(100_000, 1000) == 10_000
    assert compute_commission(99_999, 1000) == 9_999  # floor
