"""Deal endpoints (API_CONTRACT §4): create → confirm-receipt, party-only (T-06).
No-escrow «оплата при встрече» (ADR-0013)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deals import get_deal_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.deals.service import DealService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeClock,
    FakeDealRepository,
    FakeListingReader,
    FakeOtpStore,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

CODE = "123456"


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakeDealRepository, FakeListingReader]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    deals = FakeDealRepository()
    listings = FakeListingReader()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_deal_service] = lambda: DealService(deals, listings)
    yield app, deals, listings


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    uid: str = client.get("/api/me").json()["data"]["user"]["id"]
    return client, uid


def test_create_agreed_then_confirm_done(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    client, _uid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", price=200_000, status="active")

    created = client.post("/api/deals", json={"listing_id": "L", "delivery_method": "self_pickup"})
    assert created.status_code == 200
    data = created.json()["data"]
    assert data["deal"]["status"] == "agreed"
    assert "payment" not in data  # no escrow / no online payment (ADR-0013)
    deal_id = data["deal"]["id"]

    confirmed = client.post(f"/api/deals/{deal_id}/confirm-receipt")
    assert confirmed.status_code == 200
    assert confirmed.json()["data"]["deal"]["status"] == "done"


def test_cannot_buy_own_listing(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    client, uid = _login(app, "+79161112233")
    listings.seed("L", uid, status="active")  # buyer owns it
    resp = client.post("/api/deals", json={"listing_id": "L"})
    assert resp.status_code == 403


def test_report_then_cancel(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    client, _uid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", status="active")
    deal_id = client.post("/api/deals", json={"listing_id": "L"}).json()["data"]["deal"]["id"]
    reported = client.post(f"/api/deals/{deal_id}/report", json={"reason": "не пришёл"})
    assert reported.status_code == 200 and reported.json()["data"]["deal"]["status"] == "problem"
    cancelled = client.post(f"/api/deals/{deal_id}/cancel", json={})
    assert cancelled.status_code == 200
    assert cancelled.json()["data"]["deal"]["status"] == "cancelled"


def test_get_deal_is_party_only(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    buyer, _bid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", status="active")
    deal_id = buyer.post("/api/deals", json={"listing_id": "L"}).json()["data"]["deal"]["id"]

    assert buyer.get(f"/api/deals/{deal_id}").status_code == 200

    stranger, _sid = _login(app, "+79165556677")
    assert stranger.get(f"/api/deals/{deal_id}").status_code == 403  # IDOR blocked


def test_list_my_deals(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    client, _uid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", price=150_000, status="active")
    client.post("/api/deals", json={"listing_id": "L", "delivery_method": "self_pickup"})

    resp = client.get("/api/deals")
    assert resp.status_code == 200
    items = resp.json()["data"]["items"]
    assert len(items) == 1
    d = items[0]
    assert d["role"] == "buyer"
    assert d["counterparty"]["id"] == "seller-x"
    assert d["listing"]["id"] == "L"
    assert "created_at" in d
    assert client.get("/api/deals?role=seller").json()["data"]["items"] == []


def test_list_my_deals_requires_auth(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, _listings = ctx
    assert TestClient(app).get("/api/deals").status_code == 401
