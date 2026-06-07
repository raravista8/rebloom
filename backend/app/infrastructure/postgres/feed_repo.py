"""Postgres FeedRepository — active listings by city, served from the replica.

Reuses the listing→view mapping; cards carry the first photo + seller summary.
Offset-cursor pagination (fetch limit+1 to detect more). ``search`` also returns
``total`` — the count of ALL listings matching the filters, for «Показать N букетов».
"""

from __future__ import annotations

from sqlalchemy import ColumnExpressionArgument, Select, func, select, text
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


def _filter_clauses(filters: SearchFilters) -> list[ColumnExpressionArgument[bool]]:
    """Build the WHERE clauses for a search. metro/flowers are OR-within-group;
    everything is AND-ed across groups (and with the active-in-city base)."""
    clauses: list[ColumnExpressionArgument[bool]] = []
    if filters.size is not None:
        clauses.append(Listing.size == filters.size)
    if filters.freshness is not None:
        clauses.append(Listing.freshness == filters.freshness)
    if filters.price_min is not None:
        clauses.append(Listing.price_kopecks >= filters.price_min)
    if filters.price_max is not None:
        clauses.append(Listing.price_kopecks <= filters.price_max)
    if filters.metro:
        clauses.append(Listing.metro_station_id.in_(list(filters.metro)))
    if filters.flowers:
        # JSON array overlap (OR within the group): true if the listing's
        # flower_types shares ANY id with the requested set. ``?|`` is a JSONB
        # operator, so cast the JSON column + bind the request as a text[].
        clauses.append(
            text("listings.flower_types::jsonb ?| cast(:flowers as text[])").bindparams(
                flowers=list(filters.flowers)
            )
        )
    return clauses


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
    ) -> tuple[list[ListingView], bool, int]:
        clauses = _filter_clauses(filters)
        stmt = _active_in_city(city_id)
        for clause in clauses:
            stmt = stmt.where(clause)
        stmt = stmt.order_by(Listing.freshness_score.desc(), Listing.created_at.desc())
        page, has_more = _page(stmt, offset, limit)

        count_stmt = (
            select(func.count())
            .select_from(Listing)
            .where(Listing.status == "active", Listing.city_id == city_id)
        )
        for clause in clauses:
            count_stmt = count_stmt.where(clause)
        with reader_session() as session:
            total = int(session.scalar(count_stmt) or 0)
        return page, has_more, total
