"""Redis client — RQ queues, sessions, like counters, chat pub/sub."""

from __future__ import annotations

import redis as redis_lib

from app.config import get_settings

_settings = get_settings()

client: redis_lib.Redis = redis_lib.Redis.from_url(
    _settings.redis_url, decode_responses=True, socket_connect_timeout=3
)


def check_redis() -> bool:
    """Readiness probe — Redis must answer PING."""
    try:
        return bool(client.ping())
    except Exception:
        return False
