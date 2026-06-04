"""User abuse reports (FR-064, API_CONTRACT §6)."""

from __future__ import annotations

from typing import Annotated, Any, Literal

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.core.moderation.reports import ReportService
from app.core.result import Ok
from app.infrastructure.postgres.reports_repo import PostgresReportRepo

router = APIRouter(tags=["reports"])


class ReportIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    target_type: Literal["listing", "user"]
    target_id: str = Field(min_length=1, max_length=64)
    reason: str = Field(min_length=1, max_length=2000)


def get_report_service() -> ReportService:
    return ReportService(PostgresReportRepo())


ReportServiceDep = Annotated[ReportService, Depends(get_report_service)]


@router.post("/api/reports", response_model=None)
def create_report(
    payload: ReportIn,
    request: Request,
    user: RequireUserDep,
    service: ReportServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.report(user.id, payload.target_type, payload.target_id, payload.reason)
    if isinstance(result, Ok):
        return ok({"report_id": result.value})
    return domain_error_response(request, result.error)
