"""SECURITY T-03 — concurrent confirm-receipt completes a deal exactly once.

Real Postgres + threads: the conditional UPDATE (WHERE status='agreed'|'meeting')
under the row lock must serialize, so a flood of confirms produces exactly one
`done` (no double-settle). No-escrow: no money/ledger involved (ADR-0013).
"""

from __future__ import annotations

import io
import secrets
import tempfile
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest
from app.core.deals.service import DealService
from app.core.listings.schemas import ListingCreateIn
from app.core.listings.service import ListingService
from app.core.photos.service import PhotoUploadService
from app.core.result import Ok
from app.infrastructure.images import PillowImageProcessor
from app.infrastructure.object_storage import LocalFsStorage
from app.infrastructure.postgres.cities_repo import PostgresCityRepository
from app.infrastructure.postgres.deals_repo import (
    PostgresDealRepository,
    PostgresListingReader,
)
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.listings_repo import PostgresListingRepository
from app.infrastructure.postgres.models import Deal
from app.infrastructure.postgres.photos_repo import PostgresPhotoRepository
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from PIL import Image

pytestmark = pytest.mark.integration

PRICE = 100_000


def _unique_phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _deal_service() -> DealService:
    return DealService(PostgresDealRepository(), PostgresListingReader())


def _setup_agreed_deal() -> tuple[str, str]:
    users, photos, listings = (
        PostgresUserRepository(),
        PostgresPhotoRepository(),
        PostgresListingRepository(),
    )
    seller = users.get_or_create_by_phone(_unique_phone())
    photo = photos.create_pending(seller.id, "image/jpeg")
    buffer = io.BytesIO()
    Image.new("RGB", (40, 40), (10, 20, 30)).save(buffer, "PNG")
    storage = LocalFsStorage(Path(tempfile.mkdtemp()), "http://cdn.test")
    PhotoUploadService(photos, PillowImageProcessor(), storage).upload(
        seller.id, photo.id, buffer.getvalue()
    )
    listing = ListingService(listings, photos, PostgresCityRepository()).create(
        seller.id,
        ListingCreateIn(
            size="M", freshness="today", price_kopecks=PRICE, city_id="msk", photo_ids=[photo.id]
        ),
    )
    assert isinstance(listing, Ok) and listing.value.status == "active"

    buyer = users.get_or_create_by_phone(_unique_phone())
    created = _deal_service().create_deal(buyer.id, listing.value.id, "self_pickup")
    assert isinstance(created, Ok)
    return created.value.id, buyer.id


def test_concurrent_confirm_completes_exactly_once() -> None:
    deal_id, buyer_id = _setup_agreed_deal()
    service = _deal_service()

    workers = 8
    with ThreadPoolExecutor(max_workers=workers) as pool:
        results = list(
            pool.map(lambda _: service.confirm_receipt(buyer_id, deal_id), range(workers))
        )

    wins = [r for r in results if isinstance(r, Ok)]
    assert len(wins) == 1, f"exactly one completion expected, got {len(wins)}"

    with writer_session() as session:
        deal = session.get(Deal, uuid.UUID(deal_id))
        assert deal is not None and deal.status == "done" and deal.released_at is not None
