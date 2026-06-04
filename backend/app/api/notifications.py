"""Notifications read endpoint (API_CONTRACT §6, FR-050)."""

from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query

from app.api.deps import RequireUserDep
from app.api.envelope import ok
from app.core.notifications.service import NotificationService
from app.infrastructure.postgres.notifications_repo import PostgresNotificationOutbox

router = APIRouter(tags=["notifications"])


def get_notification_service() -> NotificationService:
    return NotificationService(PostgresNotificationOutbox())


NotificationServiceDep = Annotated[NotificationService, Depends(get_notification_service)]


@router.get("/api/notifications", response_model=None)
def list_notifications(
    user: RequireUserDep,
    service: NotificationServiceDep,
    cursor: str | None = Query(None),
) -> dict[str, Any]:
    items, next_cursor = service.inbox(user.id, cursor)
    return ok({"items": [n.to_api() for n in items], "next_cursor": next_cursor})
