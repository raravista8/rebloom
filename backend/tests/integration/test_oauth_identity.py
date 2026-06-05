"""OAuth identity repo against real Postgres — exercises the 0019 migration
(oauth_identities + nullable users.phone): first sight creates a phone-less user,
the same identity logs that user back in, a different provider is a new user."""

from __future__ import annotations

import secrets

import pytest
from app.infrastructure.postgres.oauth_repo import PostgresOAuthIdentityRepo

pytestmark = pytest.mark.integration


def test_login_or_create_is_idempotent_per_identity() -> None:
    repo = PostgresOAuthIdentityRepo()
    subject = "subj-" + secrets.token_hex(8)  # unique per run

    uid1, is_new1 = repo.login_or_create(
        provider="yandex", subject=subject, email="a@x.ru", name="Аня"
    )
    assert is_new1 is True  # phone-less user created (nullable phone)

    uid2, is_new2 = repo.login_or_create(
        provider="yandex", subject=subject, email="a@x.ru", name="Аня"
    )
    assert is_new2 is False and uid2 == uid1  # same identity → same user

    # same subject string under a different provider is a distinct identity
    uid3, is_new3 = repo.login_or_create(provider="vk", subject=subject, email=None, name=None)
    assert is_new3 is True and uid3 != uid1
