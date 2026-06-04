"""Shared API dependencies — composition root + default-deny current-user guard."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated

from fastapi import Depends, HTTPException, Request

from app.core.auth.session import SessionService

if TYPE_CHECKING:
    from app.core.analytics.metrics import MetricsService
from app.core.users.ports import UserRepository
from app.core.users.schemas import UserView
from app.infrastructure.auth.session_store import RedisSessionStore
from app.infrastructure.postgres.users_repo import PostgresUserRepository
from app.infrastructure.redis import client as redis_client

SESSION_COOKIE = "session"


def get_session_service() -> SessionService:
    return SessionService(RedisSessionStore(redis_client))


def get_user_repo() -> UserRepository:
    return PostgresUserRepository()


def get_metrics_service() -> MetricsService:
    from app.core.analytics.metrics import MetricsService
    from app.infrastructure.analytics import RedisMetrics

    return MetricsService(RedisMetrics())


SessionServiceDep = Annotated[SessionService, Depends(get_session_service)]
UserRepoDep = Annotated[UserRepository, Depends(get_user_repo)]


def current_user(
    request: Request,
    session_service: SessionServiceDep,
    user_repo: UserRepoDep,
) -> UserView | None:
    """Resolve the session cookie to a user, or ``None`` (no exception)."""
    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        return None
    user_id = session_service.resolve(token)
    if user_id is None:
        return None
    return user_repo.get_by_id(user_id)


CurrentUserDep = Annotated[UserView | None, Depends(current_user)]


def require_user(user: CurrentUserDep) -> UserView:
    """Default-deny: 401 unless a valid session resolves to a user. A blocked or
    self-deleted (DSR) account is rejected with 403 (FLOW-8, FLOW-9)."""
    if user is None:
        raise HTTPException(status_code=401, detail="unauthorized")
    if user.status in ("blocked", "deleted"):
        raise HTTPException(status_code=403, detail="forbidden")
    return user


RequireUserDep = Annotated[UserView, Depends(require_user)]


def require_admin(user: RequireUserDep) -> UserView:
    """RBAC: admin role required (SECURITY §5)."""
    if "admin" not in user.roles:
        raise HTTPException(status_code=403, detail="forbidden")
    return user


RequireAdminDep = Annotated[UserView, Depends(require_admin)]


def require_admin_2fa(
    request: Request, user: RequireAdminDep, session_service: SessionServiceDep
) -> UserView:
    """Admin route guard: admin role AND a 2FA-verified session (OPERATIONS §6)."""
    token = request.cookies.get(SESSION_COOKIE)
    if not token or not session_service.is_2fa(token):
        raise HTTPException(status_code=403, detail="forbidden")
    return user


RequireAdmin2FADep = Annotated[UserView, Depends(require_admin_2fa)]
