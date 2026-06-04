"""Retention / anonymization worker (ФЗ-152, FR-091, PRIVACY_152FZ §2-3).

Finds accounts that requested deletion more than the retention grace ago and
scrubs their PII (phone/name/city/2FA seed) in place — the row and its
(legally-required, now anonymized) ledger are kept. Idempotent: already-scrubbed
rows carry a ``del:`` phone placeholder and are skipped. FOR UPDATE SKIP LOCKED
so concurrent runs don't double-process. Runs periodically (cron / RQ-scheduler).
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.core.privacy.service import RETENTION_GRACE_DAYS
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import User

logger = logging.getLogger("rebloom.workers.retention")

_PLACEHOLDER_PREFIX = "del:"


def anonymize_due_deletions(now: datetime | None = None) -> int:
    """Scrub PII for accounts past the deletion grace. Returns the count scrubbed."""
    cutoff = (now or datetime.now(UTC)) - timedelta(days=RETENTION_GRACE_DAYS)
    audit = PostgresAuditLog()
    scrubbed = 0
    with writer_session() as session:
        due = (
            session.execute(
                select(User)
                .where(
                    User.status == "deleted",
                    User.deletion_requested_at.is_not(None),
                    User.deletion_requested_at < cutoff,
                    User.phone.not_like(f"{_PLACEHOLDER_PREFIX}%"),
                )
                .with_for_update(skip_locked=True)
            )
            .scalars()
            .all()
        )
        for user in due:
            user.phone = f"{_PLACEHOLDER_PREFIX}{user.id.hex[:12]}"  # unique, ≤16 chars
            user.display_name = None
            user.city_id = None
            user.totp_secret = None
            user.seller_rating = None
            scrubbed += 1
            # Audit references the user id only — no PII (it's being erased).
            audit.record(
                action="dsr.anonymized",
                target_type="user",
                target_id=str(user.id),
                reason="retention grace elapsed",
            )
    logger.info("anonymized %d accounts past retention grace", scrubbed)
    return scrubbed


def main() -> None:
    from app.config import get_settings
    from app.infrastructure.logging import configure_logging

    configure_logging(get_settings().log_level)
    anonymize_due_deletions()


if __name__ == "__main__":
    main()
