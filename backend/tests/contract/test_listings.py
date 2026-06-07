"""Listing publish + fetch (API_CONTRACT §3, FR-010/012)."""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.listings import get_listing_service, get_photo_repo
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.listings.service import ListingService
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import (
    FakeCityRepository,
    FakeClock,
    FakeListingRepository,
    FakeOtpStore,
    FakePhotoRepository,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

PHONE = "+79161234567"
CODE = "123456"


def _payload(photo_ids: list[str]) -> dict[str, Any]:
    return {
        "size": "M",
        "freshness": "today",
        "price_kopecks": 150000,
        "city_id": "msk",
        "photo_ids": photo_ids,
    }


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakePhotoRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())  # shared across requests
    users = FakeUserRepository()
    photos = FakePhotoRepository()
    listings = FakeListingRepository()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_photo_repo] = lambda: photos
    app.dependency_overrides[get_listing_service] = lambda: ListingService(
        listings, photos, FakeCityRepository()
    )
    yield app, photos


def _login(app: FastAPI) -> tuple[TestClient, str]:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    user_id: str = client.get("/api/me").json()["data"]["user"]["id"]
    return client, user_id


def test_create_requires_auth(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, _photos = ctx
    resp = TestClient(app).post("/api/listings", json=_payload(["p1"]))
    assert resp.status_code == 401


def test_active_when_all_photos_approved(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    resp = client.post("/api/listings", json=_payload(["p1"]))
    assert resp.status_code == 200
    assert resp.json()["data"]["status"] == "active"


def test_pending_review_when_photo_pending(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "pending")
    resp = client.post("/api/listings", json=_payload(["p1"]))
    assert resp.json()["data"]["status"] == "pending_review"


def test_content_blocked_when_photo_rejected(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "rejected")
    resp = client.post("/api/listings", json=_payload(["p1"]))
    assert resp.status_code == 422
    assert resp.json()["error"] == "content_blocked"


def test_validation_when_photo_not_owned(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, _photos = ctx
    client, _uid = _login(app)
    resp = client.post("/api/listings", json=_payload(["unknown"]))
    assert resp.status_code == 422
    assert resp.json()["error"] == "validation_error"


def test_disabled_city_rejected(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    resp = client.post("/api/listings", json=_payload(["p1"]) | {"city_id": "nsk"})
    assert resp.status_code == 422
    assert resp.json()["error"] == "validation_error"


def test_unknown_city_rejected(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    resp = client.post("/api/listings", json=_payload(["p1"]) | {"city_id": "zzz"})
    assert resp.status_code == 422


def test_create_then_get(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    created = client.post("/api/listings", json=_payload(["p1"])).json()["data"]
    got = client.get(f"/api/listings/{created['id']}")
    assert got.status_code == 200
    assert got.json()["data"]["id"] == created["id"]
    assert got.json()["data"]["price_kopecks"] == 150000


def test_create_with_metro_and_flowers_round_trips(
    ctx: tuple[FastAPI, FakePhotoRepository],
) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    body = _payload(["p1"]) | {
        "metro_station_id": "msk-kievskaya",
        "flower_types": ["roses", "peonies"],
    }
    created = client.post("/api/listings", json=body)
    assert created.status_code == 200
    data = created.json()["data"]
    assert data["metro"]["name"] == "Киевская"
    assert len(data["metro"]["lines"]) == 3  # transfer hub → multi-colour
    assert data["flower_types"] == ["roses", "peonies"]

    got = client.get(f"/api/listings/{data['id']}").json()["data"]
    assert got["metro"]["id"] == "msk-kievskaya"
    assert got["flower_types"] == ["roses", "peonies"]


def test_create_rejects_invalid_metro(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    body = _payload(["p1"]) | {"metro_station_id": "msk-not-a-station"}
    resp = client.post("/api/listings", json=body)
    assert resp.status_code == 422


def test_create_rejects_unknown_flower(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client, uid = _login(app)
    photos.seed("p1", uid, "approved")
    body = _payload(["p1"]) | {"flower_types": ["cactus"]}
    resp = client.post("/api/listings", json=body)
    assert resp.status_code == 422


def test_get_missing_is_404(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, _photos = ctx
    client, _uid = _login(app)
    resp = client.get("/api/listings/listing-999")
    assert resp.status_code == 404
    assert resp.json()["error"] == "not_found"


def test_create_photo_record(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, _photos = ctx
    client, _uid = _login(app)
    resp = client.post("/api/photos", json={"content_type": "image/jpeg"})
    assert resp.status_code == 200
    assert resp.json()["data"]["photo_id"]
    assert resp.json()["data"]["upload_url"]
