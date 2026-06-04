"""T11.2b — user-stats aggregates against real Postgres (by-city is deterministic
via a unique city bucket; total/registrations accumulate, so assert ≥)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import User
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.infrastructure.postgres.users_stats_repo import PostgresUsersStatsRepo

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_total_by_city_and_growth() -> None:
    users = PostgresUserRepository()
    city = f"c{secrets.token_hex(3)}"  # unique bucket → deterministic count
    ids = [users.get_or_create_by_phone(_phone()).id for _ in range(3)]
    with writer_session() as session:
        for uid in ids:
            session.get(User, uuid.UUID(uid)).city_id = city  # type: ignore[union-attr]

    repo = PostgresUsersStatsRepo()
    assert repo.by_city().get(city) == 3
    assert repo.total() >= 3

    since = (datetime.now(UTC) - timedelta(days=1)).date().isoformat()
    growth = repo.registrations_since(since)
    assert sum(growth.values()) >= 3  # our 3 just-registered users are in-window
