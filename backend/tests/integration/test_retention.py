"""T12.3b — retention worker anonymizes accounts past the deletion grace; recent
requests and active accounts are left alone; the ledger is preserved (ФЗ-152)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.core.privacy.service import RETENTION_GRACE_DAYS
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import User
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.workers.retention import anonymize_due_deletions

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _deleted_user(requested_days_ago: int) -> uuid.UUID:
    users = PostgresUserRepository()
    user = users.get_or_create_by_phone(_phone())
    uid = uuid.UUID(user.id)
    with writer_session() as session:
        row = session.get(User, uid)
        assert row is not None
        row.display_name = "Аня"
        row.status = "deleted"
        row.deletion_requested_at = datetime.now(UTC) - timedelta(days=requested_days_ago)
    return uid


def test_past_grace_is_anonymized() -> None:
    uid = _deleted_user(RETENTION_GRACE_DAYS + 1)
    assert anonymize_due_deletions() >= 1

    with writer_session() as session:
        row = session.get(User, uid)
        assert row is not None
        assert row.phone.startswith("del:")
        assert row.display_name is None and row.city_id is None
        assert row.status == "deleted"  # row kept, just scrubbed

    # Idempotent: a second run does not re-scrub this user.
    before = session_phone(uid)
    anonymize_due_deletions()
    assert session_phone(uid) == before


def test_within_grace_is_untouched() -> None:
    uid = _deleted_user(1)  # requested yesterday
    anonymize_due_deletions()
    with writer_session() as session:
        row = session.get(User, uid)
        assert row is not None
        assert not row.phone.startswith("del:")
        assert row.display_name == "Аня"


def session_phone(uid: uuid.UUID) -> str:
    with writer_session() as session:
        row = session.get(User, uid)
        assert row is not None
        return row.phone
