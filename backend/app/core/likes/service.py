"""Like / unlike (FR-015) — idempotent, returns the fresh count."""

from __future__ import annotations

from app.core.errors import NOT_FOUND, DomainError
from app.core.likes.ports import LikeRepository
from app.core.result import Err, Ok, Result


class LikeService:
    def __init__(self, repo: LikeRepository) -> None:
        self._repo = repo

    def like(self, user_id: str, listing_id: str) -> Result[tuple[int, bool], DomainError]:
        count = self._repo.like(user_id, listing_id)
        if count is None:
            return Err(DomainError(NOT_FOUND, "listing"))
        return Ok((count, True))

    def unlike(self, user_id: str, listing_id: str) -> Result[tuple[int, bool], DomainError]:
        count = self._repo.unlike(user_id, listing_id)
        if count is None:
            return Err(DomainError(NOT_FOUND, "listing"))
        return Ok((count, False))
