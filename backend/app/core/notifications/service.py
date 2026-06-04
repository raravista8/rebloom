"""Notification enqueue (FR-050/090). Writes a notifiable event to the outbox,
fanned out across channels and deduped by ``event_id`` so the same event never
produces more than one notification per channel (idempotent)."""

from __future__ import annotations

from app.core.notifications.ports import NotificationOutbox
from app.core.notifications.schemas import NotificationDraft, NotificationView


class NotificationService:
    def __init__(self, outbox: NotificationOutbox) -> None:
        self._outbox = outbox

    def notify(self, draft: NotificationDraft) -> int:
        """Enqueue an event for delivery. Idempotent — returns the number of new
        outbox rows (0 if this event was already queued)."""
        return self._outbox.enqueue(draft)

    def inbox(
        self, user_id: str, cursor: str | None = None, limit: int = 30
    ) -> tuple[list[NotificationView], str | None]:
        """The user's in-app notifications, newest first (FR-050)."""
        return self._outbox.list_inapp(user_id, cursor, max(1, min(limit, 100)))
