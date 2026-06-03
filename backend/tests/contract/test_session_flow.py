"""Login → /api/me → logout flow with revocation (T1.2, API_CONTRACT §2)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
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


@pytest.fixture
def client() -> Iterator[TestClient]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    with TestClient(app) as test_client:
        yield test_client


def _login(client: TestClient) -> None:
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    resp = client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    assert resp.status_code == 200
    assert resp.cookies.get("session")


def test_login_me_logout_revokes(client: TestClient) -> None:
    _login(client)

    me = client.get("/api/me")
    assert me.status_code == 200
    user = me.json()["data"]["user"]
    assert user["roles"] == ["buyer"]
    assert "phone_masked" in user and user["phone_masked"].startswith("+7")

    assert client.post("/api/auth/logout").status_code == 200

    after = client.get("/api/me")
    assert after.status_code == 401
    assert after.json()["error"] == "unauthorized"


def test_me_requires_session(client: TestClient) -> None:
    resp = client.get("/api/me")
    assert resp.status_code == 401
    body = resp.json()
    assert body["ok"] is False
    assert body["error"] == "unauthorized"
    assert body["request_id"]
