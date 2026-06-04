"""Review creation (FR-040/042): party-only, released-deal, 14-day window,
one per author, moderated text (contacts/slurs → held, hard hit → content_blocked).
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from app.core.deals.ports import DealRepository
from app.core.errors import (
    CONFLICT,
    CONTENT_BLOCKED,
    FORBIDDEN,
    NOT_FOUND,
    DomainError,
)
from app.core.moderation.service import ModerationService
from app.core.result import Err, Ok, Result
from app.core.reviews.ports import ReviewRepository
from app.core.reviews.schemas import REVIEW_WINDOW_DAYS, ReviewIn, ReviewView


class ReviewService:
    def __init__(
        self,
        reviews: ReviewRepository,
        deals: DealRepository,
        moderation: ModerationService,
    ) -> None:
        self._reviews = reviews
        self._deals = deals
        self._moderation = moderation

    def create(
        self, author_id: str, deal_id: str, payload: ReviewIn
    ) -> Result[ReviewView, DomainError]:
        deal = self._deals.get(deal_id)
        if deal is None:
            return Err(DomainError(NOT_FOUND, "deal"))
        if author_id not in (deal.buyer_id, deal.seller_id):
            return Err(DomainError(FORBIDDEN, "not_a_party"))
        if deal.status != "released" or deal.released_at is None:
            return Err(DomainError(CONFLICT, "not_released"))
        released_at = datetime.fromisoformat(deal.released_at)
        if datetime.now(UTC) - released_at > timedelta(days=REVIEW_WINDOW_DAYS):
            return Err(DomainError(CONFLICT, "review_window_closed"))

        verdict = self._moderation.check_text(payload.text)
        if verdict.is_blocked:
            return Err(DomainError(CONTENT_BLOCKED, "review_text"))
        status = "held" if verdict.needs_review else "visible"

        target_id = deal.seller_id if author_id == deal.buyer_id else deal.buyer_id
        review = self._reviews.create(
            deal_id=deal_id,
            author_id=author_id,
            target_id=target_id,
            score=payload.score,
            text=payload.text,
            moderation_status=status,
        )
        if review is None:
            return Err(DomainError(CONFLICT, "already_reviewed"))
        return Ok(review)

    def list_for_user(self, target_id: str) -> list[ReviewView]:
        return self._reviews.list_for_user(target_id)
