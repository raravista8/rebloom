"""Postgres deals repository — no-escrow status path (ADR-0013).

Every transition is one writer transaction that locks the deal row
(SELECT … FOR UPDATE) and updates conditionally on the current status, so a
concurrent confirm/cancel/report settles exactly once. The platform moves no
money — there is no ledger/payment here.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.core.deals.ports import DealView, ListingSummary
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Deal, Listing, User


def _to_view(deal: Deal) -> DealView:
    return DealView(
        id=str(deal.id),
        status=deal.status,
        listing_id=str(deal.listing_id),
        buyer_id=str(deal.buyer_id),
        seller_id=str(deal.seller_id),
        amount_kopecks=deal.amount_kopecks,
        delivery_method=deal.delivery_method,
        done_at=deal.released_at.isoformat() if deal.released_at else None,
        created_at=deal.created_at.isoformat() if deal.created_at else None,
    )


def _rating(user: User | None) -> float | None:
    if user is None or user.seller_rating is None:
        return None
    return float(user.seller_rating)


def _enrich(session: Session, deals: list[Deal]) -> list[DealView]:
    """Add display fields (listing cover/price, party names/ratings) in 2 batched
    queries (no N+1)."""
    if not deals:
        return []
    listing_ids = {d.listing_id for d in deals}
    user_ids = {d.buyer_id for d in deals} | {d.seller_id for d in deals}
    listings = {
        lst.id: lst
        for lst in session.scalars(
            select(Listing).options(selectinload(Listing.photos)).where(Listing.id.in_(listing_ids))
        ).all()
    }
    users = {u.id: u for u in session.scalars(select(User).where(User.id.in_(user_ids))).all()}
    out: list[DealView] = []
    for d in deals:
        lst = listings.get(d.listing_id)
        thumb = None
        if lst is not None and lst.photos:
            thumb = (lst.photos[0].variants or {}).get("thumb")
        buyer, seller = users.get(d.buyer_id), users.get(d.seller_id)
        out.append(
            DealView(
                id=str(d.id),
                status=d.status,
                listing_id=str(d.listing_id),
                buyer_id=str(d.buyer_id),
                seller_id=str(d.seller_id),
                amount_kopecks=d.amount_kopecks,
                delivery_method=d.delivery_method,
                done_at=d.released_at.isoformat() if d.released_at else None,
                created_at=d.created_at.isoformat() if d.created_at else None,
                listing_thumb_url=thumb,
                listing_price_kopecks=lst.price_kopecks if lst is not None else None,
                buyer_name=buyer.display_name if buyer is not None else None,
                buyer_rating=_rating(buyer),
                seller_name=seller.display_name if seller is not None else None,
                seller_rating=_rating(seller),
            )
        )
    return out


class PostgresListingReader:
    """Implements :class:`app.core.deals.ports.ListingReader` (primary read)."""

    def get_summary(self, listing_id: str) -> ListingSummary | None:
        try:
            lid = uuid.UUID(listing_id)
        except ValueError:
            return None
        with writer_session() as session:
            row = session.get(Listing, lid)
            if row is None:
                return None
            return ListingSummary(
                id=str(row.id),
                status=row.status,
                price_kopecks=row.price_kopecks,
                seller_id=str(row.seller_id),
            )


class PostgresDealRepository:
    """Implements :class:`app.core.deals.ports.DealRepository`."""

    def create_and_reserve(
        self,
        *,
        buyer_id: str,
        listing_id: str,
        seller_id: str,
        amount_kopecks: int,
        delivery_method: str,
    ) -> DealView | None:
        with writer_session() as session:
            listing = session.execute(
                select(Listing).where(Listing.id == uuid.UUID(listing_id)).with_for_update()
            ).scalar_one_or_none()
            if listing is None or listing.status != "active":
                return None  # not reservable under the lock
            listing.status = "reserved"
            deal = Deal(
                buyer_id=uuid.UUID(buyer_id),
                seller_id=uuid.UUID(seller_id),
                listing_id=uuid.UUID(listing_id),
                amount_kopecks=amount_kopecks,  # reference price, not a charge
                commission_kopecks=0,  # no-escrow: platform takes nothing (ADR-0013)
                status="agreed",
                delivery_method=delivery_method,
            )
            session.add(deal)
            session.flush()
            return _to_view(deal)

    def get(self, deal_id: str) -> DealView | None:
        try:
            did = uuid.UUID(deal_id)
        except ValueError:
            return None
        with writer_session() as session:
            deal = session.get(Deal, did)
            return _enrich(session, [deal])[0] if deal is not None else None

    def list_for_user(
        self, user_id: str, *, role: str | None = None, status: str | None = None, limit: int = 20
    ) -> list[DealView]:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return []
        stmt = select(Deal)
        if role == "buyer":
            stmt = stmt.where(Deal.buyer_id == uid)
        elif role == "seller":
            stmt = stmt.where(Deal.seller_id == uid)
        else:
            stmt = stmt.where(or_(Deal.buyer_id == uid, Deal.seller_id == uid))
        if status:
            stmt = stmt.where(Deal.status == status)
        stmt = stmt.order_by(Deal.created_at.desc()).limit(min(max(limit, 1), 100))
        with reader_session() as session:
            return _enrich(session, list(session.scalars(stmt).all()))

    def list_all(self, *, status: str | None = None, limit: int = 50) -> list[DealView]:
        stmt = select(Deal)
        if status:
            stmt = stmt.where(Deal.status == status)
        stmt = stmt.order_by(Deal.created_at.desc()).limit(min(max(limit, 1), 200))
        with reader_session() as session:
            return _enrich(session, list(session.scalars(stmt).all()))

    def parties(self, deal_id: str) -> tuple[str, str] | None:
        """Narrow authz read for chat (DealPartyReader): (buyer_id, seller_id)."""
        try:
            did = uuid.UUID(deal_id)
        except ValueError:
            return None
        with reader_session() as session:
            deal = session.get(Deal, did)
            if deal is None:
                return None
            return str(deal.buyer_id), str(deal.seller_id)

    # ── status transitions (conditional, row-locked → exactly-once) ──────────────

    def _transition(
        self,
        deal_id: str,
        *,
        allowed_from: frozenset[str],
        target: str,
        listing_status: str | None = None,
        set_done: bool = False,
    ) -> DealView | None:
        try:
            did = uuid.UUID(deal_id)
        except ValueError:
            return None
        with writer_session() as session:
            deal = session.execute(
                select(Deal).where(Deal.id == did).with_for_update()
            ).scalar_one_or_none()
            if deal is None or deal.status not in allowed_from:
                return None  # raced / illegal — exactly-once
            deal.status = target
            if set_done:
                deal.released_at = datetime.now(UTC)
            if listing_status is not None:
                listing = session.get(Listing, deal.listing_id)
                if listing is not None:
                    listing.status = listing_status
            return _to_view(deal)

    def to_meeting(self, deal_id: str) -> DealView | None:
        return self._transition(deal_id, allowed_from=frozenset({"agreed"}), target="meeting")

    def mark_done(self, deal_id: str) -> DealView | None:
        return self._transition(
            deal_id,
            allowed_from=frozenset({"agreed", "meeting"}),
            target="done",
            listing_status="sold",
            set_done=True,
        )

    def report(self, deal_id: str) -> DealView | None:
        return self._transition(
            deal_id, allowed_from=frozenset({"agreed", "meeting"}), target="problem"
        )

    def cancel(self, deal_id: str) -> DealView | None:
        return self._transition(
            deal_id,
            allowed_from=frozenset({"agreed", "meeting", "problem"}),
            target="cancelled",
            listing_status="active",
        )

    def resolve_problem(self, deal_id: str, action: str) -> DealView | None:
        if action == "done":
            return self._transition(
                deal_id,
                allowed_from=frozenset({"problem"}),
                target="done",
                listing_status="sold",
                set_done=True,
            )
        if action == "cancelled":
            return self._transition(
                deal_id,
                allowed_from=frozenset({"problem"}),
                target="cancelled",
                listing_status="active",
            )
        return None

    # ── pickup address (T-13 gate via DeliveryService) ───────────────────────────

    def set_pickup_address(self, deal_id: str, address_enc: str) -> bool:
        try:
            did = uuid.UUID(deal_id)
        except ValueError:
            return False
        with writer_session() as session:
            deal = session.get(Deal, did)
            if deal is None:
                return False
            deal.pickup_address_enc = address_enc
            return True

    def get_pickup_address_enc(self, deal_id: str) -> str | None:
        try:
            did = uuid.UUID(deal_id)
        except ValueError:
            return None
        with reader_session() as session:
            deal = session.get(Deal, did)
            return deal.pickup_address_enc if deal is not None else None
