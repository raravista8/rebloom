"""Auth endpoints honour the envelope + enums (API_CONTRACT §2)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.core.auth.service import OtpService
from app.main import create_app
from fastapi.testclient import TestClient

from tests.fakes import FakeClock, FakeOtpStore, RecordingSms

PHONE = "+79161234567"
CODE = "123456"


@pytest.fixture
def client() -> Iterator[TestClient]:
    app = create_app()
    service = OtpService(
        FakeOtpStore(FakeClock()), RecordingSms(), "secret", code_factory=lambda: CODE
    )
    app.dependency_overrides[get_otp_service] = lambda: service
    with TestClient(app) as test_client:
        yield test_client


def test_request_then_verify_flow(client: TestClient) -> None:
    req = client.post("/api/auth/otp/request", json={"phone": PHONE})
    assert req.status_code == 200
    assert req.json() == {"ok": True, "data": {"sent": True, "retry_after_sec": 60}}

    ver = client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    assert ver.status_code == 200
    body = ver.json()
    assert body["ok"] is True and body["data"]["verified"] is True
    assert "1234" not in body["data"]["phone_masked"]


def test_wrong_code_returns_validation_envelope(client: TestClient) -> None:
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    resp = client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": "000000"})
    assert resp.status_code == 422
    body = resp.json()
    assert body["ok"] is False
    assert body["error"] == "validation_error"
    assert body["request_id"]


def test_extra_field_is_forbidden(client: TestClient) -> None:
    resp = client.post("/api/auth/otp/request", json={"phone": PHONE, "evil": "x"})
    assert resp.status_code == 422


def test_rate_limited_on_immediate_resend(client: TestClient) -> None:
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    again = client.post("/api/auth/otp/request", json={"phone": PHONE})
    assert again.status_code == 429
    assert again.json()["error"] == "rate_limited"
