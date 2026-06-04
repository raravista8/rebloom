"""Listings/photos repository ports."""

from __future__ import annotations

from typing import Protocol

from app.core.listings.schemas import ListingCreateIn, ListingView, PhotoRef


class PhotoRepository(Protocol):
    def create_pending(self, owner_id: str, content_type: str) -> PhotoRef: ...
    def get_owned(self, owner_id: str, photo_ids: list[str]) -> list[PhotoRef]: ...
    def get_one(self, owner_id: str, photo_id: str) -> PhotoRef | None: ...
    def mark_processed(
        self, photo_id: str, variants: dict[str, str], phash: str, approved: bool
    ) -> None:
        """Store variants + perceptual hash. ``approved`` False holds the photo
        ``pending`` (a duplicate flagged for review, T-09)."""
        ...

    def other_owner_phashes(self, owner_id: str, limit: int) -> list[tuple[str, str]]:
        """(photo_id, phash) for processed photos owned by *other* users — the
        candidate set for stolen-photo detection (T-09)."""
        ...


class ListingRepository(Protocol):
    def create(
        self,
        *,
        seller_id: str,
        data: ListingCreateIn,
        status: str,
        freshness_score: float,
    ) -> ListingView: ...
    def get(self, listing_id: str) -> ListingView | None: ...
