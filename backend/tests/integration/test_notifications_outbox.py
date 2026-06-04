"""T12.1a — notification outbox against real Postgres: enqueue is idempotent
(dedup by event+channel+user via the unique key); the worker drains pending."""

from __future__ import annotations

import secrets

import pytest
from app.core.notifications.schemas import NotificationDraft
from app.infrastructure.notifications import LogEmailProvider, LogPushProvider
from app.infrastructure.postgres.notifications_repo import PostgresNotificationOutbox
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.workers.notifications import deliver_pending

pytestmark = pytest.mark.integration


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def _draft(user_id: str, event_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=event_id,
        user_id=user_id,
        kind="deal_status",
        title="Статус сделки",
        body="Обновление по вашей сделке",
        channels=("inapp", "push", "email"),
    )


def test_enqueue_dedup_and_worker_drains() -> None:
    user = PostgresUserRepository().get_or_create_by_phone(_phone())
    outbox = PostgresNotificationOutbox()
    event_id = f"evt-{secrets.token_hex(6)}"

    assert outbox.enqueue(_draft(user.id, event_id)) == 3  # one per channel
    assert outbox.enqueue(_draft(user.id, event_id)) == 0  # idempotent rerun

    # In-app inbox shows the inapp row only.
    inapp, _cursor = outbox.list_inapp(user.id, None, 50)
    assert any(n.kind == "deal_status" for n in inapp)

    # Worker drains all pending (this user's 3 + possibly others'); ours go sent.
    deliver_pending(outbox, LogPushProvider(), LogEmailProvider())
    pending_ids = {r.id for r in outbox.list_pending(500)}
    inapp_after, _ = outbox.list_inapp(user.id, None, 50)
    assert inapp_after  # inapp persists (read via API), now status=sent
    # None of *our* event's rows remain pending.
    assert all(r.user_id != user.id for r in outbox.list_pending(500) if r.id in pending_ids)
