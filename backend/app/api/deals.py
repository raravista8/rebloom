"""Deal endpoints (API_CONTRACT §4). Party-only access (T-06)."""

from __future__ import annotations

from typing import Annotated, Any, Literal

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from app.api.deps import RequireUserDep
from app.api.envelope import domain_error_response, ok, request_id
from app.config import get_settings
from app.core.deals.delivery import DeliveryService
from app.core.deals.service import DealService
from app.core.notifications.service import NotificationService
from app.core.result import Ok
from app.infrastructure.crypto import build_field_cipher
from app.infrastructure.postgres.audit_repo import PostgresAuditLog
from app.infrastructure.postgres.deals_repo import (
    PostgresDealRepository,
    PostgresListingReader,
)
from app.infrastructure.postgres.notifications_repo import PostgresNotificationOutbox
from app.infrastructure.realtime import RedisRealtimeBus
from app.infrastructure.yookassa import SandboxYooKassa

router = APIRouter(tags=["deals"])


class DealCreateIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    listing_id: str
    delivery_method: Literal["self_pickup", "courier"] = "self_pickup"


class DisputeOpenIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    reason: str = Field(min_length=1, max_length=2000)
    photo_ids: list[str] = Field(default_factory=list, max_length=5)


class DeliveryIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    address: str = Field(min_length=1, max_length=400)


def get_delivery_service() -> DeliveryService:
    repo = PostgresDealRepository()
    return DeliveryService(repo, repo, build_field_cipher())


DeliveryServiceDep = Annotated[DeliveryService, Depends(get_delivery_service)]


def get_deal_service() -> DealService:
    settings = get_settings()
    return DealService(
        PostgresDealRepository(),
        PostgresListingReader(),
        SandboxYooKassa(),
        settings.platform_commission_bps,
        audit=PostgresAuditLog(),
        notifier=NotificationService(PostgresNotificationOutbox()),
        bus=RedisRealtimeBus(),
    )


DealServiceDep = Annotated[DealService, Depends(get_deal_service)]


@router.post("/api/deals", response_model=None)
def create_deal(
    payload: DealCreateIn,
    request: Request,
    user: RequireUserDep,
    service: DealServiceDep,
) -> dict[str, Any] | JSONResponse:
    result = service.create_deal(user.id, payload.listing_id, payload.delivery_method)
    if isinstance(result, Ok):
        deal, confirmation_url = result.value
        return ok(
            {
                "deal": deal.to_api(role="buyer"),
                "payment": {"confirmation_url": confirmation_url},
            }
        )
    return domain_error_response(request, result.error)


@router.post("/api/deals/{deal_id}/confirm-receipt", response_model=None)
def confirm_receipt(
    deal_id: str, request: Request, user: RequireUserDep, service: DealServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.confirm_receipt(user.id, deal_id)
    if isinstance(result, Ok):
        return ok({"deal": result.value.to_api(role="buyer")})
    return domain_error_response(request, result.error)


@router.get("/api/deals/{deal_id}", response_model=None)
def get_deal(
    deal_id: str, request: Request, user: RequireUserDep, service: DealServiceDep
) -> dict[str, Any] | JSONResponse:
    result = service.get(deal_id, user.id)
    if isinstance(result, Ok):
        deal = result.value
        role = "buyer" if deal.buyer_id == user.id else "seller"
        return ok({"deal": deal.to_api(role=role)})
    return domain_error_response(request, result.error)


@router.post("/api/deals/{deal_id}/dispute", response_model=None)
def open_dispute(
    deal_id: str,
    payload: DisputeOpenIn,
    request: Request,
    user: RequireUserDep,
    service: DealServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Either party freezes funds before release (FR-024, FLOW-1)."""
    result = service.open_dispute(user.id, deal_id, payload.reason, request_id=request_id(request))
    if isinstance(result, Ok):
        deal = result.value
        role = "buyer" if deal.buyer_id == user.id else "seller"
        return ok({"deal": deal.to_api(role=role)})
    return domain_error_response(request, result.error)


@router.post("/api/deals/{deal_id}/delivery", response_model=None)
def set_delivery(
    deal_id: str,
    payload: DeliveryIn,
    request: Request,
    user: RequireUserDep,
    service: DeliveryServiceDep,
) -> dict[str, Any] | JSONResponse:
    """Seller sets the self-pickup address (stored encrypted, ADR-0012)."""
    result = service.set_address(user.id, deal_id, payload.address)
    if isinstance(result, Ok):
        return ok({"ok": True})
    return domain_error_response(request, result.error)


@router.get("/api/deals/{deal_id}/delivery", response_model=None)
def get_delivery(
    deal_id: str, request: Request, user: RequireUserDep, service: DeliveryServiceDep
) -> dict[str, Any] | JSONResponse:
    """Pickup address — revealed to a party only after paid_held (T-13)."""
    result = service.get_address(user.id, deal_id)
    if isinstance(result, Ok):
        reveal = result.value
        return ok({"revealed": reveal.revealed, "address": reveal.address})
    return domain_error_response(request, result.error)
