"""Consent endpoint (API_CONTRACT §2, FR-004)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Header, Request
from fastapi.responses import JSONResponse

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok
from app.core.consent.ports import ConsentRepository
from app.core.consent.schemas import ConsentIn
from app.core.consent.service import ConsentService
from app.core.result import Ok
from app.infrastructure.postgres.consent_repo import PostgresConsentRepository

router = APIRouter(tags=["consent"])


def get_consent_repo() -> ConsentRepository:
    return PostgresConsentRepository()


ConsentRepoDep = Annotated[ConsentRepository, Depends(get_consent_repo)]


@router.post("/api/consent", response_model=None)
def accept_consent(
    payload: ConsentIn,
    request: Request,
    user: RequireUserDep,
    repo: ConsentRepoDep,
    x_platform: Annotated[str, Header()] = "web",
) -> dict[str, Any] | JSONResponse:
    result = ConsentService(repo).accept(user.id, payload.policy_version, x_platform)
    if isinstance(result, Ok):
        return ok({"accepted_at": result.value.accepted_at.isoformat()})
    return domain_error_response(request, result.error)
