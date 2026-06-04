"""T3.4 / SECURITY T-09 — a re-encoded copy of another seller's photo is held
``pending`` (flagged); the real Pillow dHash + repo candidate read are exercised.

Isolation note: the integration DB persists across runs and ``other_owner_phashes``
is global, so each test builds a RUN-UNIQUE low-frequency image (random 9×8 grid
upscaled — JPEG-survivable, controls the dHash) to avoid cross-run collisions."""

from __future__ import annotations

import io
import secrets
import uuid

import pytest
from app.core.photos.service import PhotoUploadService
from app.infrastructure.images import PillowImageProcessor
from app.infrastructure.object_storage import LocalFsStorage
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Photo
from app.infrastructure.postgres.photos_repo import PostgresPhotoRepository
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from PIL import Image
from sqlalchemy import delete

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _clear_phashes() -> None:
    """Start from a clean photo table: the persistent integration DB accumulates
    hashed photos across runs, and ``other_owner_phashes`` is global — stale rows
    would cause pHash false-positive matches. These tests own the photos domain."""
    with writer_session() as session:
        session.execute(delete(Photo))


def _grid_image(grid: list[int], fmt: str) -> bytes:
    """Build a smooth 96×72 image from a 9×8 grayscale grid. BICUBIC upscale keeps
    it low-frequency (no hard edges) so the dHash is stable across a JPEG round-
    trip, while the random grid keeps each run's hash unique."""
    small = Image.new("L", (9, 8))
    small.putdata(grid)
    img = small.resize((96, 72), Image.Resampling.BICUBIC).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, fmt, quality=92)
    return buf.getvalue()


def _random_grid() -> list[int]:
    return [secrets.randbelow(256) for _ in range(72)]


def _new_photo(owner_id: str) -> str:
    with writer_session() as session:
        photo = Photo(
            owner_id=uuid.UUID(owner_id),
            object_key=f"u/{owner_id}/{secrets.token_urlsafe(8)}",
            content_type="image/png",
            moderation_status="pending",
        )
        session.add(photo)
        session.flush()
        return str(photo.id)


def _svc(tmp_path: object) -> PhotoUploadService:
    return PhotoUploadService(
        PostgresPhotoRepository(),
        PillowImageProcessor(),
        LocalFsStorage(tmp_path, "https://cdn.test"),  # type: ignore[arg-type]
    )


def _status(photo_id: str) -> str:
    with writer_session() as session:
        row = session.get(Photo, uuid.UUID(photo_id))
        assert row is not None
        return row.moderation_status


def test_reencoded_copy_of_other_owner_is_flagged(tmp_path: object) -> None:
    _clear_phashes()
    users = PostgresUserRepository()
    seller_a = users.get_or_create_by_phone(_phone())
    seller_b = users.get_or_create_by_phone(_phone())
    svc = _svc(tmp_path)
    grid = _random_grid()  # run-unique

    pa = _new_photo(seller_a.id)
    svc.upload(seller_a.id, pa, _grid_image(grid, "PNG"))
    assert _status(pa) == "approved"  # original, nothing to match

    # Seller B uploads the SAME image re-encoded as JPEG → near-identical dHash.
    pb = _new_photo(seller_b.id)
    svc.upload(seller_b.id, pb, _grid_image(grid, "JPEG"))
    assert _status(pb) == "pending"  # flagged stolen-photo (T-09)


def test_distinct_photo_is_approved(tmp_path: object) -> None:
    _clear_phashes()
    users = PostgresUserRepository()
    seller_a = users.get_or_create_by_phone(_phone())
    seller_b = users.get_or_create_by_phone(_phone())
    svc = _svc(tmp_path)
    grid = _random_grid()

    pa = _new_photo(seller_a.id)
    svc.upload(seller_a.id, pa, _grid_image(grid, "PNG"))

    # Inverted brightness → every dHash comparison flips → maximal distance.
    pb = _new_photo(seller_b.id)
    svc.upload(seller_b.id, pb, _grid_image([255 - v for v in grid], "PNG"))
    assert _status(pb) == "approved"
