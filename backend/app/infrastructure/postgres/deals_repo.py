"""Postgres deals repository — the transactional money path (SECURITY T-03).

Every mutation is one writer transaction; ``mark_paid`` and ``release`` take a
row lock (SELECT … FOR UPDATE) so a retried webhook and a confirm can't both
settle. The ledger invariant (:func:`can_apply`) is re-checked under the lock.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import cast

from sqlalchemy import select

from app.core.deals.ledger import (
    LedgerEntry,
    LedgerKind,
    build_partial_entries,
    build_refund_entries,
    build_release_entries,
    can_apply,
)
from app.core.deals.ports import DealView, ListingSummary
from app.infrastructure.postgres.engine import reader_session, writer_session
from app.infrastructure.postgres.models import Deal, Listing, Payment, Payout
from app.infrastructure.postgres.models import LedgerEntry as LedgerRow


def _to_view(deal: Deal) -> DealView:
    return DealView(
        id=str(deal.id),
        status=deal.status,
        listing_id=str(deal.listing_id),
        buyer_id=str(deal.buyer_id),
        seller_id=str(deal.seller_id),
        amount_kopecks=deal.amount_kopecks,
        commission_kopecks=deal.commission_kopecks,
        delivery_method=deal.delivery_method,
        released_at=deal.released_at.isoformat() if deal.released_at else None,
    )


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
        commission_kopecks: int,
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
                amount_kopecks=amount_kopecks,
                commission_kopecks=commission_kopecks,
                status="created",
                delivery_method=delivery_method,
            )
            session.add(deal)
            session.flush()
            return _to_view(deal)

    def attach_payment(self, deal_id: str, yk_payment_id: str, idempotency_key: str) -> None:
        with writer_session() as session:
            session.add(
                Payment(
                    deal_id=uuid.UUID(deal_id),
                    yk_payment_id=yk_payment_id,
                    idempotency_key=idempotency_key,
                    status="pending",
                )
            )

    def get(self, deal_id: str) -> DealView | None:
        try:
            did = uuid.UUID(deal_id)
        except ValueError:
            return None
        with writer_session() as session:
            deal = session.get(Deal, did)
            return _to_view(deal) if deal is not None else None

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

    def mark_paid(self, yk_payment_id: str) -> DealView | None:
        with writer_session() as session:
            payment = session.execute(
                select(Payment).where(Payment.yk_payment_id == yk_payment_id)
            ).scalar_one_or_none()
            if payment is None:
                return None
            deal = session.execute(
                select(Deal).where(Deal.id == payment.deal_id).with_for_update()
            ).scalar_one_or_none()
            if deal is None:
                return None
            if deal.status != "created":
                return _to_view(deal)  # idempotent: already held or further along
            deal.status = "paid_held"
            payment.status = "succeeded"
            payment.captured_at = datetime.now(UTC)
            session.add(LedgerRow(deal_id=deal.id, kind="hold", amount_kopecks=deal.amount_kopecks))
            return _to_view(deal)

    def release(self, deal_id: str) -> DealView | None:
        with writer_session() as session:
            deal = session.execute(
                select(Deal).where(Deal.id == uuid.UUID(deal_id)).with_for_update()
            ).scalar_one_or_none()
            if deal is None or deal.status not in ("paid_held", "disputed"):
                return None  # already settled / illegal — exactly-once release

            existing = [
                LedgerEntry(str(deal.id), cast(LedgerKind, row.kind), row.amount_kopecks)
                for row in session.scalars(
                    select(LedgerRow).where(LedgerRow.deal_id == deal.id)
                ).all()
            ]
            new = build_release_entries(str(deal.id), deal.amount_kopecks, deal.commission_kopecks)
            if not can_apply(existing, new):
                return None  # ledger invariant guard (defence in depth)
            for entry in new:
                session.add(
                    LedgerRow(deal_id=deal.id, kind=entry.kind, amount_kopecks=entry.amount_kopecks)
                )
            deal.status = "released"
            deal.released_at = datetime.now(UTC)
            listing = session.get(Listing, deal.listing_id)
            if listing is not None:
                listing.status = "sold"
            return _to_view(deal)

    def open_dispute(self, deal_id: str) -> DealView | None:
        with writer_session() as session:
            deal = session.execute(
                select(Deal).where(Deal.id == uuid.UUID(deal_id)).with_for_update()
            ).scalar_one_or_none()
            if deal is None or deal.status != "paid_held":
                return None  # only a held deal can be disputed; funds stay held
            deal.status = "disputed"
            return _to_view(deal)

    def resolve_dispute(
        self, deal_id: str, action: str, refund_kopecks: int = 0
    ) -> DealView | None:
        with writer_session() as session:
            deal = session.execute(
                select(Deal).where(Deal.id == uuid.UUID(deal_id)).with_for_update()
            ).scalar_one_or_none()
            if deal is None or deal.status != "disputed":
                return None  # exactly-once resolution

            if action == "release":
                new = build_release_entries(
                    str(deal.id), deal.amount_kopecks, deal.commission_kopecks
                )
                deal_status, listing_status = "released", "sold"
            elif action == "refund":
                new = build_refund_entries(str(deal.id), deal.amount_kopecks)
                deal_status, listing_status = "refunded", "archived"
            elif action == "partial":
                if not (0 < refund_kopecks < deal.amount_kopecks):
                    return None
                new = build_partial_entries(
                    str(deal.id), refund_kopecks, deal.amount_kopecks - refund_kopecks
                )
                deal_status, listing_status = "refunded", "sold"
            else:
                return None

            existing = [
                LedgerEntry(str(deal.id), cast(LedgerKind, row.kind), row.amount_kopecks)
                for row in session.scalars(
                    select(LedgerRow).where(LedgerRow.deal_id == deal.id)
                ).all()
            ]
            if not can_apply(existing, new):
                return None  # ledger invariant guard
            for entry in new:
                session.add(
                    LedgerRow(deal_id=deal.id, kind=entry.kind, amount_kopecks=entry.amount_kopecks)
                )
            deal.status = deal_status
            deal.released_at = datetime.now(UTC)
            listing = session.get(Listing, deal.listing_id)
            if listing is not None:
                listing.status = listing_status
            return _to_view(deal)

    def record_payout(self, deal_id: str, yk_payout_id: str, fiscal_receipt_id: str | None) -> None:
        with writer_session() as session:
            session.add(
                Payout(
                    deal_id=uuid.UUID(deal_id),
                    yk_payout_id=yk_payout_id,
                    fiscal_receipt_id=fiscal_receipt_id,
                    status="succeeded",
                )
            )
