"""Notification copy + drafts for domain events (NOTIFICATIONS.md §2-3).

Each builder produces a :class:`NotificationDraft` with a *deterministic*
``event_id`` so re-processing (retried webhook, duplicate confirm) never sends a
second notification — idempotency is enforced by the outbox unique key.

RU copy, brand «Передарим» tone (warm, plain). Money/deal events use all
reliable channels; chat messages skip email (per-message email is spammy)."""

from __future__ import annotations

from app.core.notifications.schemas import Channel, NotificationDraft

_MESSAGE_CHANNELS: tuple[Channel, ...] = ("inapp", "push")


def deal_paid(deal_id: str, seller_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:paid",
        user_id=seller_id,
        kind="deal_status",
        title="Букет оплачен",
        body="Покупатель оплатил — деньги в безопасной сделке. Договоритесь о передаче.",
        payload={"deal_id": deal_id, "status": "paid_held"},
    )


def deal_released(deal_id: str, recipient_id: str, *, is_seller: bool) -> NotificationDraft:
    body = (
        "Покупатель подтвердил получение — выплата отправлена."
        if is_seller
        else "Вы подтвердили получение. Спасибо! Оставьте отзыв продавцу."
    )
    return NotificationDraft(
        event_id=f"deal:{deal_id}:released:{'seller' if is_seller else 'buyer'}",
        user_id=recipient_id,
        kind="deal_status",
        title="Сделка завершена",
        body=body,
        payload={"deal_id": deal_id, "status": "released"},
    )


def dispute_opened(deal_id: str, recipient_id: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:dispute_opened",
        user_id=recipient_id,
        kind="dispute",
        title="Открыт спор по сделке",
        body="По вашей сделке открыт спор. Деньги заморожены до решения поддержки.",
        payload={"deal_id": deal_id, "status": "disputed"},
    )


def dispute_resolved(deal_id: str, recipient_id: str, outcome: str) -> NotificationDraft:
    return NotificationDraft(
        event_id=f"deal:{deal_id}:dispute_resolved:{recipient_id}",
        user_id=recipient_id,
        kind="dispute",
        title="Спор решён",
        body="Поддержка приняла решение по спору. Подробности — в сделке.",
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
