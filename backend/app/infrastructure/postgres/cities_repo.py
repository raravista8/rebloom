"""Postgres CityRepository — cities are read-mostly, served from the replica."""

from __future__ import annotations

from sqlalchemy import select

from app.core.geo.schemas import CityView
from app.infrastructure.postgres.engine import reader_session
from app.infrastructure.postgres.models import City


class PostgresCityRepository:
    """Implements :class:`app.core.geo.schemas.CityRepository`."""

    def get(self, city_id: str) -> CityView | None:
        with reader_session() as session:
            city = session.get(City, city_id)
            if city is None:
                return None
            return CityView(id=city.id, name=city.name, enabled=city.enabled)

    def list_enabled(self) -> list[CityView]:
        with reader_session() as session:
            rows = session.scalars(
                select(City).where(City.enabled.is_(True)).order_by(City.population.desc())
            ).all()
            return [CityView(id=c.id, name=c.name, enabled=c.enabled) for c in rows]
