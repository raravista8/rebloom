"""Pre-purchase listing chat (FR-030, SECURITY T-05, AR-2). A buyer can message a
listing's seller BEFORE buying — a thread per (listing, buyer). This is the prime
place deals leak off-platform, so every message runs the contact-leak filter
(held → not delivered) and the sender is rate-limited (anti-spam / scraping).

No address/contact disclosure here — there's no deal yet, so nothing to reveal.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from app.core.errors import (
    NOT_FOUND,
    RATE_LIMITED,
    VALIDATION_ERROR,
    DomainError,
)
from app.core.moderation.service import ModerationService
from app.core.realtime.ports import RealtimeBus, listing_thread_channel
from app.core.result import Err, Ok, Result

# Anti-flood: how many messages one sender may post to one listing per window.
RATE_LIMIT = 20
RATE_WINDOW_SEC = 60
THREAD_PAGE = 50


@dataclass(frozen=True, slots=True)
class ListingMessageView:
    id: str
    listing_id: str
    buyer_id: str
    sender_id: str
    body: str
    status: str  # visible | held
    created_at: str | None

    def to_api(self, *, viewer_id: str) -> dict[str, Any]:
        return {
            "id": self.id,
            "listing_id": self.listing_id,
            "buyer_id": self.buyer_id,
            "sender_id": self.sender_id,
            "body": self.body,
            "status": self.status,
            "held": self.status == "held",
            "mine": self.sender_id == viewer_id,
            "created_at": self.created_at,
        }


class ListingChatRepo(Protocol):
    def add(
        self, listing_id: str, buyer_id: str, sender_id: str, body: str, status: str
    ) -> ListingMessageView: ...
    def list_thread(
        self, listing_id: str, buyer_id: str, cursor: str | None, limit: int
    ) -> tuple[list[ListingMessageView], str | None]: ...


class ListingSellerReader(Protocol):
    def seller_of(self, listing_id: str) -> str | None: ...


class RateLimiter(Protocol):
    def allow(self, key: str, limit: int, window_sec: int) -> bool:
        """True if this hit is within ``limit`` per ``window_sec`` for ``key``."""
        ...


class ListingChatService:
    def __init__(
        self,
        listings: ListingSellerReader,
        chat: ListingChatRepo,
        moderation: ModerationService,
        limiter: RateLimiter,
        bus: RealtimeBus | None = None,
    ) -> None:
        self._listings = listings
        self._chat = chat
        self._moderation = moderation
        self._limiter = limiter
        self._bus = bus

    def _thread_buyer(
        self, requester_id: str, listing_id: str, buyer_id: str | None
    ) -> str | DomainError:
        """Resolve which (listing, buyer) thread the requester is acting in, and
        authorize them. The seller must name a buyer thread; a buyer uses their own."""
        seller = self._listings.seller_of(listing_id)
        if seller is None:
            return DomainError(NOT_FOUND, "listing")
        if requester_id == seller:
            if not buyer_id:
                return DomainError(VALIDATION_ERROR, "buyer_id_required")
            if buyer_id == seller:
                return DomainError(VALIDATION_ERROR, "buyer_is_seller")
            return buyer_id
        # A prospective buyer always acts in their own thread.
        return requester_id

    def post(
        self, sender_id: str, listing_id: str, body: str, buyer_id: str | None = None
    ) -> Result[ListingMessageView, DomainError]:
        text = body.strip()
        if not text:
            return Err(DomainError(VALIDATION_ERROR, "empty"))
        thread_buyer = self._thread_buyer(sender_id, listing_id, buyer_id)
        if isinstance(thread_buyer, DomainError):
            return Err(thread_buyer)

        if not self._limiter.allow(f"lchat:{sender_id}:{listing_id}", RATE_LIMIT, RATE_WINDOW_SEC):
            return Err(DomainError(RATE_LIMITED, "too_many_messages"))

        verdict = self._moderation.check_text(text)
        status = "held" if verdict.is_blocked else "visible"
        message = self._chat.add(listing_id, thread_buyer, sender_id, text, status)
        if status == "visible" and self._bus is not None:
            self._bus.publish(
                listing_thread_channel(listing_id, thread_buyer),
                {
                    "type": "listing_message",
                    "listing_id": listing_id,
                    "buyer_id": thread_buyer,
                    "message": {
                        "id": message.id,
                        "sender_id": message.sender_id,
                        "body": message.body,
                        "created_at": message.created_at,
                    },
                },
            )
        return Ok(message)

    def list_thread(
        self,
        requester_id: str,
        listing_id: str,
        buyer_id: str | None = None,
        cursor: str | None = None,
    ) -> Result[tuple[list[ListingMessageView], str | None], DomainError]:
        thread_buyer = self._thread_buyer(requester_id, listing_id, buyer_id)
        if isinstance(thread_buyer, DomainError):
            return Err(thread_buyer)
        return Ok(self._chat.list_thread(listing_id, thread_buyer, cursor, THREAD_PAGE))
