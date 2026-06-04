"""Postgres notification-settings repo (FR-090). Implements NotifSettingsRepo."""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.core.notifications.settings import NotifSettings
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import User


def _settings(user: User) -> NotifSettings:
    return NotifSettings(messages=user.notif_messages, marketing=user.notif_marketing)


class PostgresNotifSettingsRepo:
    """Implements :class:`app.core.notifications.settings.NotifSettingsRepo`."""

    def get(self, user_id: str) -> NotifSettings | None:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return None
        with writer_session() as session:
            user = session.get(User, uid)
            return _settings(user) if user is not None else None

    def update(
        self, user_id: str, messages: bool | None, marketing: bool | None
    ) -> NotifSettings | None:
        try:
            uid = uuid.UUID(user_id)
        except ValueError:
            return None
        with writer_session() as session:
            user = session.execute(
                select(User).where(User.id == uid).with_for_update()
            ).scalar_one_or_none()
            if user is None:
                return None
            if messages is not None:
                user.notif_messages = messages
            if marketing is not None:
                user.notif_marketing = marketing
            return _settings(user)
