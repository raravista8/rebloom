"""Deal endpoints (API_CONTRACT §4): create → confirm-receipt, party-only (T-06)."""

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
    FakePaymentProvider,
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
    payments = FakePaymentProvider()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_deal_service] = lambda: DealService(
        deals, listings, payments, 1000
    )
    yield app, deals, listings


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    uid: str = client.get("/api/me").json()["data"]["user"]["id"]
    return client, uid


def test_create_then_webhook_then_confirm_releases(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, deals, listings = ctx
    client, _uid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", price=200_000, status="active")

    created = client.post("/api/deals", json={"listing_id": "L", "delivery_method": "self_pickup"})
    assert created.status_code == 200
    data = created.json()["data"]
    assert data["deal"]["status"] == "created"
    assert data["payment"]["confirmation_url"]
    deal_id = data["deal"]["id"]

    deals.mark_paid(f"yk_{deal_id}")  # simulate ЮKassa webhook (T5.3)

    confirmed = client.post(f"/api/deals/{deal_id}/confirm-receipt")
    assert confirmed.status_code == 200
    assert confirmed.json()["data"]["deal"]["status"] == "released"


def test_cannot_buy_own_listing(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    client, uid = _login(app, "+79161112233")
    listings.seed("L", uid, status="active")  # buyer owns it
    resp = client.post("/api/deals", json={"listing_id": "L"})
    assert resp.status_code == 403


def test_confirm_before_paid_conflicts(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    client, _uid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", status="active")
    deal_id = client.post("/api/deals", json={"listing_id": "L"}).json()["data"]["deal"]["id"]
    resp = client.post(f"/api/deals/{deal_id}/confirm-receipt")
    assert resp.status_code == 409  # not paid_held


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
