"""Notification delivery providers. MVP stubs that log the send — the real
Yandex-SMTP email adapter (port 465 implicit TLS) and the mobile push adapter
land later (they need creds/SDKs → ADR). Telegram is deferred (Phase 2).

Implements the PushProvider / EmailProvider ports. PII is not logged — only the
recipient id and the notification kind/subject."""

from __future__ import annotations

import logging

logger = logging.getLogger("rebloom.notifications")


class LogPushProvider:
    """Implements :class:`app.core.notifications.ports.PushProvider`."""

    def send(self, user_id: str, title: str, body: str) -> None:
        logger.info("push → user=%s title=%s", user_id, title)


class LogEmailProvider:
    """Implements :class:`app.core.notifications.ports.EmailProvider`."""

    def send(self, user_id: str, subject: str, body: str) -> None:
        logger.info("email → user=%s subject=%s", user_id, subject)
