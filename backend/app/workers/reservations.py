"""Agreement TTL worker (FR-022, SECURITY T-12; no-escrow ADR-0013).

Cancels deals stuck in ``agreed`` (the parties never arranged a meeting) past the
TTL and releases the listing back to ``active`` so it doesn't stay reserved
forever. No money is involved. Runs periodically (cron / RQ-scheduler in prod).
FOR UPDATE SKIP LOCKED so concurrent runs don't double-process.
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.config import get_settings
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import Deal, Listing

logger = logging.getLogger("rebloom.workers.reservations")


def expire_stale_reservations(now: datetime | None = None) -> int:
    settings = get_settings()
    cutoff = (now or datetime.now(UTC)) - timedelta(minutes=settings.reservation_ttl_minutes)
    cancelled = 0
    with writer_session() as session:
        stale = (
            session.execute(
                select(Deal)
                .where(Deal.status == "agreed", Deal.created_at < cutoff)
                .with_for_update(skip_locked=True)
            )
            .scalars()
            .all()
        )
        for deal in stale:
            deal.status = "cancelled"
            listing = session.get(Listing, deal.listing_id)
            if listing is not None and listing.status == "reserved":
                listing.status = "active"  # release the reservation
            cancelled += 1
    logger.info("expired %d stale reservations", cancelled)
    return cancelled


def main() -> None:
    from app.infrastructure.logging import configure_logging

    configure_logging(get_settings().log_level)
    expire_stale_reservations()


if __name__ == "__main__":
    main()
