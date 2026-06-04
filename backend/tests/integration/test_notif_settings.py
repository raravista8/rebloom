"""T12.2 — notification settings against real Postgres."""

from __future__ import annotations

import secrets

import pytest
from app.infrastructure.postgres.notif_settings_repo import PostgresNotifSettingsRepo
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration


def test_defaults_and_update() -> None:
    phone = f"+79{secrets.randbelow(10**9):09d}"
    user = PostgresUserRepository().get_or_create_by_phone(phone)
    repo = PostgresNotifSettingsRepo()

    initial = repo.get(user.id)
    assert initial is not None
    assert initial.messages is True and initial.marketing is False  # defaults
    assert initial.deals is True

    updated = repo.update(user.id, messages=False, marketing=True)
    assert updated is not None
    assert updated.messages is False and updated.marketing is True

    # Partial update leaves the other flag intact.
    again = repo.update(user.id, messages=None, marketing=False)
    assert again is not None
    assert again.messages is False and again.marketing is False
