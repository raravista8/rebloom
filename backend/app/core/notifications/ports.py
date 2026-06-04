"""Notification ports — the transactional outbox + per-channel delivery providers
(NOTIFICATIONS.md §6). Adapters live in ``infrastructure``."""

from __future__ import annotations

from typing import Protocol

from app.core.notifications.schemas import Channel, NotificationDraft, NotificationView


class Notifier(Protocol):
    """The narrow capability domain services depend on to raise a notification."""

    def notify(self, draft: NotificationDraft) -> int: ...


class OutboxRow(Protocol):
    id: str
    user_id: str
    channel: Channel
    kind: str
    title: str
    body: str
    attempts: int


class NotificationOutbox(Protocol):
    def enqueue(self, draft: NotificationDraft) -> int:
        """Insert one row per channel, idempotently (dedup by event+channel+user).
        Returns how many NEW rows were created (0 if the event was already queued)."""
        ...

    def list_pending(self, limit: int) -> list[OutboxRow]: ...
    def mark_sent(self, row_id: str) -> None: ...
    def mark_attempt_failed(self, row_id: str, max_attempts: int) -> None:
        """Increment attempts; mark ``failed`` once ``max_attempts`` is reached,
        otherwise leave ``pending`` for the next run (retry with backoff)."""
        ...

    def list_inapp(
        self, user_id: str, cursor: str | None, limit: int
    ) -> tuple[list[NotificationView], str | None]: ...


class PushProvider(Protocol):
    def send(self, user_id: str, title: str, body: str) -> None: ...


class EmailProvider(Protocol):
    def send(self, user_id: str, subject: str, body: str) -> None: ...
