"""T-13 / ADR-0012 — pickup address is stored AES-256-GCM-encrypted in Postgres
and decrypts back through the repo + cipher."""

from __future__ import annotations

import secrets
import uuid
from datetime import UTC, datetime, timedelta

import pytest
from app.infrastructure.crypto import build_field_cipher
from app.infrastructure.postgres.deals_repo import PostgresDealRepository
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration

ADDRESS = "Москва, ул. Цветочная, 12, кв. 5"


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_address_ciphertext_at_rest_and_roundtrip() -> None:
    users = PostgresUserRepository()
    seller = uuid.UUID(users.get_or_create_by_phone(_phone()).id)
    buyer = uuid.UUID(users.get_or_create_by_phone(_phone()).id)
    with writer_session() as session:
        listing = Listing(
            seller_id=seller,
            size="M",
            freshness="today",
            price_kopecks=50000,
            city_id="msk",
            status="reserved",
            freshness_score=0,
            expires_at=datetime.now(UTC) + timedelta(days=1),
        )
        session.add(listing)
        session.flush()
        deal = Deal(
            listing_id=listing.id,
            buyer_id=buyer,
            seller_id=seller,
            amount_kopecks=50000,
            commission_kopecks=5000,
            status="paid_held",
            delivery_method="self_pickup",
        )
        session.add(deal)
        session.flush()
        deal_id = str(deal.id)

    repo = PostgresDealRepository()
    cipher = build_field_cipher()
    repo.set_pickup_address(deal_id, cipher.encrypt(ADDRESS))

    # Raw column is ciphertext, not the plaintext address.
    stored = repo.get_pickup_address_enc(deal_id)
    assert stored is not None
    assert ADDRESS not in stored
    # …and it decrypts back.
    assert cipher.decrypt(stored) == ADDRESS
