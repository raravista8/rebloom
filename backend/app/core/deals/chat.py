"""Deal-scoped chat (FR-030, SECURITY T-05).

Party-only. Every message runs through contact-leak detection: a message that
carries a phone/@handle/messenger link is **held** — persisted but not delivered
to the counterparty — to stop deals leaking off-platform (where there's no
escrow). Held messages are visible only to their own sender, flagged.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from app.core.errors import FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, DomainError
from app.core.moderation.service import ModerationService
from app.core.result import Err, Ok, Result


@dataclass(frozen=True, slots=True)
class MessageView:
    id: str
    deal_id: str
    sender_id: str
    body: str
    status: str  # visible | held
    created_at: str | None

    def to_api(self, *, viewer_id: str) -> dict[str, Any]:
        return {
            "id": self.id,
            "deal_id": self.deal_id,
            "sender_id": self.sender_id,
            "body": self.body,
            "status": self.status,
            "held": self.status == "held",
            "mine": self.sender_id == viewer_id,
            "created_at": self.created_at,
        }


class ChatRepository(Protocol):
    def add(self, deal_id: str, sender_id: str, body: str, status: str) -> MessageView: ...
    def list_visible_to(
        self, deal_id: str, viewer_id: str, cursor: str | None, limit: int
    ) -> tuple[list[MessageView], str | None]: ...


class DealPartyReader(Protocol):
    """Narrow read for authz — returns the two party ids, or None if no deal."""

    def parties(self, deal_id: str) -> tuple[str, str] | None: ...


MESSAGE_PAGE = 50


class ChatService:
    def __init__(
        self, deals: DealPartyReader, chat: ChatRepository, moderation: ModerationService
    ) -> None:
        self._deals = deals
        self._chat = chat
        self._moderation = moderation

    def _authorize(self, requester_id: str, deal_id: str) -> tuple[str, str] | DomainError:
        parties = self._deals.parties(deal_id)
        if parties is None:
            return DomainError(NOT_FOUND, "deal")
        if requester_id not in parties:  # IDOR guard (T-06)
            return DomainError(FORBIDDEN, "not_a_party")
        return parties

    def post_message(
        self, sender_id: str, deal_id: str, body: str
    ) -> Result[MessageView, DomainError]:
        text = body.strip()
        if not text:
            return Err(DomainError(VALIDATION_ERROR, "empty"))
        auth = self._authorize(sender_id, deal_id)
        if isinstance(auth, DomainError):
            return Err(auth)

        # Any hard hit (contacts/profanity/slurs/banned) → held: persisted but not
        # delivered to the counterparty (MODERATION.md §1, SECURITY T-05).
        verdict = self._moderation.check_text(text)
        status = "held" if verdict.is_blocked else "visible"
        return Ok(self._chat.add(deal_id, sender_id, text, status))

    def list_messages(
        self, requester_id: str, deal_id: str, cursor: str | None = None
    ) -> Result[tuple[list[MessageView], str | None], DomainError]:
        auth = self._authorize(requester_id, deal_id)
        if isinstance(auth, DomainError):
            return Err(auth)
        return Ok(self._chat.list_visible_to(deal_id, requester_id, cursor, MESSAGE_PAGE))
