"""Likes repository port."""

from __future__ import annotations

from typing import Protocol


class LikeRepository(Protocol):
    """Idempotent like/unlike. Returns the listing's like_count, or ``None`` if
    the listing does not exist."""

    def like(self, user_id: str, listing_id: str) -> int | None: ...
    def unlike(self, user_id: str, listing_id: str) -> int | None: ...
