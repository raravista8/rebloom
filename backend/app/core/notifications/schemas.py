"""Notification value objects (NOTIFICATIONS.md). Channels: in-app (always),
push (mobile), email (Yandex SMTP). Telegram is deferred (Phase 2)."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal

Channel = Literal["inapp", "push", "email"]
DeliveryStatus = Literal["pending", "sent", "failed"]

# Critical (deal/money) events always go to reliable channels; "messages" is
# opt-out-able, "marketing" is opt-in only (handled in T12.1b settings).
CRITICAL_CHANNELS: tuple[Channel, ...] = ("inapp", "push", "email")


@dataclass(frozen=True, slots=True)
class NotificationDraft:
    """One notifiable event for one recipient, fanned out to ``channels``.
    ``event_id`` makes the whole fan-out idempotent (dedup by event+channel)."""

    event_id: str
    user_id: str
    kind: str  # e.g. "deal_status", "new_message", "review_received"
    title: str
    body: str
    channels: tuple[Channel, ...] = CRITICAL_CHANNELS
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class NotificationView:
    id: str
    kind: str
    title: str
    body: str
    payload: dict[str, Any]
    read: bool
    created_at: str | None

    def to_api(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "kind": self.kind,
            "title": self.title,
            "body": self.body,
            "payload": self.payload,
            "read": self.read,
            "created_at": self.created_at,
        }
