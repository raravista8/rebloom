"""Feed/search value objects + repository port."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Protocol

from app.core.listings.schemas import Freshness, ListingView, Size

FeedSection = Literal["fresh", "liked"]

DEFAULT_LIMIT = 20
MAX_LIMIT = 50


@dataclass(frozen=True, slots=True)
class SearchFilters:
    size: Size | None = None
    freshness: Freshness | None = None
    price_min: int | None = None
    price_max: int | None = None
    # OR within each group, AND across groups: a listing matches when its
    # metro_station_id ∈ metro (if metro non-empty) AND its flower_types
    # overlaps flowers (if flowers non-empty).
    metro: tuple[str, ...] = ()
    flowers: tuple[str, ...] = ()

    def as_applied(self) -> dict[str, object]:
        """Non-null/non-empty filters only — used for the `applied` echo
        (empty vs no-results, INTERACTION_STATES §6)."""
        out: dict[str, object] = {}
        if self.size is not None:
            out["size"] = self.size
        if self.freshness is not None:
            out["freshness"] = self.freshness
        if self.price_min is not None:
            out["price_min"] = self.price_min
        if self.price_max is not None:
            out["price_max"] = self.price_max
        if self.metro:
            out["metro"] = list(self.metro)
        if self.flowers:
            out["flowers"] = list(self.flowers)
        return out


class FeedRepository(Protocol):
    def feed(
        self, city_id: str, section: FeedSection, offset: int, limit: int
    ) -> tuple[list[ListingView], bool]: ...
    def search(
        self, city_id: str, filters: SearchFilters, offset: int, limit: int
    ) -> tuple[list[ListingView], bool, int]:
        """Returns ``(page, has_more, total)`` — ``total`` counts ALL listings
        matching the filters (for «Показать N букетов»), not just the page."""
        ...
