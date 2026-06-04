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

USER_STATUSES = ("active", "limited", "blocked", "deleted")


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "status IN ('active', 'limited', 'blocked', 'deleted')", name="status_valid"
        ),
    )

    phone: Mapped[str] = mapped_column(String(16), unique=True, nullable=False)  # 🔒
    display_name: Mapped[str | None] = mapped_column(String(64))
    city_id: Mapped[str | None] = mapped_column(String(8))
    roles: Mapped[list[str]] = mapped_column(
        ARRAY(String(16)), nullable=False, server_default=text("'{buyer}'")
    )
    seller_rating: Mapped[float | None] = mapped_column(Numeric(3, 2))
    status: Mapped[str] = mapped_column(String(16), nullable=False, server_default=text("'active'"))
    totp_secret: Mapped[str | None] = mapped_column(String(64))  # 🔒 admin 2FA seed
    # DSR: set when the subject requests deletion (ФЗ-152); the retention job
    # anonymizes PII after the grace period (PRIVACY_152FZ.md §2-3).
    deletion_requested_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # Notification prefs (NOTIFICATIONS.md §4). "deals" is always on (critical);
    # "messages" defaults on; "marketing" is opt-in only.
    notif_messages: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("true")
    )
    notif_marketing: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("false")
    )
    risk_score: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))

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
    phash: Mapped[str | None] = mapped_column(String(16), index=True)  # dHash, T-09

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


class Deal(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Escrow deal (ARCHITECTURE §6). Money in kopecks; the ledger is the source
    of truth — these columns are denormalized convenience."""

    __tablename__ = "deals"
    __table_args__ = (
        CheckConstraint(
            "status IN ('created','paid_held','released','refunded','disputed','cancelled')",
            name="status_valid",
        ),
        CheckConstraint(
            "delivery_method IN ('self_pickup','courier')", name="delivery_method_valid"
        ),
        CheckConstraint("amount_kopecks > 0", name="amount_positive"),
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("listings.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    buyer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    seller_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    amount_kopecks: Mapped[int] = mapped_column(BigInteger, nullable=False)
    commission_kopecks: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default=text("'created'"), index=True
    )
    delivery_method: Mapped[str] = mapped_column(String(16), nullable=False)
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    ledger_entries: Mapped[list[LedgerEntry]] = relationship(back_populates="deal")


class Payment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """ЮKassa payment ref — NO card data, only provider id + status (T-07)."""

    __tablename__ = "payments"
    __table_args__ = (UniqueConstraint("idempotency_key", name="idempotency_key"),)

    deal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    yk_payment_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    idempotency_key: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(24), nullable=False)
    captured_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Payout(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "payouts"

    deal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    yk_payout_id: Mapped[str | None] = mapped_column(String(64), unique=True)
    payout_target_masked: Mapped[str | None] = mapped_column(String(32))  # 🔒 masked
    status: Mapped[str] = mapped_column(String(24), nullable=False)
    fiscal_receipt_id: Mapped[str | None] = mapped_column(String(64))


class LedgerEntry(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Append-only escrow ledger — never UPDATEd/DELETEd (SECURITY T-03/T-17)."""

    __tablename__ = "ledger_entries"
    __table_args__ = (
        CheckConstraint("kind IN ('hold','commission','payout','refund')", name="kind_valid"),
        CheckConstraint("amount_kopecks > 0", name="amount_positive"),
    )

    deal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deals.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    kind: Mapped[str] = mapped_column(String(16), nullable=False)
    amount_kopecks: Mapped[int] = mapped_column(BigInteger, nullable=False)

    deal: Mapped[Deal] = relationship(back_populates="ledger_entries")


class AuditLog(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Immutable audit trail (SECURITY §8, T-11/T-16). Append-only — a DB trigger
    (migration 0006) blocks UPDATE/DELETE. Records auth/payout/refund/release/
    moderation/admin actions with actor, target, reason, request_id."""

    __tablename__ = "audit_logs"

    actor_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), index=True
    )  # null = system
    action: Mapped[str] = mapped_column(String(48), nullable=False, index=True)
    target_type: Mapped[str] = mapped_column(String(24), nullable=False)
    target_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    reason: Mapped[str | None] = mapped_column(String(256))
    request_id: Mapped[str | None] = mapped_column(String(64))


class Review(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Mutual post-deal review (FR-040/041). One per (deal, author); held for
    moderation if the text trips contacts/slurs (FR-042)."""

    __tablename__ = "reviews"
    __table_args__ = (
        UniqueConstraint("deal_id", "author_id", name="deal_author"),
        CheckConstraint("score BETWEEN 1 AND 5", name="score_range"),
        CheckConstraint("moderation_status IN ('visible','held')", name="moderation_status_valid"),
    )

    deal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    author_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    target_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    moderation_status: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default=text("'visible'")
    )
    # NB: keep `text` (column) last — it shadows sqlalchemy's `text()` below it.
    text: Mapped[str] = mapped_column(String(2000), nullable=False)


class Message(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """🔒 Deal-scoped chat message (FR-030). Held (not delivered to the
    counterparty) when the text trips contact-leak detection (SECURITY T-05)."""

    __tablename__ = "messages"
    __table_args__ = (CheckConstraint("status IN ('visible','held')", name="message_status_valid"),)

    deal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("deals.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default=text("'visible'")
    )
    body: Mapped[str] = mapped_column(String(2000), nullable=False)


class ListingMessage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """🔒 Pre-purchase chat: a thread per (listing, prospective buyer) between the
    listing's seller and that buyer, BEFORE any deal (FR-030, T6.3). Same contact-
    leak hold as deal chat — the main anti-escrow-bypass surface (SECURITY T-05)."""

    __tablename__ = "listing_messages"
    __table_args__ = (
        CheckConstraint("status IN ('visible','held')", name="lmessage_status_valid"),
    )

    listing_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    buyer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, server_default=text("'visible'")
    )
    body: Mapped[str] = mapped_column(String(2000), nullable=False)


class UserReport(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A user's abuse report against a listing or another user (FR-064). Queued
    for moderators; resolution is audit-logged."""

    __tablename__ = "user_reports"
    __table_args__ = (
        CheckConstraint("target_type IN ('listing','user')", name="report_target_valid"),
        CheckConstraint("status IN ('open','reviewed')", name="report_status_valid"),
    )

    reporter_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    target_type: Mapped[str] = mapped_column(String(8), nullable=False)
    target_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    reason: Mapped[str] = mapped_column(String(2000), nullable=False)
    status: Mapped[str] = mapped_column(
        String(8), nullable=False, server_default=text("'open'"), index=True
    )


class SupportTicket(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A support request (FR-092, SUPPORT.md). Queued with an SLA target; resolved
    by support/admin with an audited reason."""

    __tablename__ = "support_tickets"
    __table_args__ = (CheckConstraint("status IN ('open','resolved')", name="ticket_status_valid"),)

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category: Mapped[str] = mapped_column(String(16), nullable=False)
    body: Mapped[str] = mapped_column(String(4000), nullable=False)
    status: Mapped[str] = mapped_column(
        String(8), nullable=False, server_default=text("'open'"), index=True
    )
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class FraudSignal(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """A rule-triggered risk signal on a user/deal (FR-073, ADMIN_BACKEND_TZ
    §Fraud). Aggregated into ``User.risk_score``; reviewed from the admin queue."""

    __tablename__ = "fraud_signals"
    __table_args__ = (
        CheckConstraint("status IN ('open','reviewed')", name="fraud_status_valid"),
        UniqueConstraint("user_id", "type", name="fraud_user_type"),  # idempotent re-scan
    )

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    type: Mapped[str] = mapped_column(String(32), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    evidence: Mapped[dict[str, str] | None] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(
        String(8), nullable=False, server_default=text("'open'"), index=True
    )


class Notification(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """Transactional outbox row (NOTIFICATIONS.md §6). One per (event, channel,
    user) — the unique key makes enqueue idempotent (dedup by event+channel)."""

    __tablename__ = "notifications"
    __table_args__ = (
        UniqueConstraint("event_id", "channel", "user_id", name="notif_event_channel_user"),
        CheckConstraint("channel IN ('inapp','push','email')", name="notif_channel_valid"),
        CheckConstraint("status IN ('pending','sent','failed')", name="notif_status_valid"),
    )

    event_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    channel: Mapped[str] = mapped_column(String(8), nullable=False)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    body: Mapped[str] = mapped_column(String(512), nullable=False)
    payload: Mapped[dict[str, str] | None] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(
        String(8), nullable=False, server_default=text("'pending'"), index=True
    )
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    read: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
