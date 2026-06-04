"""Postgres FeedRepository — active listings by city, served from the replica.

Reuses the listing→view mapping; cards carry the first photo + seller summary.
Offset-cursor pagination (fetch limit+1 to detect more).
"""

from __future__ import annotations

from sqlalchemy import Select, select
from sqlalchemy.orm import selectinload

from app.core.feed.schemas import FeedSection, SearchFilters
from app.core.listings.schemas import ListingView
from app.infrastructure.postgres.engine import reader_session
from app.infrastructure.postgres.listings_repo import _to_view
from app.infrastructure.postgres.models import Listing


def _active_in_city(city_id: str) -> Select[tuple[Listing]]:
    return (
        select(Listing)
        .where(Listing.status == "active", Listing.city_id == city_id)
        .options(selectinload(Listing.photos), selectinload(Listing.seller))
    )


def _page(stmt: Select[tuple[Listing]], offset: int, limit: int) -> tuple[list[ListingView], bool]:
    with reader_session() as session:
        rows = list(session.scalars(stmt.offset(offset).limit(limit + 1)).all())
        has_more = len(rows) > limit
        return [_to_view(row, list(row.photos)) for row in rows[:limit]], has_more


class PostgresFeedRepository:
    """Implements :class:`app.core.feed.schemas.FeedRepository`."""

    def feed(
        self, city_id: str, section: FeedSection, offset: int, limit: int
    ) -> tuple[list[ListingView], bool]:
        stmt = _active_in_city(city_id)
        if section == "liked":
            stmt = stmt.order_by(Listing.like_count.desc(), Listing.created_at.desc())
        else:
            stmt = stmt.order_by(Listing.freshness_score.desc(), Listing.created_at.desc())
        return _page(stmt, offset, limit)

    def search(
        self, city_id: str, filters: SearchFilters, offset: int, limit: int
    ) -> tuple[list[ListingView], bool]:
        stmt = _active_in_city(city_id)
        if filters.size is not None:
            stmt = stmt.where(Listing.size == filters.size)
        if filters.freshness is not None:
            stmt = stmt.where(Listing.freshness == filters.freshness)
        if filters.price_min is not None:
            stmt = stmt.where(Listing.price_kopecks >= filters.price_min)
        if filters.price_max is not None:
            stmt = stmt.where(Listing.price_kopecks <= filters.price_max)
        stmt = stmt.order_by(Listing.freshness_score.desc(), Listing.created_at.desc())
        return _page(stmt, offset, limit)
