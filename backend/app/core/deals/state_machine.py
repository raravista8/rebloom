"""Deal state machine — exactly one legal release path (FR-020..026, ADR-0003).

created → paid_held → released | refunded ; paid_held ⇄ disputed ;
created → cancelled (payment timeout). Terminal states never transition out —
this, with the ledger, blocks double-release (SECURITY T-03).
"""

from __future__ import annotations

from app.core.deals.schemas import DealStatus

_TRANSITIONS: dict[str, frozenset[str]] = {
    "created": frozenset({"paid_held", "cancelled"}),
    "paid_held": frozenset({"released", "refunded", "disputed"}),
    "disputed": frozenset({"released", "refunded"}),
    "released": frozenset(),
    "refunded": frozenset(),
    "cancelled": frozenset(),
}

# How a deal may legitimately move to `released` (FR-026) — never on a timeout
# or an ambiguous provider response.
RELEASE_TRIGGERS: frozenset[str] = frozenset(
    {"buyer_confirm", "delivery_confirm", "support_decision"}
)


def can_transition(current: str, target: str) -> bool:
    return target in _TRANSITIONS.get(current, frozenset())


def is_release_trigger(trigger: str) -> bool:
    return trigger in RELEASE_TRIGGERS


def is_terminal(status: DealStatus) -> bool:
    return not _TRANSITIONS.get(status, frozenset())
