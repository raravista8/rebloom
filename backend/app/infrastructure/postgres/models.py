"""ORM models (infrastructure). Domain logic never depends on these directly;
repositories map ORM rows to/from domain types.

🔒 = PII / sensitive (SECURITY §2). Phone is stored normalized for login lookup;
it is masked in logs at the formatter (T-07), never logged in the clear.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    ARRAY,
    JSON,
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
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


class City(TimestampMixin, Base):
    """Launch city (PRD §9). Geo is scoped by ``city_id`` (slug) from day one;
    rollout is gated per-city by ``enabled``."""

    __tablename__ = "cities"

    id: Mapped[str] = mapped_column(String(8), primary_key=True)  # slug, e.g. "msk"
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    population: Mapped[int] = mapped_column(Integer, nullable=False)
    wave: Mapped[int] = mapped_column(Integer, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))


class Listing(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "listings"
    __table_args__ = (
        CheckConstraint(
            "status IN ('draft','pending_review','active','reserved','sold','archived')",
            name="status_valid",
        ),
        CheckConstraint("price_kopecks > 0", name="price_positive"),
    )

    seller_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    size: Mapped[str] = mapped_column(String(2), nullable=False)
    freshness: Mapped[str] = mapped_column(String(8), nullable=False)
    price_kopecks: Mapped[int] = mapped_column(BigInteger, nullable=False)
    city_id: Mapped[str] = mapped_column(String(8), nullable=False, index=True)
    geo_coarse: Mapped[str | None] = mapped_column(String(128))  # 🔒 coarse until paid
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default=text("'draft'"), index=True
    )
    like_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    freshness_score: Mapped[float] = mapped_column(
        Numeric(6, 4), nullable=False, server_default=text("0")
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    seller: Mapped[User] = relationship()
    photos: Mapped[list[Photo]] = relationship(back_populates="listing")
    likes: Mapped[list[Like]] = relationship(back_populates="listing", cascade="all, delete-orphan")


class Photo(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "photos"
    __table_args__ = (
        CheckConstraint(
            "moderation_status IN ('pending','approved','rejected')",
            name="moderation_status_valid",
        ),
    )

    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    listing_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("listings.id", ondelete="SET NULL"), index=True
    )
    object_key: Mapped[str] = mapped_column(String(128), nullable=False)
    content_type: Mapped[str] = mapped_column(String(32), nullable=False)
    variants: Mapped[dict[str, str] | None] = mapped_column(JSON)
    exif_stripped: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("false")
    )
    moderation_status: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default=text("'pending'")
    )

    listing: Mapped[Listing | None] = relationship(back_populates="photos")


class Like(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "listing_id", name="user_listing"),)

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    listing_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True
    )

    listing: Mapped[Listing] = relationship(back_populates="likes")
