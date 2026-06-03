"""Listing lifecycle state machine (FR-010/013/014, API_CONTRACT §1).

draft → pending_review → active → reserved → sold ; any non-terminal → archived.
A reservation can be released back to active (payment timeout, T5.5).
"""

from __future__ import annotations

from app.core.listings.schemas import ListingStatus

_TRANSITIONS: dict[str, frozenset[str]] = {
    "draft": frozenset({"pending_review", "active", "archived"}),
    "pending_review": frozenset({"active", "archived"}),
    "active": frozenset({"reserved", "archived"}),
    "reserved": frozenset({"active", "sold", "archived"}),
    "sold": frozenset(),
    "archived": frozenset(),
}


def can_transition(current: str, target: str) -> bool:
    return target in _TRANSITIONS.get(current, frozenset())


def status_after_publish(all_photos_approved: bool) -> ListingStatus:
    """Active only when every photo passed moderation; else held for review."""
    return "active" if all_photos_approved else "pending_review"
