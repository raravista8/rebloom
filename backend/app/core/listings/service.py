"""Listing publish flow (FR-010): validate photos, gate on moderation, create."""

from __future__ import annotations

from app.core.errors import (
    CONTENT_BLOCKED,
    NOT_FOUND,
    VALIDATION_ERROR,
    DomainError,
)
from app.core.listings.freshness import freshness_score
from app.core.listings.ports import ListingRepository, PhotoRepository
from app.core.listings.schemas import ListingCreateIn, ListingView
from app.core.listings.state_machine import status_after_publish
from app.core.result import Err, Ok, Result


class ListingService:
    def __init__(self, listings: ListingRepository, photos: PhotoRepository) -> None:
        self._listings = listings
        self._photos = photos

    def create(self, seller_id: str, data: ListingCreateIn) -> Result[ListingView, DomainError]:
        refs = self._photos.get_owned(seller_id, data.photo_ids)
        if len(refs) != len(set(data.photo_ids)):
            return Err(DomainError(VALIDATION_ERROR, "invalid_photos"))
        if any(ref.moderation_status == "rejected" for ref in refs):
            return Err(DomainError(CONTENT_BLOCKED, "photo_rejected"))

        all_approved = all(ref.moderation_status == "approved" for ref in refs)
        status = status_after_publish(all_approved)
        score = freshness_score(data.freshness, 0.0, float(data.expires_in_h))
        view = self._listings.create(
            seller_id=seller_id, data=data, status=status, freshness_score=score
        )
        return Ok(view)

    def get(self, listing_id: str) -> Result[ListingView, DomainError]:
        view = self._listings.get(listing_id)
        if view is None:
            return Err(DomainError(NOT_FOUND, "listing"))
        return Ok(view)
