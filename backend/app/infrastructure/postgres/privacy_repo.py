"""Postgres DSR adapter (ФЗ-152). Gathers a subject's data across tables, soft-
deletes on request, and applies self-corrections. Implements
:class:`app.core.privacy.ports.PrivacyRepository`."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import select

from app.core.users.schemas import UserView
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import (
    Consent,
    Deal,
    Listing,
    Message,
    Review,
    User,
)
from app.infrastructure.postgres.users_repo import _to_view


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


class PostgresPrivacyRepository:
    """Implements :class:`app.core.privacy.ports.PrivacyRepository`."""

    def gather_export(self, user_id: str) -> dict[str, Any] | None:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return None
        with reader_session() as session:
            user = session.get(User, uid)
            if user is None:
                return None
            consents = session.scalars(select(Consent).where(Consent.user_id == uid)).all()
            listings = session.scalars(select(Listing).where(Listing.seller_id == uid)).all()
            deals = session.scalars(
                select(Deal).where((Deal.buyer_id == uid) | (Deal.seller_id == uid))
            ).all()
            reviews = session.scalars(
                select(Review).where((Review.author_id == uid) | (Review.target_id == uid))
            ).all()
            messages = session.scalars(select(Message).where(Message.sender_id == uid)).all()
            return {
                "profile": {
                    "id": str(user.id),
                    "phone": user.phone,
                    "display_name": user.display_name,
                    "city_id": user.city_id,
                    "roles": list(user.roles),
                    "seller_rating": float(user.seller_rating)
                    if user.seller_rating is not None
                    else None,
                    "status": user.status,
                    "created_at": _iso(user.created_at),
                },
                "consents": [
                    {
                        "policy_version": c.policy_version,
                        "source_channel": c.source_channel,
                        "accepted_at": _iso(c.created_at),
                    }
                    for c in consents
                ],
                "listings": [
                    {
                        "id": str(listing.id),
                        "size": listing.size,
                        "freshness": listing.freshness,
                        "price_kopecks": listing.price_kopecks,
                        "city_id": listing.city_id,
                        "status": listing.status,
                        "created_at": _iso(listing.created_at),
                    }
                    for listing in listings
                ],
                "deals": [
                    {
                        "id": str(d.id),
                        "role": "buyer" if d.buyer_id == uid else "seller",
                        "amount_kopecks": d.amount_kopecks,
                        "status": d.status,
                        "created_at": _iso(d.created_at),
                    }
                    for d in deals
                ],
                "reviews": [
                    {
                        "id": str(r.id),
                        "role": "author" if r.author_id == uid else "target",
                        "score": r.score,
                        "text": r.text,
                        "created_at": _iso(r.created_at),
                    }
                    for r in reviews
                ],
                "messages": [
                    {
                        "id": str(m.id),
                        "deal_id": str(m.deal_id),
                        "body": m.body,
                        "status": m.status,
                        "created_at": _iso(m.created_at),
                    }
                    for m in messages
                ],
            }

    def soft_delete(self, user_id: str, requested_at: str) -> bool:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return False
        with writer_session() as session:
            user = session.execute(
                select(User).where(User.id == uid).with_for_update()
            ).scalar_one_or_none()
            if user is None:
                return False
            user.status = "deleted"  # soft-disable now; PII scrubbed by retention job
            user.deletion_requested_at = datetime.fromisoformat(requested_at)
            return True

    def update_profile(
        self, user_id: str, *, display_name: str | None, city_id: str | None
    ) -> UserView | None:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return None
        with writer_session() as session:
            user = session.get(User, uid)
            if user is None:
                return None
            if display_name is not None:
                user.display_name = display_name
            if city_id is not None:
                user.city_id = city_id
            session.flush()
            return _to_view(user)
