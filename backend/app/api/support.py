"""Support ticket endpoints (FR-092, API_CONTRACT §6)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.core.result import Ok
from app.core.support.service import SupportService
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.support_repo import PostgresSupportRepo

router = APIRouter(tags=["support"])


class TicketIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    category: str = Field(min_length=1, max_length=16)
    body: str = Field(min_length=1, max_length=4000)


def get_support_service() -> SupportService:
    return SupportService(PostgresSupportRepo(), PostgresAuditLog())


SupportServiceDep = Annotated[SupportService, Depends(get_support_service)]


@router.post("/api/support/tickets", response_model=None)
def open_ticket(
    payload: TicketIn,
    request: Request,
    user: RequireUserDep,
    service: SupportServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.open_ticket(user.id, payload.category, payload.body)
    if isinstance(result, Ok):
        return ok({"ticket_id": result.value})
    return domain_error_response(request, result.error)
