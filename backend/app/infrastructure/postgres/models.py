"""ORM models (infrastructure). Domain logic never depends on these directly;
repositories map ORM rows to/from domain types.

🔒 = PII / sensitive (SECURITY §2). Phone is stored normalized for login lookup;
it is masked in logs at the formatter (T-07), never logged in the clear.
"""

from __future__ import annotations

import uuid

from sqlalchemy import (
    ARRAY,
    CheckConstraint,
    ForeignKey,
    Numeric,
    String,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.postgres.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

USER_STATUSES = ("active", "limited", "blocked")


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("status IN ('active', 'limited', 'blocked')", name="status_valid"),
    )

    phone: Mapped[str] = mapped_column(String(16), unique=True, nullable=False)  # 🔒
    display_name: Mapped[str | None] = mapped_column(String(64))
    city_id: Mapped[str | None] = mapped_column(String(8))
    roles: Mapped[list[str]] = mapped_column(
        ARRAY(String(16)), nullable=False, server_default=text("'{buyer}'")
    )
    seller_rating: Mapped[float | None] = mapped_column(Numeric(3, 2))
    status: Mapped[str] = mapped_column(String(16), nullable=False, server_default=text("'active'"))

    consents: Mapped[list[Consent]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Consent(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """ФЗ-152 consent record — one per acceptance (versioned, audited)."""

    __tablename__ = "consents"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    policy_version: Mapped[str] = mapped_column(String(32), nullable=False)
    source_channel: Mapped[str] = mapped_column(String(16), nullable=False)

    user: Mapped[User] = relationship(back_populates="consents")
