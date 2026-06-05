"""Notification copy + drafts for domain events (NOTIFICATIONS.md §2-3).

Each builder produces a :class:`NotificationDraft` with a *deterministic*
``event_id`` so re-processing (retried webhook, duplicate confirm) never sends a
second notification — idempotency is enforced by the outbox unique key.

RU copy, brand «Передарим» tone (warm, plain). Money/deal events use all
reliable channels; chat messages skip email (per-message email is spammy)."""

from __future__ import annotations

from app.core.notifications.schemas import Channel, NotificationDraft

_MESSAGE_CHANNELS: tuple[Channel, ...] = ("inapp", "push")


def deal_agreed(deal_id: str, seller_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:agreed",
        user_id=seller_id,
        kind="deal_status",
        title="Новый покупатель",
        body="Покупатель написал по вашему букету — откройте чат и договоритесь о встрече.",
        payload={"deal_id": deal_id, "status": "agreed"},
    )


def deal_meeting(deal_id: str, buyer_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:meeting",
        user_id=buyer_id,
        kind="deal_status",
        title="Продавец назначил встречу",
        body="Продавец поделился местом самовывоза — посмотрите детали в сделке.",
        payload={"deal_id": deal_id, "status": "meeting"},
    )


def deal_done(deal_id: str, recipient_id: str, *, is_seller: bool) -> NotificationDraft:
    body = (
        "Покупатель подтвердил, что забрал букет. Спасибо! Оставьте отзыв."
        if is_seller
        else "Вы подтвердили получение. Спасибо! Оставьте отзыв продавцу."
    )
    return NotificationDraft(
        event_id=f"deal:{deal_id}:done:{'seller' if is_seller else 'buyer'}",
        user_id=recipient_id,
        kind="deal_status",
        title="Сделка завершена",
        body=body,
        payload={"deal_id": deal_id, "status": "done"},
    )


def deal_reported(deal_id: str, recipient_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:problem",
        user_id=recipient_id,
        kind="dispute",
        title="Жалоба по сделке",
        body="По вашей сделке оставлена жалоба. Её рассмотрит поддержка.",
        payload={"deal_id": deal_id, "status": "problem"},
    )


def deal_problem_resolved(deal_id: str, recipient_id: str, outcome: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:problem_resolved:{recipient_id}",
        user_id=recipient_id,
        kind="dispute",
        title="Жалоба рассмотрена",
        body="Поддержка рассмотрела жалобу по сделке. Подробности — в сделке.",
        payload={"deal_id": deal_id, "outcome": outcome},
    )


def new_message(message_id: str, deal_id: str, recipient_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"msg:{message_id}",
        user_id=recipient_id,
        kind="new_message",
        title="Новое сообщение",
        body="Вам пришло новое сообщение по сделке.",
        channels=_MESSAGE_CHANNELS,
        payload={"deal_id": deal_id},
    )
