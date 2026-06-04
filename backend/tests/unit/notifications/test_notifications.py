"""Notification outbox + delivery (T12.1a, FR-050/090): enqueue is idempotent
(dedup by event+channel); the worker delivers per channel and retries failures."""

from __future__ import annotations

from app.core.notifications.schemas import NotificationDraft
from app.core.notifications.service import NotificationService
from app.workers.notifications import deliver_pending

from tests.fakes import (
    FakeEmailProvider,
    FakeNotificationOutbox,
    FakePushProvider,
)

USER = "user-1"


def _draft(event_id: str = "evt-1", channels: tuple[str, ...] = ("inapp", "push", "email")):  # type: ignore[no-untyped-def]
    return NotificationDraft(
        event_id=event_id,
        user_id=USER,
        kind="deal_status",
        title="Сделка оплачена",
        body="Деньги в безопасности",
        channels=channels,  # type: ignore[arg-type]
        payload={"deal_id": "D1"},
    )


def test_enqueue_fans_out_per_channel() -> None:
    outbox = FakeNotificationOutbox()
    created = NotificationService(outbox).notify(_draft())
    assert created == 3  # inapp + push + email


def test_enqueue_is_idempotent() -> None:
    outbox = FakeNotificationOutbox()
    svc = NotificationService(outbox)
    assert svc.notify(_draft("evt-9")) == 3
    assert svc.notify(_draft("evt-9")) == 0  # same event → no new rows


def test_worker_delivers_push_and_email() -> None:
    outbox = FakeNotificationOutbox()
    NotificationService(outbox).notify(_draft())
    push, email = FakePushProvider(), FakeEmailProvider()

    delivered = deliver_pending(outbox, push, email)
    assert delivered == 3  # inapp (no-op) + push + email all marked sent
    assert push.sent == [(USER, "Сделка оплачена")]
    assert email.sent == [(USER, "Сделка оплачена")]
    # All drained → a second run does nothing.
    assert deliver_pending(outbox, push, email) == 0


def test_failed_delivery_retries_then_gives_up() -> None:
    outbox = FakeNotificationOutbox()
    NotificationService(outbox).notify(_draft(channels=("push",)))
    push, email = FakePushProvider(fail=True), FakeEmailProvider()

    # Each run fails and bumps attempts; stays pending until the cap, then failed.
    for _ in range(5):
        assert deliver_pending(outbox, push, email, max_attempts=5) == 0
    assert outbox.list_pending(10) == []  # no longer pending (gave up → failed)


def test_inapp_only_channel_is_marked_sent_without_providers() -> None:
    outbox = FakeNotificationOutbox()
    NotificationService(outbox).notify(_draft(channels=("inapp",)))
    push, email = FakePushProvider(fail=True), FakeEmailProvider(fail=True)
    # inapp needs no external provider, so failing providers don't matter.
    assert deliver_pending(outbox, push, email) == 1
    assert not push.sent and not email.sent


def test_inbox_lists_inapp() -> None:
    outbox = FakeNotificationOutbox()
    NotificationService(outbox).notify(_draft())
    items, _cursor = NotificationService(outbox).inbox(USER)
    assert len(items) == 1  # only the inapp row is shown in the in-app inbox
    assert items[0].kind == "deal_status"
