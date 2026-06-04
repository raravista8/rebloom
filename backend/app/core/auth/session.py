"""Server-side sessions — opaque revocable tokens (ADR-0007, SECURITY §5).

We keep server-side tokens (not JWT) so a session can be revoked instantly —
important for a money app. TTL slides on each successful resolve.
"""

from __future__ import annotations

import secrets

from app.core.auth.ports import SessionStore

SESSION_TTL_SECONDS = 14 * 24 * 3600  # 14 days, sliding


class SessionService:
    def __init__(self, store: SessionStore, ttl: int = SESSION_TTL_SECONDS) -> None:
        self._store = store
        self._ttl = ttl

    @property
    def ttl(self) -> int:
        return self._ttl

    def create(self, user_id: str) -> str:
        token = secrets.token_urlsafe(32)
        self._store.save(token, user_id, self._ttl)
        return token

    def resolve(self, token: str) -> str | None:
        user_id = self._store.get(token)
        if user_id is not None:
            self._store.refresh(token, self._ttl)
        return user_id

    def revoke(self, token: str) -> None:
        self._store.delete(token)

    def mark_2fa(self, token: str) -> None:
        """Flag this session as admin-2FA-verified (same TTL as the session)."""
        self._store.mark_2fa(token, self._ttl)

    def is_2fa(self, token: str) -> bool:
        return self._store.is_2fa(token)
