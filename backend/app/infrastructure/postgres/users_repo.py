"""Postgres UserRepository — maps the User ORM row to the UserView domain type.

Auth reads use the **primary** (writer) connection, not the replica: correctness
right after signup matters more than offloading these low-volume lookups, and we
must not miss a just-created user due to replication lag.
"""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.core.users.schemas import UserView
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import User


def _to_view(user: User) -> UserView:
    return UserView(
        id=str(user.id),
        phone=user.phone,
        display_name=user.display_name,
        city_id=user.city_id,
        roles=tuple(user.roles),
        seller_rating=float(user.seller_rating) if user.seller_rating is not None else None,
        status=user.status,
    )


class PostgresUserRepository:
    """Implements :class:`app.core.users.ports.UserRepository`."""

    def get_or_create_by_phone(self, phone: str) -> UserView:
        with writer_session() as session:
            user = session.scalar(select(User).where(User.phone == phone))
            if user is None:
                user = User(phone=phone, roles=["buyer"], status="active")
                session.add(user)
                session.flush()
            return _to_view(user)

    def get_by_id(self, user_id: str) -> UserView | None:
        try:
            pk = uuid.UUID(user_id)
        except ValueError:
            return None
        with writer_session() as session:
            user = session.get(User, pk)
            return _to_view(user) if user is not None else None

    def get_totp_secret(self, user_id: str) -> str | None:
        try:
            pk = uuid.UUID(user_id)
        except ValueError:
            return None
        with writer_session() as session:
            user = session.get(User, pk)
            return user.totp_secret if user is not None else None
