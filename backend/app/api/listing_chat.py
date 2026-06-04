"""Pre-purchase listing chat endpoints (FR-030, T6.3). Seller-or-buyer only;
contacts held (T-05); sender rate-limited (T-08)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.core.listings.chat import ListingChatService
from app.core.moderation.service import ModerationService
from app.core.result import Ok
from app.infrastructure.moderation import load_lexicon
from app.infrastructure.postgres.listing_chat_repo import (
    PostgresListingChatRepository,
    PostgresListingSellerReader,
)
from app.infrastructure.ratelimit import RedisRateLimiter
from app.infrastructure.realtime import RedisRealtimeBus

router = APIRouter(tags=["listing-chat"])


class ListingMessageIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    body: str = Field(min_length=1, max_length=2000)
    buyer_id: str | None = None  # required only when the seller replies to a thread


def get_listing_chat_service() -> ListingChatService:
    return ListingChatService(
        PostgresListingSellerReader(),
        PostgresListingChatRepository(),
        ModerationService(load_lexicon()),
        RedisRateLimiter(),
        bus=RedisRealtimeBus(),
    )


ListingChatServiceDep = Annotated[ListingChatService, Depends(get_listing_chat_service)]


@router.get("/api/listings/{listing_id}/messages", response_model=None)
def list_thread(
    listing_id: str,
    request: Request,
    user: RequireUserDep,
    service: ListingChatServiceDep,
    buyer_id: str | None = Query(None),
    cursor: str | None = Query(None),
) -> dict[str, Any] | JSONResponse:
    result = service.list_thread(user.id, listing_id, buyer_id, cursor)
    if isinstance(result, Ok):
        messages, next_cursor = result.value
        return ok(
            {
                "messages": [m.to_api(viewer_id=user.id) for m in messages],
                "next_cursor": next_cursor,
            }
        )
    return domain_error_response(request, result.error)


@router.post("/api/listings/{listing_id}/messages", response_model=None)
def post_message(
    listing_id: str,
    payload: ListingMessageIn,
    request: Request,
    user: RequireUserDep,
    service: ListingChatServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.post(user.id, listing_id, payload.body, payload.buyer_id)
    if isinstance(result, Ok):
        return ok({"message": result.value.to_api(viewer_id=user.id)})
    return domain_error_response(request, result.error)
