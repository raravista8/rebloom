"""Self-service / DSR endpoints (ФЗ-152, FR-091): export, delete, correct."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok, request_id
from app.core.privacy.service import PrivacyService
from app.core.result import Ok
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.privacy_repo import PostgresPrivacyRepository

router = APIRouter(tags=["me"])


class ProfilePatchIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    display_name: str | None = Field(default=None, min_length=1, max_length=64)
    city_id: str | None = Field(default=None, min_length=1, max_length=8)


class DeleteIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    confirm: bool = False


def get_privacy_service() -> PrivacyService:
    return PrivacyService(PostgresPrivacyRepository(), PostgresAuditLog())


PrivacyServiceDep = Annotated[PrivacyService, Depends(get_privacy_service)]


@router.post("/api/me/export", response_model=None)
def export_data(
    request: Request, user: RequireUserDep, service: PrivacyServiceDep
) -> dict[str, Any] | JSONResponse:
    """Machine-readable export of the subject's data (FR-091). MVP returns the
    bundle inline; an async job + signed download is post-MVP."""
    result = service.export(user.id, request_id=request_id(request))
    if isinstance(result, Ok):
        return ok({"export": result.value})
    return domain_error_response(request, result.error)


@router.post("/api/me/delete", response_model=None)
def delete_account(
    payload: DeleteIn, request: Request, user: RequireUserDep, service: PrivacyServiceDep
) -> dict[str, Any] | JSONResponse:
    """Soft-disable now + schedule anonymization (FLOW-9). The legally-required
    anonymized ledger is retained."""
    result = service.request_deletion(user.id, payload.confirm, request_id=request_id(request))
    if isinstance(result, Ok):
        return ok({"scheduled_at": result.value})
    return domain_error_response(request, result.error)


@router.patch("/api/me", response_model=None)
def correct_profile(
    payload: ProfilePatchIn, request: Request, user: RequireUserDep, service: PrivacyServiceDep
) -> dict[str, Any] | JSONResponse:
    """Self-correction of profile data (FR-091, PRIVACY_152FZ §2)."""
    result = service.correct(
        user.id,
        display_name=payload.display_name,
        city_id=payload.city_id,
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"user": result.value.to_public()})
    return domain_error_response(request, result.error)
