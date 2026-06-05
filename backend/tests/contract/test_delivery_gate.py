"""Delivery address gate over HTTP (T-13, FR-030): seller shares the point
(→meeting), buyer reads the address only after that. No-escrow (ADR-0013)."""

from __future__ import annotations

import base64
from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deals import get_deal_service, get_delivery_service
from app.api.deps import get_session_service, get_user_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.deals.delivery import DeliveryService
from app.core.deals.service import DealService
from app.infrastructure.crypto import AesGcmCipher
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
KEY = base64.b64decode("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")
ADDRESS = "Москва, ул. Цветочная, 12"


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
    app.dependency_overrides[get_delivery_service] = lambda: DeliveryService(
        deals, deals, AesGcmCipher(KEY)
    )
    yield app, deals, listings


def _login(app: FastAPI, phone: str) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": phone})
    client.post("/api/auth/otp/verify", json={"phone": phone, "code": CODE})
    return client, client.get("/api/me").json()["data"]["user"]["id"]


def test_gate_reveals_only_after_share_point(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    seller, sid = _login(app, "+79990001122")
    buyer, _bid = _login(app, "+79161112233")
    listings.seed("L", sid, price=100_000, status="active")
    deal_id = buyer.post("/api/deals", json={"listing_id": "L"}).json()["data"]["deal"]["id"]

    # Before the seller shares the point: not revealed.
    pre = buyer.get(f"/api/deals/{deal_id}/delivery").json()["data"]
    assert pre["revealed"] is False and pre["address"] is None

    # Seller shares the pickup address → meeting.
    shared = seller.post(f"/api/deals/{deal_id}/share-point", json={"address": ADDRESS})
    assert shared.status_code == 200 and shared.json()["data"]["deal"]["status"] == "meeting"

    # After: revealed to the buyer.
    post = buyer.get(f"/api/deals/{deal_id}/delivery").json()["data"]
    assert post["revealed"] is True and post["address"] == ADDRESS


def test_buyer_cannot_share_point(
    ctx: tuple[FastAPI, FakeDealRepository, FakeListingReader],
) -> None:
    app, _deals, listings = ctx
    buyer, _bid = _login(app, "+79161112233")
    listings.seed("L", "seller-x", price=100_000, status="active")
    deal_id = buyer.post("/api/deals", json={"listing_id": "L"}).json()["data"]["deal"]["id"]
    resp = buyer.post(f"/api/deals/{deal_id}/share-point", json={"address": ADDRESS})
    assert resp.status_code == 403
