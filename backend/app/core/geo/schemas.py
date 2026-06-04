"""City view + repository port."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True, slots=True)
class CityView:
    id: str  # slug
    name: str
    enabled: bool


class CityRepository(Protocol):
    def get(self, city_id: str) -> CityView | None: ...
    def list_enabled(self) -> list[CityView]: ...
