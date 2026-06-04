"""Admin TOTP 2FA + RBAC gate (T1.4, SECURITY §5, OPERATIONS §6).

Default-deny: non-admin → 403; admin without a 2FA-verified session → 403;
only a valid TOTP unlocks the admin session.
"""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.main import create_app
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

PHONE = "+79161234567"
CODE = "123456"
# Base32 admin TOTP seed.
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"


@pytest.fixture
def ctx() -> Iterator[tuple[TestClient, FakeUserRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    with TestClient(app) as client:
        yield client, users


def _login(client: TestClient) -> str:
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    return str(client.get("/api/me").json()["data"]["user"]["id"])


def test_non_admin_is_forbidden(ctx: tuple[TestClient, FakeUserRepository]) -> None:
    client, _users = ctx
    _login(client)
    assert client.post("/api/admin/2fa/verify", json={"code": "123456"}).status_code == 403
    assert client.get("/api/admin/whoami").status_code == 403


def test_admin_without_2fa_is_forbidden(ctx: tuple[TestClient, FakeUserRepository]) -> None:
    client, users = ctx
    users.make_admin(_login(client), SECRET)
    # Admin role alone is not enough — the session is not yet 2FA-verified.
    assert client.get("/api/admin/whoami").status_code == 403


def test_wrong_code_does_not_unlock(ctx: tuple[TestClient, FakeUserRepository]) -> None:
    client, users = ctx
    users.make_admin(_login(client), SECRET)
    resp = client.post("/api/admin/2fa/verify", json={"code": "000000"})
    assert resp.status_code == 401
    assert resp.json()["error"] == "unauthorized"
    assert client.get("/api/admin/whoami").status_code == 403


def test_valid_totp_unlocks_admin(ctx: tuple[TestClient, FakeUserRepository]) -> None:
    client, users = ctx
    users.make_admin(_login(client), SECRET)

    resp = client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})
    assert resp.status_code == 200
    assert resp.json()["data"]["verified_2fa"] is True

    whoami = client.get("/api/admin/whoami")
    assert whoami.status_code == 200
    assert whoami.json()["data"]["admin"] is True
