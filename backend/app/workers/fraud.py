"""Fraud scan worker (FR-073). Periodically evaluates rule-based signals over the
deals/listings tables and records them (idempotent per user+type). MVP signals:
dispute-rate (sellers with a high share of disputed deals) and listing velocity.
IP/device signals (multi-account, self-dealing) land with the analytics events."""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select

from app.core.fraud.rules import dispute_rate_score, velocity_score
from app.infrastructure.postgres.engine import reader_session
from app.infrastructure.postgres.fraud_repo import PostgresFraudRepo
from app.infrastructure.postgres.models import Deal, Listing

logger = logging.getLogger("rebloom.workers.fraud")


def scan(now: datetime | None = None) -> int:
    """Run all rule scans; return the number of signals recorded."""
    now = now or datetime.now(UTC)
    repo = PostgresFraudRepo()
    recorded = 0

    with reader_session() as session:
        # Dispute rate per seller.
        dispute_rows = session.execute(
            select(
                Deal.seller_id,
                func.count(),
                func.count().filter(Deal.status == "disputed"),
            ).group_by(Deal.seller_id)
        ).all()
        # Listings created in the last day per seller.
        velocity_rows = session.execute(
            select(Listing.seller_id, func.count())
            .where(Listing.created_at > now - timedelta(days=1))
            .group_by(Listing.seller_id)
        ).all()

    for seller_id, total, disputed in dispute_rows:
        score = dispute_rate_score(int(total), int(disputed))
        if score:
            repo.record(
                str(seller_id),
                "dispute_rate",
                score,
                {"total_deals": str(total), "disputed": str(disputed)},
            )
            recorded += 1

    for seller_id, count in velocity_rows:
        score = velocity_score(int(count))
        if score:
            repo.record(str(seller_id), "velocity", score, {"listings_last_day": str(count)})
            recorded += 1

    logger.info("fraud scan recorded %d signals", recorded)
    return recorded


def main() -> None:
    from app.config import get_settings
    from app.infrastructure.logging import configure_logging

    configure_logging(get_settings().log_level)
    scan()


if __name__ == "__main__":
    main()
