"""Finance summary from the ledger (T11.2a, FR-070): the escrow identity must
hold — held = gmv − commission − payout − refund."""

from __future__ import annotations

from app.core.analytics.finance import FinanceService

from tests.fakes import FakeFinanceRepo


def test_fully_released_deal_settles_to_zero_held() -> None:
    repo = FakeFinanceRepo(
        totals={"hold": 100_000, "commission": 10_000, "payout": 90_000},
        deals={"released": 1},
    )
    s = FinanceService(repo).summary()
    assert s.gmv_kopecks == 100_000
    assert s.commission_kopecks == 10_000
    assert s.payout_kopecks == 90_000
    assert s.refund_kopecks == 0
    assert s.held_kopecks == 0  # nothing left held
    assert s.deals_by_status == {"released": 1}


def test_in_flight_escrow_is_held() -> None:
    # Two deals paid, none released → all money still held.
    repo = FakeFinanceRepo(totals={"hold": 250_000}, deals={"paid_held": 2})
    s = FinanceService(repo).summary()
    assert s.gmv_kopecks == 250_000
    assert s.held_kopecks == 250_000
    assert s.commission_kopecks == 0


def test_partial_refund_conserves() -> None:
    repo = FakeFinanceRepo(totals={"hold": 100_000, "refund": 30_000, "payout": 70_000})
    s = FinanceService(repo).summary()
    assert s.refund_kopecks == 30_000
    assert s.payout_kopecks == 70_000
    assert s.held_kopecks == 0


def test_empty_ledger() -> None:
    s = FinanceService(FakeFinanceRepo()).summary()
    assert s.gmv_kopecks == 0 and s.held_kopecks == 0
    assert s.deals_by_status == {}
