"""Postgres admin user repo (FR-071/072). Implements AdminUserRepo. Reads use the
primary (admins act on fresh data); writes lock the row."""

from __future__ import annotations

import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.admin.users import AdminUserDetail, AdminUserRow
from app.core.auth.schemas import mask_phone
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing, Review, User


def _row(user: User, listings_count: int) -> AdminUserRow:
    return AdminUserRow(
        id=str(user.id),
        display_name=user.display_name,
        phone_masked=mask_phone(user.phone),
        city_id=user.city_id,
        status=user.status,
        seller_rating=float(user.seller_rating) if user.seller_rating is not None else None,
        listings_count=listings_count,
    )


def _maybe_uuid(value: str) -> uuid.UUID | None:
    try:
        return uuid.UUID(value)
    except ValueError:
        return None


class PostgresAdminUserRepo:
    """Implements :class:`app.core.admin.users.AdminUserRepo`."""

    def search(
        self, q: str | None, city: str | None, status: str | None, limit: int
    ) -> list[AdminUserRow]:
        with writer_session() as session:
            stmt = select(User)
            if q:
                terms = [User.display_name.ilike(f"%{q}%"), User.phone == q]
                as_uuid = _maybe_uuid(q)
                if as_uuid is not None:
                    terms.append(User.id == as_uuid)
                stmt = stmt.where(or_(*terms))
            if city:
                stmt = stmt.where(User.city_id == city)
            if status:
                stmt = stmt.where(User.status == status)
            users = list(session.scalars(stmt.order_by(User.created_at.desc()).limit(limit)).all())
            return [_row(u, self._listings_count(session, u.id)) for u in users]

    @staticmethod
    def _listings_count(session: Session, user_id: uuid.UUID) -> int:
        return int(session.scalar(select(func.count()).where(Listing.seller_id == user_id)) or 0)

    def detail(self, user_id: str) -> AdminUserDetail | None:
        uid = _maybe_uuid(user_id)
        if uid is None:
            return None
        with writer_session() as session:
            user = session.get(User, uid)
            if user is None:
                return None
            listings = session.scalars(
                select(Listing).where(Listing.seller_id == uid).order_by(Listing.created_at.desc())
            ).all()
            reviews = session.scalars(
                select(Review).where(Review.target_id == uid).order_by(Review.created_at.desc())
            ).all()
            deals = session.scalars(
                select(Deal)
                .where(or_(Deal.buyer_id == uid, Deal.seller_id == uid))
                .order_by(Deal.created_at.desc())
            ).all()
            return AdminUserDetail(
                row=_row(user, len(listings)),
                listings=[
                    {"id": str(x.id), "status": x.status, "price_kopecks": x.price_kopecks}
                    for x in listings
                ],
                reviews=[
                    {"id": str(r.id), "score": r.score, "moderation_status": r.moderation_status}
                    for r in reviews
                ],
                deals=[
                    {
                        "id": str(d.id),
                        "status": d.status,
                        "role": "buyer" if d.buyer_id == uid else "seller",
                        "amount_kopecks": d.amount_kopecks,
                    }
                    for d in deals
                ],
            )

    def set_status(self, user_id: str, status: str) -> bool:
        uid = _maybe_uuid(user_id)
        if uid is None:
            return False
        with writer_session() as session:
            user = session.execute(
                select(User).where(User.id == uid).with_for_update()
            ).scalar_one_or_none()
            if user is None or user.status == "deleted":  # don't resurrect deleted accounts
                return False
            user.status = status
            return True

    def update(self, user_id: str, display_name: str | None, city_id: str | None) -> bool:
        uid = _maybe_uuid(user_id)
        if uid is None:
            return False
        with writer_session() as session:
            user = session.get(User, uid)
            if user is None:
                return False
            if display_name is not None:
                user.display_name = display_name
            if city_id is not None:
                user.city_id = city_id
            return True
