"""Cities endpoint — enabled launch cities for the city selector."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends

from app.api.envelope import ok
from app.core.geo.schemas import CityRepository
from app.infrastructure.postgres.cities_repo import PostgresCityRepository

router = APIRouter(tags=["geo"])


def get_city_repo() -> CityRepository:
    return PostgresCityRepository()


CityRepoDep = Annotated[CityRepository, Depends(get_city_repo)]


@router.get("/api/cities", response_model=None)
def list_cities(repo: CityRepoDep) -> dict[str, Any]:
    return ok({"items": [{"id": c.id, "name": c.name} for c in repo.list_enabled()]})
