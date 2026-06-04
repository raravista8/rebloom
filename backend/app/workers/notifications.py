"""Notification delivery worker (NOTIFICATIONS.md §6). Drains pending outbox rows
through the per-channel providers; in-app rows are 'delivered' by existing (read
via the API). Failures increment attempts and retry on later runs until the cap,
then land in ``failed`` for inspection. Runs periodically (cron / RQ-scheduler).
"""

from __future__ import annotations

import logging

from app.core.notifications.ports import (
    EmailProvider,
    NotificationOutbox,
    PushProvider,
)

logger = logging.getLogger("rebloom.workers.notifications")

MAX_ATTEMPTS = 5
_BATCH = 100


def deliver_pending(
    outbox: NotificationOutbox,
    push: PushProvider,
    email: EmailProvider,
    max_attempts: int = MAX_ATTEMPTS,
) -> int:
    """Deliver one batch of pending notifications. Returns the count delivered."""
    delivered = 0
    for row in outbox.list_pending(_BATCH):
        try:
            if row.channel == "push":
                push.send(row.user_id, row.title, row.body)
            elif row.channel == "email":
                email.send(row.user_id, row.title, row.body)
            # "inapp" needs no external delivery — it's read via the API.
            outbox.mark_sent(row.id)
            delivered += 1
        except Exception:
            logger.warning("notification %s (%s) delivery failed", row.id, row.channel)
            outbox.mark_attempt_failed(row.id, max_attempts)
    logger.info("delivered %d notifications", delivered)
    return delivered


def main() -> None:
    from app.config import get_settings
    from app.infrastructure.logging import configure_logging
    from app.infrastructure.notifications import LogEmailProvider, LogPushProvider
    from app.infrastructure.postgres.notifications_repo import PostgresNotificationOutbox

    configure_logging(get_settings().log_level)
    deliver_pending(PostgresNotificationOutbox(), LogPushProvider(), LogEmailProvider())


if __name__ == "__main__":
    main()
