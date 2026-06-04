"""Feed & search endpoints (API_CONTRACT §3, FR-016). Public (optional auth)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.envelope import ok
from app.core.feed.schemas import FeedSection, SearchFilters
from app.core.feed.service import FeedService
from app.core.listings.schemas import Freshness, Size
from app.infrastructure.postgres.feed_repo import PostgresFeedRepository

router = APIRouter(tags=["feed"])


def get_feed_service() -> FeedService:
    return FeedService(PostgresFeedRepository())


FeedServiceDep = Annotated[FeedService, Depends(get_feed_service)]


@router.get("/api/feed", response_model=None)
def feed(
    service: FeedServiceDep,
    city_id: str,
    section: FeedSection = "fresh",
    cursor: str | None = None,
    limit: int = 20,
) -> dict[str, Any]:
    return ok(service.feed(city_id, section, cursor, limit))


@router.get("/api/search", response_model=None)
def search(
    service: FeedServiceDep,
    city_id: str,
    q: str | None = None,
    size: Size | None = None,
    freshness: Freshness | None = None,
    price_min: int | None = None,
    price_max: int | None = None,
    cursor: str | None = None,
    limit: int = 20,
) -> dict[str, Any]:
    filters = SearchFilters(
        size=size, freshness=freshness, price_min=price_min, price_max=price_max
    )
    return ok(service.search(city_id, q, filters, cursor, limit))
