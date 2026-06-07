"""Geo reference endpoints — the metro catalog (API_CONTRACT §3).

Serves the authoritative station list from ``core/geo/metro.py`` so the web
metro picker + the catalog/search filters consume it over the wire instead of
mirroring the data. Public (no auth) — it is non-sensitive reference data.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.api.envelope import ok
from app.core.geo.metro import resolve, stations_for_city

router = APIRouter(tags=["geo"])


@router.get("/api/geo/metro", response_model=None)
def metro_catalog(city_id: str) -> dict[str, Any]:
    """Full station list for ``city_id`` ({id, name, lines:[{name,color}]} each;
    transfer hubs carry several lines). A no-metro city returns ``stations: []``."""
    stations = [resolve(s.id) for s in stations_for_city(city_id)]
    return ok({"stations": stations})
