"""FR-041 — seller rating = average of visible review scores (real Postgres)."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing, User
from app.infrastructure.postgres.reviews_repo import PostgresReviewRepository
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_seller_rating_is_average_of_visible_reviews() -> None:
    users = PostgresUserRepository()
    seller = users.get_or_create_by_phone(_phone())
    buyer1 = users.get_or_create_by_phone(_phone())
    buyer2 = users.get_or_create_by_phone(_phone())
    seller_uuid = uuid.UUID(seller.id)

    with writer_session() as session:
        listing = Listing(
            seller_id=seller_uuid,
            size="M",
            freshness="today",
            price_kopecks=100000,
            city_id="msk",
            status="sold",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        deals = [
            Deal(
                listing_id=listing.id,
                buyer_id=uuid.UUID(buyer.id),
                seller_id=seller_uuid,
                amount_kopecks=100000,
                commission_kopecks=10000,
                status="released",
                delivery_method="self_pickup",
                released_at=datetime.now(UTC),
            )
            for buyer in (buyer1, buyer2)
        ]
        session.add_all(deals)
        session.flush()
        deal_ids = [str(d.id) for d in deals]

    repo = PostgresReviewRepository()
    repo.create(
        deal_id=deal_ids[0],
        author_id=buyer1.id,
        target_id=seller.id,
        score=5,
        text="great",
        moderation_status="visible",
    )
    repo.create(
        deal_id=deal_ids[1],
        author_id=buyer2.id,
        target_id=seller.id,
        score=4,
        text="good",
        moderation_status="visible",
    )

    with writer_session() as session:
        user = session.get(User, seller_uuid)
        assert user is not None and user.seller_rating is not None
        assert float(user.seller_rating) == 4.5
