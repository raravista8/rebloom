"""Deal state machine — no-escrow «оплата при встрече» (ADR-0013).

agreed → meeting → done ; (agreed|meeting) → problem | cancelled ; problem → done | cancelled.
The platform records an agreement and a pickup hand-off — it never holds or moves
money, so there is no release/payout/refund path. Terminal states never transition out.
"""

from __future__ import annotations

from app.core.deals.schemas import DealStatus

_TRANSITIONS: dict[str, frozenset[str]] = {
    # agreed → done directly is allowed: the buyer can confirm pickup even if the
    # seller never formally shared a point (they arranged it in chat).
    "agreed": frozenset({"meeting", "done", "problem", "cancelled"}),
    "meeting": frozenset({"done", "problem", "cancelled"}),
    "problem": frozenset({"done", "cancelled"}),
    "done": frozenset(),
    "cancelled": frozenset(),
}


def can_transition(current: str, target: str) -> bool:
    return target in _TRANSITIONS.get(current, frozenset())


def is_terminal(status: DealStatus) -> bool:
    return not _TRANSITIONS.get(status, frozenset())
