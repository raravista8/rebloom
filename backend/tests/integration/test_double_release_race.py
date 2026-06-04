"""SECURITY T-03 — concurrent confirm-receipt releases a deal exactly once.

Real Postgres + threads: the SELECT … FOR UPDATE row lock must serialize
releases so there is never a double payout or a negative escrow balance.
"""

from __future__ import annotations

import io
import secrets
import tempfile
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest
from app.core.deals.schemas import compute_commission
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
from app.infrastructure.postgres.models import Deal, LedgerEntry, Payout
from app.infrastructure.postgres.photos_repo import PostgresPhotoRepository
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.infrastructure.yookassa import SandboxYooKassa
from PIL import Image
from sqlalchemy import func, select

pytestmark = pytest.mark.integration

PRICE = 100_000


def _unique_phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _deal_service() -> DealService:
    return DealService(PostgresDealRepository(), PostgresListingReader(), SandboxYooKassa(), 1000)


def _setup_paid_held_deal() -> tuple[str, str]:
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
    deal, _url = created.value
    PostgresDealRepository().mark_paid(f"yk_pay_{deal.id}")  # simulate the webhook
    return deal.id, buyer.id


def test_concurrent_confirm_releases_exactly_once() -> None:
    deal_id, buyer_id = _setup_paid_held_deal()
    service = _deal_service()

    workers = 8
    with ThreadPoolExecutor(max_workers=workers) as pool:
        results = list(
            pool.map(lambda _: service.confirm_receipt(buyer_id, deal_id), range(workers))
        )

    releases = [r for r in results if isinstance(r, Ok)]
    assert len(releases) == 1, f"exactly one release expected, got {len(releases)}"

    did = uuid.UUID(deal_id)
    with writer_session() as session:
        rows = list(session.scalars(select(LedgerEntry).where(LedgerEntry.deal_id == did)).all())
        assert sorted(r.kind for r in rows) == ["commission", "hold", "payout"]
        balance = sum((1 if r.kind == "hold" else -1) * r.amount_kopecks for r in rows)
        assert balance == 0  # escrow break = 0

        commission = next(r.amount_kopecks for r in rows if r.kind == "commission")
        assert commission == compute_commission(PRICE, 1000)

        payouts = session.scalar(
            select(func.count()).select_from(Payout).where(Payout.deal_id == did)
        )
        assert payouts == 1  # exactly one payout, never doubled

        deal = session.get(Deal, did)
        assert deal is not None and deal.status == "released"
