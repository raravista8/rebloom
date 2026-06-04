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

    def as_applied(self) -> dict[str, object]:
        """Non-null filters only — used for the `applied` echo (empty vs no-results)."""
        out: dict[str, object] = {}
        if self.size is not None:
            out["size"] = self.size
        if self.freshness is not None:
            out["freshness"] = self.freshness
        if self.price_min is not None:
            out["price_min"] = self.price_min
        if self.price_max is not None:
            out["price_max"] = self.price_max
        return out


class FeedRepository(Protocol):
    def feed(
        self, city_id: str, section: FeedSection, offset: int, limit: int
    ) -> tuple[list[ListingView], bool]: ...
    def search(
        self, city_id: str, filters: SearchFilters, offset: int, limit: int
    ) -> tuple[list[ListingView], bool]: ...
