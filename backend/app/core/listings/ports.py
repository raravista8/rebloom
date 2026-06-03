"""Listings/photos repository ports."""

from __future__ import annotations

from typing import Protocol

from app.core.listings.schemas import ListingCreateIn, ListingView, PhotoRef


class PhotoRepository(Protocol):
    def create_pending(self, owner_id: str, content_type: str) -> PhotoRef: ...
    def get_owned(self, owner_id: str, photo_ids: list[str]) -> list[PhotoRef]: ...


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
