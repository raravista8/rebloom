"""T11.3 — admin user repo against real Postgres: search by phone/id, detail,
status + edit."""

from __future__ import annotations

import secrets

import pytest
from app.infrastructure.postgres.admin_users_repo import PostgresAdminUserRepo
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration


def test_search_block_and_edit() -> None:
    phone = f"+79{secrets.randbelow(10**9):09d}"
    user = PostgresUserRepository().get_or_create_by_phone(phone)
    repo = PostgresAdminUserRepo()

    by_phone = repo.search(phone, None, None, 50)
    assert any(r.id == user.id for r in by_phone)
    by_id = repo.search(user.id, None, None, 50)
    assert any(r.id == user.id for r in by_id)

    detail = repo.detail(user.id)
    assert detail is not None and detail.row.id == user.id

    assert repo.set_status(user.id, "blocked") is True
    assert repo.update(user.id, "Новое Имя", "spb") is True
    after = repo.detail(user.id)
    assert after is not None
    assert after.row.status == "blocked"
    assert after.row.display_name == "Новое Имя" and after.row.city_id == "spb"


def test_set_status_unknown_user() -> None:
    assert (
        PostgresAdminUserRepo().set_status("00000000-0000-0000-0000-000000000000", "blocked")
        is False
    )
