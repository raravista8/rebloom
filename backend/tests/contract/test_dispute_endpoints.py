"""Report endpoints (FLOW-1, API_CONTRACT §4/§6) — no-escrow (ADR-0013).

A party reports a problem (deal → problem); only a 2FA-verified admin resolves it
(done / cancelled). No money moves.
"""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deals import get_deal_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.auth.totp import generate_totp
from app.core.deals.service import DealService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeAuditLog,
    FakeClock,
    FakeDealRepository,
    FakeListingReader,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # public RFC 6238 vector


@pytest.fixture
def ctx() -> (
    Iterator[
        tuple[FastAPI, FakeDealRepository, FakeListingReader, FakeUserRepository, FakeAuditLog]
    ]
):
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    deals = FakeDealRepository()
    listings = FakeListingReader()
    audit = FakeAuditLog()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_deal_service] = lambda: DealService(deals, listings, audit=audit)
    yield app, deals, listings, users, audit


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    uid: str = client.get("/api/me").json()["data"]["user"]["id"]
    return client, uid


def _agreed_deal(
    app: FastAPI, deals: FakeDealRepository, listings: FakeListingReader
) -> tuple[TestClient, str]:
    client, _uid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", price=100_000, status="active")
    deal_id = client.post("/api/deals", json={"listing_id": "L"}).json()["data"]["deal"]["id"]
    return client, deal_id


def _admin_client(app: FastAPI, users: FakeUserRepository) -> TestClient:
    client, uid = _login(app, "+79990001122")
    users.make_admin(uid, SECRET)
    resp = client.post("/api/admin/2fa/verify", json={"code": generate_totp(SECRET)})
    assert resp.status_code == 200
    return client


def test_party_reports_problem(ctx) -> None:  # type: ignore[no-untyped-def]
    app, deals, listings, _users, audit = ctx
    client, deal_id = _agreed_deal(app, deals, listings)

    resp = client.post(f"/api/deals/{deal_id}/report", json={"reason": "увял", "photo_ids": []})
    assert resp.status_code == 200
    assert resp.json()["data"]["deal"]["status"] == "problem"
    assert any(e["action"] == "deal.problem" for e in audit.entries)


def test_report_requires_reason(ctx) -> None:  # type: ignore[no-untyped-def]
    app, deals, listings, _users, _audit = ctx
    client, deal_id = _agreed_deal(app, deals, listings)
    resp = client.post(f"/api/deals/{deal_id}/report", json={"reason": ""})
    assert resp.status_code == 422  # validation: reason min_length


def test_admin_resolves_done(ctx) -> None:  # type: ignore[no-untyped-def]
    app, deals, listings, users, audit = ctx
    client, deal_id = _agreed_deal(app, deals, listings)
    client.post(f"/api/deals/{deal_id}/report", json={"reason": "x"})

    admin = _admin_client(app, users)
    resp = admin.post(
        f"/api/admin/deals/{deal_id}/resolve", json={"action": "done", "reason": "seller right"}
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["deal"]["status"] == "done"
    assert any(e["action"] == "deal.problem_resolved.done" for e in audit.entries)


def test_admin_lists_deals(ctx) -> None:  # type: ignore[no-untyped-def]
    app, deals, listings, users, _audit = ctx
    _client, deal_id = _agreed_deal(app, deals, listings)
    admin = _admin_client(app, users)

    items = admin.get("/api/admin/deals").json()["data"]["items"]
    assert any(i["id"] == deal_id for i in items)
    assert admin.get("/api/admin/deals?status=agreed").json()["data"]["items"]
    assert admin.get("/api/admin/deals?status=done").json()["data"]["items"] == []
    assert TestClient(app).get("/api/admin/deals").status_code in (401, 403)


def test_admin_resolves_cancelled(ctx) -> None:  # type: ignore[no-untyped-def]
    app, deals, listings, users, _audit = ctx
    client, deal_id = _agreed_deal(app, deals, listings)
    client.post(f"/api/deals/{deal_id}/report", json={"reason": "x"})

    admin = _admin_client(app, users)
    resp = admin.post(
        f"/api/admin/deals/{deal_id}/resolve", json={"action": "cancelled", "reason": "возврат"}
    )
    assert resp.status_code == 200
    assert resp.json()["data"]["deal"]["status"] == "cancelled"


def test_resolve_requires_admin_2fa(ctx) -> None:  # type: ignore[no-untyped-def]
    app, deals, listings, _users, _audit = ctx
    client, deal_id = _agreed_deal(app, deals, listings)
    client.post(f"/api/deals/{deal_id}/report", json={"reason": "x"})

    resp = client.post(
        f"/api/admin/deals/{deal_id}/resolve", json={"action": "done", "reason": "x"}
    )
    assert resp.status_code == 403
