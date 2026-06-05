"""Redis-backed OAuthStateStore — CSRF state + PKCE verifier, single-use.

``take`` uses ``GETDEL`` so a ``state`` is consumed atomically: a replayed
``state`` (or a callback race) finds nothing (SECURITY §10 anti-replay).
"""

from __future__ import annotations

import json
from typing import cast

import redis as redis_lib

from app.core.auth.oauth_ports import StoredState


class RedisOAuthStateStore:
    """Implements :class:`app.core.auth.oauth_ports.OAuthStateStore`."""

    def __init__(self, client: redis_lib.Redis) -> None:
        self._r = client

    @staticmethod
    def _key(state: str) -> str:
        return f"oauth:state:{state}"

    def put(self, state: str, *, provider: str, verifier: str, redirect_uri: str, ttl: int) -> None:
        payload = json.dumps(
            {"provider": provider, "verifier": verifier, "redirect_uri": redirect_uri}
        )
        self._r.set(self._key(state), payload, ex=ttl)

    def take(self, state: str) -> StoredState | None:
        raw = cast("str | None", self._r.getdel(self._key(state)))
        if raw is None:
            return None
        try:
            d = json.loads(raw)
            return StoredState(
                provider=d["provider"], verifier=d["verifier"], redirect_uri=d["redirect_uri"]
            )
        except (ValueError, KeyError):
            return None
