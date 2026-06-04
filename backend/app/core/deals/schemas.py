"""Deal enums + money helpers (API_CONTRACT §1, ADR-0010)."""

from __future__ import annotations

from typing import Literal

DealStatus = Literal["created", "paid_held", "released", "refunded", "disputed", "cancelled"]
DeliveryMethod = Literal["self_pickup", "courier"]

TERMINAL_STATUSES: frozenset[str] = frozenset({"released", "refunded", "cancelled"})


def compute_commission(amount_kopecks: int, bps: int) -> int:
    """Platform commission in kopecks (floor). Buyer pays ``amount`` exactly; the
    commission is withheld from the seller's payout via split (ADR-0010)."""
    return amount_kopecks * bps // 10000
