"""Redis fixed-window rate limiter (SECURITY T-08). INCR the key, set the TTL on
first hit; allow while the count is within the limit. Implements
:class:`app.core.listings.chat.RateLimiter`."""

from __future__ import annotations

from typing import cast

from app.infrastructure.redis import client


class RedisRateLimiter:
    def allow(self, key: str, limit: int, window_sec: int) -> bool:
        count = cast("int", client.incr(key))
        if count == 1:
            client.expire(key, window_sec)
        return count <= limit
