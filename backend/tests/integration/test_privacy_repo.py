"""T12.3 — DSR repo against real Postgres: export gathers the subject's rows;
soft-delete flips status→deleted and stamps the deletion request (ФЗ-152)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Listing, User
from app.infrastructure.postgres.privacy_repo import PostgresPrivacyRepository
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_export_gathers_and_soft_delete_disables() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    sid = uuid.UUID(seller.id)
    with writer_session() as session:
        session.add(
            Listing(
                seller_id=sid,
                size="M",
                freshness="today",
                price_kopecks=70000,
                city_id="msk",
                status="active",
                freshness_score=0,
                expires_at=datetime.now(UTC) + timedelta(days=1),
            )
        )

    repo = PostgresPrivacyRepository()
    bundle = repo.gather_export(seller.id)
    assert bundle is not None
    assert bundle["profile"]["id"] == seller.id
    assert len(bundle["listings"]) == 1 and bundle["listings"][0]["price_kopecks"] == 70000

    requested = datetime.now(UTC).isoformat()
    assert repo.soft_delete(seller.id, requested) is True

    with writer_session() as session:
        row = session.get(User, sid)
        assert row is not None
        assert row.status == "deleted"
        assert row.deletion_requested_at is not None


def test_correct_updates_profile() -> None:
    users = PostgresUserRepository()
    user = users.get_or_create_by_phone(_phone())
    repo = PostgresPrivacyRepository()
    updated = repo.update_profile(user.id, display_name="Аня", city_id="spb")
    assert updated is not None
    assert updated.display_name == "Аня" and updated.city_id == "spb"
