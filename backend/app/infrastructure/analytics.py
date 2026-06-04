"""Redis metrics recorder (ADMIN_BACKEND_TZ §Analytics). Online = a sorted set
scored by last-seen ts; DAU/MAU = per-day HyperLogLogs (PFADD/PFCOUNT) — union
across days is exact-enough (~0.8% error) and tiny in memory. Implements
:class:`app.core.analytics.metrics.MetricsRecorder`."""

from __future__ import annotations

from typing import cast

from app.infrastructure.redis import client

_ONLINE_KEY = "metrics:online"
_DAU_TTL_SEC = 35 * 24 * 3600  # keep day buckets a bit past the 30-day MAU window


def _dau_key(day: str) -> str:
    return f"metrics:dau:{day}"


def _dau_platform_key(day: str, platform: str) -> str:
    return f"metrics:dau:{day}:{platform}"


class RedisMetrics:
    """Implements :class:`app.core.analytics.metrics.MetricsRecorder`."""

    def heartbeat(self, user_id: str, now_ts: float) -> None:
        client.zadd(_ONLINE_KEY, {user_id: now_ts})

    def online_count(self, now_ts: float, window_sec: int) -> int:
        # Drop stale heartbeats, then count what remains within the window.
        client.zremrangebyscore(_ONLINE_KEY, 0, now_ts - window_sec)
        return cast("int", client.zcard(_ONLINE_KEY))

    def mark_active(self, user_id: str, day: str, platform: str) -> None:
        for key in (_dau_key(day), _dau_platform_key(day, platform)):
            client.pfadd(key, user_id)
            client.expire(key, _DAU_TTL_SEC)

    def active_count(self, days: list[str]) -> int:
        if not days:
            return 0
        return cast("int", client.pfcount(*[_dau_key(d) for d in days]))

    def active_count_by_platform(self, days: list[str], platform: str) -> int:
        if not days:
            return 0
        return cast("int", client.pfcount(*[_dau_platform_key(d, platform) for d in days]))
