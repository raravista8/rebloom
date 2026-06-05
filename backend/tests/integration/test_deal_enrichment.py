"""Deal view enrichment (display join) against real Postgres — listing cover/price
+ counterparty name/rating are populated without N+1 (the money logic is untouched)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.deals_repo import PostgresDealRepository
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing, Photo, User
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration

THUMB = "/media/photos/abc/thumb.webp"


def _phone() -> str:
    return "+79" + "".join(secrets.choice("0123456789") for _ in range(9))


def test_deal_view_is_enriched() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    buyer = users.get_or_create_by_phone(_phone())
    with writer_session() as session:
        s = session.get(User, uuid.UUID(seller.id))
        assert s is not None
        s.display_name = "Аня"
        s.seller_rating = 4.9
        listing = Listing(
            seller_id=uuid.UUID(seller.id),
            size="M",
            freshness="today",
            price_kopecks=99000,
            city_id="msk",
            status="reserved",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        session.add(
            Photo(
                owner_id=uuid.UUID(seller.id),
                listing_id=listing.id,
                object_key="abc",
                content_type="image/webp",
                variants={"thumb": THUMB, "card": "/c.webp", "full": "/f.webp"},
            )
        )
        deal = Deal(
            listing_id=listing.id,
            buyer_id=uuid.UUID(buyer.id),
            seller_id=uuid.UUID(seller.id),
            amount_kopecks=99000,
            commission_kopecks=9900,
            status="meeting",
            delivery_method="self_pickup",
        )
        session.add(deal)
        session.flush()
        deal_id = str(deal.id)

    view = PostgresDealRepository().get(deal_id)
    assert view is not None
    api = view.to_api(role="buyer")
    assert api["listing"]["photo_thumb_url"] == THUMB
    assert api["listing"]["price_kopecks"] == 99000
    assert api["counterparty"]["display_name"] == "Аня"
    assert api["counterparty"]["seller_rating"] == pytest.approx(4.9)

    # list_all (admin) is enriched too
    all_views = PostgresDealRepository().list_all(limit=200)
    assert any(v.id == deal_id and v.listing_thumb_url == THUMB for v in all_views)
