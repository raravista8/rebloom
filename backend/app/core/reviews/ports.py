"""Reviews repository port."""

from __future__ import annotations

from typing import Protocol

from app.core.reviews.schemas import ReviewView


class ReviewRepository(Protocol):
    def create(
        self,
        *,
        deal_id: str,
        author_id: str,
        target_id: str,
        score: int,
        text: str,
        moderation_status: str,
    ) -> ReviewView | None: ...  # None if (deal, author) already reviewed

    def list_for_user(self, target_id: str) -> list[ReviewView]: ...
