"""Feed/search orchestration: cursor pagination + `applied` echo (FR-016).

The `applied` echo lets the client tell ``empty`` (no query/filter, 0 items)
from ``no-results`` (query/filter set, 0 items) — INTERACTION_STATES §6.
"""

from __future__ import annotations

from typing import Any

from app.core.feed.schemas import (
    MAX_LIMIT,
    FeedRepository,
    FeedSection,
    SearchFilters,
)


def _clamp_limit(limit: int) -> int:
    return max(1, min(limit, MAX_LIMIT))


def _parse_cursor(cursor: str | None) -> int:
    if not cursor:
        return 0
    try:
        return max(0, int(cursor))
    except ValueError:
        return 0


class FeedService:
    def __init__(self, repo: FeedRepository) -> None:
        self._repo = repo

    def feed(
        self, city_id: str, section: FeedSection, cursor: str | None, limit: int
    ) -> dict[str, Any]:
        offset, capped = _parse_cursor(cursor), _clamp_limit(limit)
        views, has_more = self._repo.feed(city_id, section, offset, capped)
        return {
            "items": [v.to_card() for v in views],
            "next_cursor": str(offset + capped) if has_more else None,
            "applied": {"city_id": city_id, "section": section, "filters": {}},
        }

    def search(
        self,
        city_id: str,
        query: str | None,
        filters: SearchFilters,
        cursor: str | None,
        limit: int,
    ) -> dict[str, Any]:
        offset, capped = _parse_cursor(cursor), _clamp_limit(limit)
        views, has_more = self._repo.search(city_id, filters, offset, capped)
        return {
            "items": [v.to_card() for v in views],
            "next_cursor": str(offset + capped) if has_more else None,
            "applied": {"q": query, "city_id": city_id, "filters": filters.as_applied()},
        }
