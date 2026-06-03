"""Redis-backed SessionStore (opaque token → user_id, sliding TTL)."""

from __future__ import annotations

from typing import cast

import redis as redis_lib


class RedisSessionStore:
    """Implements :class:`app.core.auth.ports.SessionStore`."""

    def __init__(self, client: redis_lib.Redis) -> None:
        self._r = client

    @staticmethod
    def _key(token: str) -> str:
        return f"session:{token}"

    def save(self, token: str, user_id: str, ttl: int) -> None:
        self._r.set(self._key(token), user_id, ex=ttl)

    def get(self, token: str) -> str | None:
        return cast("str | None", self._r.get(self._key(token)))

    def delete(self, token: str) -> None:
        self._r.delete(self._key(token))

    def refresh(self, token: str, ttl: int) -> None:
        self._r.expire(self._key(token), ttl)
