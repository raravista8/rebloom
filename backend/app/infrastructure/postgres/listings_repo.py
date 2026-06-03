"""Postgres ListingRepository — create a listing and attach the seller's photos."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.core.listings.schemas import ListingCreateIn, ListingView, PhotoRef
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Listing, Photo


def _photo_ref(photo: Photo) -> PhotoRef:
    variants = photo.variants or {}
    return PhotoRef(
        id=str(photo.id),
        moderation_status=photo.moderation_status,
        thumb_url=variants.get("thumb"),
        card_url=variants.get("card"),
        full_url=variants.get("full"),
    )


def _to_view(listing: Listing, photos: list[Photo]) -> ListingView:
    seller = listing.seller
    rating = seller.seller_rating if seller is not None else None
    return ListingView(
        id=str(listing.id),
        seller_id=str(listing.seller_id),
        seller_display_name=seller.display_name if seller is not None else None,
        seller_rating=float(rating) if rating is not None else None,
        size=listing.size,
        freshness=listing.freshness,
        price_kopecks=listing.price_kopecks,
        city_id=listing.city_id,
        geo_coarse=listing.geo_coarse,
        status=listing.status,
        like_count=listing.like_count,
        freshness_score=float(listing.freshness_score),
        expires_at=listing.expires_at,
        photos=tuple(_photo_ref(p) for p in photos),
    )


class PostgresListingRepository:
    """Implements :class:`app.core.listings.ports.ListingRepository`."""

    def create(
        self,
        *,
        seller_id: str,
        data: ListingCreateIn,
        status: str,
        freshness_score: float,
    ) -> ListingView:
        with writer_session() as session:
            listing = Listing(
                seller_id=uuid.UUID(seller_id),
                size=data.size,
                freshness=data.freshness,
                price_kopecks=data.price_kopecks,
                city_id=data.city_id,
                geo_coarse=data.geo,
                status=status,
                freshness_score=freshness_score,
                expires_at=datetime.now(UTC) + timedelta(hours=data.expires_in_h),
            )
            session.add(listing)
            session.flush()

            pids = [uuid.UUID(p) for p in data.photo_ids]
            photos = list(
                session.scalars(
                    select(Photo).where(Photo.owner_id == listing.seller_id, Photo.id.in_(pids))
                ).all()
            )
            for photo in photos:
                photo.listing_id = listing.id
            session.flush()
            session.refresh(listing)
            return _to_view(listing, photos)

    def get(self, listing_id: str) -> ListingView | None:
        try:
            lid = uuid.UUID(listing_id)
        except ValueError:
            return None
        with writer_session() as session:
            listing = session.get(Listing, lid)
            if listing is None:
                return None
            return _to_view(listing, list(listing.photos))
