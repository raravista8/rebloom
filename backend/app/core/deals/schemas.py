"""Deal enums (API_CONTRACT §1). No-escrow «оплата при встрече» model (ADR-0013):
the platform records an agreement + pickup hand-off, never a payment."""

from __future__ import annotations

from typing import Literal

# agreed → meeting → done (+ problem, cancelled). The platform touches no money.
DealStatus = Literal["agreed", "meeting", "done", "problem", "cancelled"]
DeliveryMethod = Literal["self_pickup", "courier"]  # courier deferred (ADR-0008)

TERMINAL_STATUSES: frozenset[str] = frozenset({"done", "cancelled"})

# Legacy → no-escrow status mapping for the data migration (ADR-0013).
LEGACY_STATUS_MAP: dict[str, str] = {
    "created": "agreed",
    "paid_held": "meeting",
    "released": "done",
    "disputed": "problem",
    "refunded": "cancelled",
    "cancelled": "cancelled",
}
