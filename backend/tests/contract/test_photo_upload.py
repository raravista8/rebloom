"""Photo upload endpoint (API_CONTRACT §3, FR-011)."""

from __future__ import annotations

import io
from collections.abc import Iterator

import pytest
from app.api.auth import get_otp_service
from app.api.deps import get_session_service, get_user_repo
from app.api.listings import get_photo_repo, get_photo_upload_service
from app.core.auth.service import OtpService
from app.core.auth.session import SessionService
from app.core.photos.service import PhotoUploadService
from app.infrastructure.images import PillowImageProcessor
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient
from PIL import Image

from tests.fakes import (
    FakeClock,
    FakeObjectStorage,
    FakeOtpStore,
    FakePhotoRepository,
    FakeSessionStore,
    FakeUserRepository,
    RecordingSms,
)

PHONE = "+79161234567"
CODE = "123456"


def _png() -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (64, 48), (180, 90, 40)).save(buffer, "PNG")
    return buffer.getvalue()


@pytest.fixture
def ctx() -> Iterator[tuple[FastAPI, FakePhotoRepository]]:
    app = create_app()
    otp = OtpService(FakeOtpStore(FakeClock()), RecordingSms(), "s", code_factory=lambda: CODE)
    sessions = SessionService(FakeSessionStore())
    users = FakeUserRepository()
    photos = FakePhotoRepository()
    storage = FakeObjectStorage()
    app.dependency_overrides[get_otp_service] = lambda: otp
    app.dependency_overrides[get_session_service] = lambda: sessions
    app.dependency_overrides[get_user_repo] = lambda: users
    app.dependency_overrides[get_photo_repo] = lambda: photos
    app.dependency_overrides[get_photo_upload_service] = lambda: PhotoUploadService(
        photos, PillowImageProcessor(), storage
    )
    yield app, photos


def _login(app: FastAPI) -> TestClient:
    client = TestClient(app)
    client.post("/api/auth/otp/request", json={"phone": PHONE})
    client.post("/api/auth/otp/verify", json={"phone": PHONE, "code": CODE})
    return client


def _new_photo(client: TestClient) -> str:
    pid: str = client.post("/api/photos", json={"content_type": "image/png"}).json()["data"][
        "photo_id"
    ]
    return pid


def test_upload_processes_into_variants(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client = _login(app)
    pid = _new_photo(client)
    resp = client.post(f"/api/photos/{pid}/upload", files={"file": ("b.png", _png(), "image/png")})
    assert resp.status_code == 200
    assert set(resp.json()["data"]["variants"]) == {"thumb", "card", "full"}
    assert pid in photos.processed  # marked processed/approved


def test_upload_rejects_non_image(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, _photos = ctx
    client = _login(app)
    pid = _new_photo(client)
    resp = client.post(
        f"/api/photos/{pid}/upload",
        files={"file": ("x.bin", b"definitely not an image", "application/octet-stream")},
    )
    assert resp.status_code == 422
    assert resp.json()["error"] == "validation_error"


def test_upload_other_users_photo_is_404(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, photos = ctx
    client = _login(app)
    photos.seed("not-mine", "another-user", "pending")
    resp = client.post(
        "/api/photos/not-mine/upload", files={"file": ("b.png", _png(), "image/png")}
    )
    assert resp.status_code == 404


def test_upload_requires_auth(ctx: tuple[FastAPI, FakePhotoRepository]) -> None:
    app, _photos = ctx
    resp = TestClient(app).post(
        "/api/photos/whatever/upload", files={"file": ("b.png", _png(), "image/png")}
    )
    assert resp.status_code == 401
