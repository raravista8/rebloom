"""Moderation-queue port (FR-060). A thin read/decide interface over the listing
and review tables — adapter lives in ``infrastructure/postgres``."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal, Protocol

ItemType = Literal["listing", "review"]


@dataclass(frozen=True, slots=True)
class ModerationItem:
    """One queued item awaiting a moderator (a pending listing or held review)."""

    id: str
    type: ItemType
    created_at: str | None
    summary: dict[str, Any]  # type-specific, non-PII preview fields

    def to_api(self) -> dict[str, Any]:
        return {"id": self.id, "type": self.type, "created_at": self.created_at, **self.summary}


class ModerationQueueRepo(Protocol):
    def list_pending_listings(self, limit: int) -> list[ModerationItem]: ...
    def list_held_reviews(self, limit: int) -> list[ModerationItem]: ...
    # Decisions return True only when the item was in its held/pending state and
    # the transition applied (idempotent; illegal/late decisions return False).
    def decide_listing(self, listing_id: str, approve: bool) -> bool: ...
    def decide_review(self, review_id: str, approve: bool) -> bool: ...
