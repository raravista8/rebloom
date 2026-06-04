"""Live activity metrics (FR-065/070, ADMIN_BACKEND_TZ §Analytics): online-now,
DAU/MAU, and per-platform actives. Backed by Redis (heartbeat sorted-set + daily
sets) — cheap and dedup-by-construction, so no per-request DB write. The richer
EVENT/UTM funnel table (needs the client to send UTM/platform) is a follow-up."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Protocol

ONLINE_WINDOW_SEC = 300  # a user is "online" if seen in the last 5 minutes
DAU_DAYS = 1
MAU_DAYS = 30
PLATFORMS = ("web", "ios", "android")


def normalize_platform(value: str | None) -> str:
    v = (value or "web").lower()
    return v if v in PLATFORMS else "web"


def day_key(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d")


def recent_days(now: datetime, n: int) -> list[str]:
    """Day buckets (UTC), most recent first: [today, yesterday, …]."""
    return [day_key(now - timedelta(days=i)) for i in range(n)]


class MetricsRecorder(Protocol):
    def heartbeat(self, user_id: str, now_ts: float) -> None: ...
    def online_count(self, now_ts: float, window_sec: int) -> int: ...
    def mark_active(self, user_id: str, day: str, platform: str) -> None: ...
    def active_count(self, days: list[str]) -> int: ...
    def active_count_by_platform(self, days: list[str], platform: str) -> int: ...


class MetricsService:
    def __init__(self, recorder: MetricsRecorder) -> None:
        self._recorder = recorder

    def record_activity(self, user_id: str, platform: str, now_ts: float, day: str) -> None:
        self._recorder.heartbeat(user_id, now_ts)
        self._recorder.mark_active(user_id, day, normalize_platform(platform))

    def online(self, now_ts: float) -> int:
        return self._recorder.online_count(now_ts, ONLINE_WINDOW_SEC)

    def dau(self, days: list[str]) -> int:
        return self._recorder.active_count(days[:DAU_DAYS])

    def mau(self, days: list[str]) -> int:
        return self._recorder.active_count(days[:MAU_DAYS])

    def by_platform(self, days: list[str]) -> dict[str, int]:
        window = days[:MAU_DAYS]
        return {p: self._recorder.active_count_by_platform(window, p) for p in PLATFORMS}
