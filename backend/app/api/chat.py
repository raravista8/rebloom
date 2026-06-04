"""Deal chat endpoints (API_CONTRACT §4). Party-only; contacts held (T-05)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.core.deals.chat import ChatService
from app.core.moderation.service import ModerationService
from app.core.notifications.service import NotificationService
from app.core.result import Ok
from app.infrastructure.moderation import load_lexicon
from app.infrastructure.postgres.chat_repo import PostgresChatRepository
from app.infrastructure.postgres.deals_repo import PostgresDealRepository
from app.infrastructure.postgres.notifications_repo import PostgresNotificationOutbox
from app.infrastructure.realtime import RedisRealtimeBus

router = APIRouter(tags=["chat"])


class MessageIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    body: str = Field(min_length=1, max_length=2000)


def get_chat_service() -> ChatService:
    return ChatService(
        PostgresDealRepository(),
        PostgresChatRepository(),
        ModerationService(load_lexicon()),
        notifier=NotificationService(PostgresNotificationOutbox()),
        bus=RedisRealtimeBus(),
    )


ChatServiceDep = Annotated[ChatService, Depends(get_chat_service)]


@router.get("/api/deals/{deal_id}/messages", response_model=None)
def list_messages(
    deal_id: str,
    request: Request,
    user: RequireUserDep,
    service: ChatServiceDep,
    cursor: str | None = Query(None),
) -> dict[str, Any] | JSONResponse:
    result = service.list_messages(user.id, deal_id, cursor)
    if isinstance(result, Ok):
        messages, next_cursor = result.value
        return ok(
            {
                "messages": [m.to_api(viewer_id=user.id) for m in messages],
                "next_cursor": next_cursor,
            }
        )
    return domain_error_response(request, result.error)


@router.post("/api/deals/{deal_id}/messages", response_model=None)
def post_message(
    deal_id: str,
    payload: MessageIn,
    request: Request,
    user: RequireUserDep,
    service: ChatServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.post_message(user.id, deal_id, payload.body)
    if isinstance(result, Ok):
        return ok({"message": result.value.to_api(viewer_id=user.id)})
    return domain_error_response(request, result.error)
