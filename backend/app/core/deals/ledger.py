"""Append-only escrow ledger — the source of truth for money (ARCHITECTURE §6).

One ``hold`` enters escrow when the buyer pays; ``payout``+``commission`` (or
``refund``) leave it. The escrow balance for a deal must never go negative and
must settle to 0 at a terminal state — this is what makes double-release and
lost-escrow impossible (SECURITY T-03).
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from typing import Literal

LedgerKind = Literal["hold", "commission", "payout", "refund"]

# Sign of each kind against the deal's escrow balance.
_SIGN: dict[str, int] = {"hold": +1, "commission": -1, "payout": -1, "refund": -1}


@dataclass(frozen=True, slots=True)
class LedgerEntry:
    deal_id: str
    kind: LedgerKind
    amount_kopecks: int  # always positive (kopecks, never float)


def escrow_balance(entries: Iterable[LedgerEntry]) -> int:
    return sum(_SIGN[e.kind] * e.amount_kopecks for e in entries)


def is_settled(entries: Iterable[LedgerEntry]) -> bool:
    """True when nothing is left held (balance 0) — required at terminal."""
    return escrow_balance(entries) == 0


def can_apply(existing: list[LedgerEntry], new: list[LedgerEntry]) -> bool:
    """A move is legal only if all amounts are positive and the balance stays
    non-negative — i.e. you can never disburse more than is held."""
    if any(e.amount_kopecks < 0 for e in new):
        return False
    return escrow_balance([*existing, *new]) >= 0


def build_hold_entry(deal_id: str, amount_kopecks: int) -> LedgerEntry:
    return LedgerEntry(deal_id, "hold", amount_kopecks)


def build_release_entries(
    deal_id: str, amount_kopecks: int, commission_kopecks: int
) -> list[LedgerEntry]:
    """Commission + seller payout, conserving the held amount exactly."""
    payout = amount_kopecks - commission_kopecks
    return [
        LedgerEntry(deal_id, "commission", commission_kopecks),
        LedgerEntry(deal_id, "payout", payout),
    ]


def build_refund_entries(deal_id: str, amount_kopecks: int) -> list[LedgerEntry]:
    return [LedgerEntry(deal_id, "refund", amount_kopecks)]


def build_partial_entries(
    deal_id: str, refund_kopecks: int, payout_kopecks: int
) -> list[LedgerEntry]:
    """A disputed-deal split: part refunded to the buyer, the rest paid to the
    seller. Commission is waived on disputed partials — the two legs must sum to
    the held amount so escrow still settles to 0 (caller enforces the bounds)."""
    return [
        LedgerEntry(deal_id, "refund", refund_kopecks),
        LedgerEntry(deal_id, "payout", payout_kopecks),
    ]
