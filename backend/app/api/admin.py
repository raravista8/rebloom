"""Admin endpoints — TOTP 2FA gate (OPERATIONS §6, SECURITY §5)."""

from __future__ import annotations

from typing import Annotated, Any, Literal

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deals import DealServiceDep
from app.api.deps import (
    SESSION_COOKIE,
    RequireAdmin2FADep,
    RequireAdminDep,
    SessionServiceDep,
    UserRepoDep,
    get_metrics_service,
)
from app.api.envelope import domain_error_response, fail, ok, request_id
from app.api.reports import ReportServiceDep
from app.api.support import SupportServiceDep
from app.core.admin.moderation import ModerationQueueService
from app.core.admin.users import AdminUserService
from app.core.analytics.finance import FinanceService
from app.core.analytics.overview import OverviewService
from app.core.auth.totp import verify_totp
from app.core.fraud.service import FraudService
from app.core.result import Ok
from app.infrastructure.postgres.admin_users_repo import PostgresAdminUserRepo
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.finance_repo import PostgresFinanceRepo
from app.infrastructure.postgres.fraud_repo import PostgresFraudRepo
from app.infrastructure.postgres.moderation_repo import PostgresModerationQueueRepo
from app.infrastructure.postgres.users_stats_repo import PostgresUsersStatsRepo

router = APIRouter(tags=["admin"])


def get_moderation_service() -> ModerationQueueService:
    return ModerationQueueService(PostgresModerationQueueRepo(), PostgresAuditLog())


ModerationServiceDep = Annotated[ModerationQueueService, Depends(get_moderation_service)]


def get_finance_service() -> FinanceService:
    return FinanceService(PostgresFinanceRepo())


FinanceServiceDep = Annotated[FinanceService, Depends(get_finance_service)]


def get_overview_service() -> OverviewService:
    return OverviewService(
        get_metrics_service(),
        FinanceService(PostgresFinanceRepo()),
        PostgresUsersStatsRepo(),
    )


OverviewServiceDep = Annotated[OverviewService, Depends(get_overview_service)]


def get_admin_user_service() -> AdminUserService:
    return AdminUserService(PostgresAdminUserRepo(), PostgresAuditLog())


AdminUserServiceDep = Annotated[AdminUserService, Depends(get_admin_user_service)]


def get_fraud_service() -> FraudService:
    return FraudService(PostgresFraudRepo())


FraudServiceDep = Annotated[FraudService, Depends(get_fraud_service)]


class Admin2FAIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(min_length=6, max_length=8)


class DisputeResolveIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    action: Literal["release", "refund", "partial"]
    reason: str = Field(min_length=1, max_length=2000)
    refund_kopecks: int = Field(default=0, ge=0)


class ModerationDecisionIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    type: Literal["listing", "review"]
    action: Literal["approve", "reject"]
    reason: str = Field(min_length=1, max_length=2000)


class ResolveTicketIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    reason: str = Field(min_length=1, max_length=2000)


class UserStatusIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    reason: str = Field(min_length=1, max_length=2000)


class UserEditIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    reason: str = Field(min_length=1, max_length=2000)
    display_name: str | None = Field(default=None, min_length=1, max_length=64)
    city_id: str | None = Field(default=None, min_length=1, max_length=8)


@router.post("/api/admin/2fa/verify", response_model=None)
def admin_2fa_verify(
    payload: Admin2FAIn,
    request: Request,
    user: RequireAdminDep,
    user_repo: UserRepoDep,
    session_service: SessionServiceDep,
) -> dict[str, Any] | JSONResponse:
    secret = user_repo.get_totp_secret(user.id)
    if secret is None or not verify_totp(secret, payload.code):
        return JSONResponse(
            status_code=401, content=fail("unauthorized", req_id=request_id(request))
        )
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        session_service.mark_2fa(token)
    return ok({"verified_2fa": True})


@router.get("/api/admin/whoami", response_model=None)
def admin_whoami(user: RequireAdmin2FADep) -> dict[str, Any]:
    return ok({"user": user.to_public(), "admin": True})


@router.post("/api/admin/deals/{deal_id}/resolve", response_model=None)
def resolve_dispute(
    deal_id: str,
    payload: DisputeResolveIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: DealServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Support/admin resolves a dispute (FLOW-1 step 4) — release / refund /
    partial. Money settles in the ledger; the action is audit-logged."""
    result = service.resolve_dispute(
        admin.id,
        deal_id,
        action=payload.action,
        reason=payload.reason,
        refund_kopecks=payload.refund_kopecks,
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"deal": result.value.to_api(role="seller")})
    return domain_error_response(request, result.error)


@router.get("/api/admin/moderation/queue", response_model=None)
def moderation_queue(
    _admin: RequireAdmin2FADep,
    service: ModerationServiceDep,
    type: Literal["listing", "review"] = Query("listing"),
) -> dict[str, Any]:
    """Pending listings or held reviews awaiting a moderator (FR-060)."""
    items = service.queue(type)
    # MVP: a single capped page — end-of-list signalled by next_cursor=null.
    return ok({"items": [i.to_api() for i in items], "next_cursor": None})


@router.get("/api/admin/overview", response_model=None)
def admin_overview(
    _admin: RequireAdmin2FADep,
    service: OverviewServiceDep,
    since: str | None = Query(None),
    until: str | None = Query(None),
) -> dict[str, Any]:
    """KPI bundle: online/DAU/MAU/platform + GMV/commission + users by city +
    growth (FR-070). Read-only, ledger-derived finance (T-17)."""
    from datetime import UTC, datetime

    return ok(service.overview(datetime.now(UTC), since, until))


@router.get("/api/admin/users", response_model=None)
def admin_users(
    _admin: RequireAdmin2FADep,
    service: AdminUserServiceDep,
    q: str | None = Query(None),
    city: str | None = Query(None),
    status: str | None = Query(None),
) -> dict[str, Any]:
    """Search users by name/phone/id + city/status filters (FR-071)."""
    return ok({"items": [u.to_api() for u in service.search(q, city, status)]})


@router.get("/api/admin/users/{user_id}", response_model=None)
def admin_user_detail(
    user_id: str, request: Request, admin: RequireAdmin2FADep, service: AdminUserServiceDep
) -> dict[str, Any] | JSONResponse:
    """User drill-down — PII access is itself audited (ФЗ-152, T-16)."""
    result = service.detail(admin.id, user_id, request_id=request_id(request))
    if isinstance(result, Ok):
        return ok(result.value.to_api())
    return domain_error_response(request, result.error)


@router.post("/api/admin/users/{user_id}/block", response_model=None)
def admin_block_user(
    user_id: str,
    payload: UserStatusIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: AdminUserServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.set_status(
        admin.id, user_id, "blocked", payload.reason, request_id=request_id(request)
    )
    if isinstance(result, Ok):
        return ok({"status": result.value})
    return domain_error_response(request, result.error)


@router.post("/api/admin/users/{user_id}/unblock", response_model=None)
def admin_unblock_user(
    user_id: str,
    payload: UserStatusIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: AdminUserServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.set_status(
        admin.id, user_id, "active", payload.reason, request_id=request_id(request)
    )
    if isinstance(result, Ok):
        return ok({"status": result.value})
    return domain_error_response(request, result.error)


@router.patch("/api/admin/users/{user_id}", response_model=None)
def admin_edit_user(
    user_id: str,
    payload: UserEditIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: AdminUserServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Admin edit of user data — reason mandatory, audited (T-16)."""
    result = service.edit(
        admin.id,
        user_id,
        display_name=payload.display_name,
        city_id=payload.city_id,
        reason=payload.reason,
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"status": result.value})
    return domain_error_response(request, result.error)


@router.get("/api/admin/reports", response_model=None)
def admin_reports(_admin: RequireAdmin2FADep, service: ReportServiceDep) -> dict[str, Any]:
    """Open user abuse reports awaiting a moderator (FR-064)."""
    return ok({"items": [r.to_api() for r in service.queue()], "next_cursor": None})


@router.get("/api/admin/fraud", response_model=None)
def admin_fraud(_admin: RequireAdmin2FADep, service: FraudServiceDep) -> dict[str, Any]:
    """Open fraud signals, highest-score first (FR-073)."""
    return ok({"items": [s.to_api() for s in service.queue()], "next_cursor": None})


@router.get("/api/admin/support/tickets", response_model=None)
def admin_support_queue(_admin: RequireAdmin2FADep, service: SupportServiceDep) -> dict[str, Any]:
    """Open support tickets, oldest first, with SLA-overdue flags (FR-092)."""
    from datetime import UTC, datetime

    now = datetime.now(UTC)
    return ok({"items": [t.to_api(now=now) for t in service.queue()], "next_cursor": None})


@router.post("/api/admin/support/tickets/{ticket_id}/resolve", response_model=None)
def admin_resolve_ticket(
    ticket_id: str,
    payload: ResolveTicketIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: SupportServiceDep,
) -> dict[str, Any] | JSONResponse:
    from datetime import UTC, datetime

    result = service.resolve(
        admin.id,
        ticket_id,
        payload.reason,
        datetime.now(UTC).isoformat(),
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"status": result.value})
    return domain_error_response(request, result.error)


@router.get("/api/admin/finance", response_model=None)
def admin_finance(
    _admin: RequireAdmin2FADep,
    service: FinanceServiceDep,
    since: str | None = Query(None),
    until: str | None = Query(None),
) -> dict[str, Any]:
    """Turnover / commission / payouts / refunds + held balance from the ledger,
    over an optional [since, until) window (FR-070, ADMIN_BACKEND_TZ)."""
    return ok(service.summary(since, until).to_api())


@router.post("/api/admin/moderation/{item_id}", response_model=None)
def moderation_decide(
    item_id: str,
    payload: ModerationDecisionIn,
    request: Request,
    admin: RequireAdmin2FADep,
    service: ModerationServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Approve/reject a queued item with a mandatory reason (FR-061, audit-logged)."""
    result = service.decide(
        actor_id=admin.id,
        item_type=payload.type,
        item_id=item_id,
        action=payload.action,
        reason=payload.reason,
        request_id=request_id(request),
    )
    if isinstance(result, Ok):
        return ok({"status": result.value})
    return domain_error_response(request, result.error)
