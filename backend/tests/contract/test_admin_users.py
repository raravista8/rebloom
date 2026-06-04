"""Admin user endpoints (T11.3, FR-071/072) — 2FA-gated, audited."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.admin import get_admin_user_service
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.admin.users import AdminUserService
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeAdminUserRepo,
    FakeAuditLog,
    FakeClock,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeUserRepository, FakeAdminUserRepo, FakeAuditLog]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    repo = FakeAdminUserRepo()
    repo.seed("u1", display_name="Аня")
    audit = FakeAuditLog()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_admin_user_service] = lambda: AdminUserService(repo, audit)
    yield app, users, repo, audit


def _admin(app: FastAPI, users: FakeUserRepository) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)
    client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})
    return client


def test_search_requires_2fa(ctx) -> None:  # type: ignore[no-untyped-def]
    app, users, _repo, _audit = ctx
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": "+79990001122"})
    client.post("/api/auth/otp/verify", json={"phone": "+79990001122", "code": CODE})
    uid = client.get("/api/me").json()["data"]["user"]["id"]
    users.make_admin(uid, SECRET)  # admin, no 2FA
    assert client.get("/api/admin/users").status_code == 403


def test_search_and_block(ctx) -> None:  # type: ignore[no-untyped-def]
    app, users, repo, audit = ctx
    admin = _admin(app, users)

    found = admin.get("/api/admin/users?q=ан")
    assert found.status_code == 200
    assert [u["id"] for u in found.json()["data"]["items"]] == ["u1"]

    resp = admin.post("/api/admin/users/u1/block", json={"reason": "abuse"})
    assert resp.status_code == 200 and resp.json()["data"]["status"] == "blocked"
    assert repo._users["u1"]["status"] == "blocked"
    assert any(e["action"] == "admin.user.blocked" for e in audit.entries)


def test_block_needs_reason(ctx) -> None:  # type: ignore[no-untyped-def]
    app, users, _repo, _audit = ctx
    admin = _admin(app, users)
    assert admin.post("/api/admin/users/u1/block", json={}).status_code == 422


def test_detail_audits_pii(ctx) -> None:  # type: ignore[no-untyped-def]
    app, users, _repo, audit = ctx
    admin = _admin(app, users)
    assert admin.get("/api/admin/users/u1").status_code == 200
    assert any(e["action"] == "admin.user.view" for e in audit.entries)
