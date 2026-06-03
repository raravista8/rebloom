"""Shared API dependencies — composition root + default-deny current-user guard."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, Request

from app.core.auth.session import SessionService
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
    """Default-deny: 401 unless a valid session resolves to a user."""
    if user is None:
        raise HTTPException(status_code=401, detail="unauthorized")
    return user


RequireUserDep = Annotated[UserView, Depends(require_user)]
