"""Postgres user-stats adapter for the admin overview (read-only, replica).
Implements :class:`app.core.analytics.overview.UsersStatsRepo`."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import func, select

from app.infrastructure.postgres.engine import reader_session
from app.infrastructure.postgres.models import User


class PostgresUsersStatsRepo:
    """Implements :class:`app.core.analytics.overview.UsersStatsRepo`."""

    def total(self) -> int:
        with reader_session() as session:
            return int(session.scalar(select(func.count(User.id))) or 0)

    def by_city(self) -> dict[str, int]:
        with reader_session() as session:
            rows = session.execute(select(User.city_id, func.count()).group_by(User.city_id)).all()
            return {(city or "unknown"): int(count) for city, count in rows}

    def registrations_since(self, since_iso: str) -> dict[str, int]:
        since = datetime.fromisoformat(since_iso)
        with reader_session() as session:
            day = func.to_char(User.created_at, "YYYY-MM-DD")
            rows = session.execute(
                select(day, func.count())
                .where(User.created_at >= since)
                .group_by(day)
                .order_by(day)
            ).all()
            return {str(d): int(count) for d, count in rows}
