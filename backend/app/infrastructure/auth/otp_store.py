"""Redis-backed OtpStore — TTLs enforced by Redis key expiry."""

from __future__ import annotations

from typing import cast

import redis as redis_lib


class RedisOtpStore:
    """Implements :class:`app.core.auth.ports.OtpStore`."""

    def __init__(self, client: redis_lib.Redis) -> None:
        self._r = client

    @staticmethod
    def _chal(phone: str) -> str:
        return f"otp:chal:{phone}"

    @staticmethod
    def _fail(phone: str) -> str:
        return f"otp:fail:{phone}"

    @staticmethod
    def _lock(phone: str) -> str:
        return f"otp:lock:{phone}"

    @staticmethod
    def _cool(phone: str) -> str:
        return f"otp:cool:{phone}"

    def set_challenge(self, phone: str, code_hash: str, ttl: int) -> None:
        self._r.set(self._chal(phone), code_hash, ex=ttl)

    def get_challenge(self, phone: str) -> str | None:
        return cast("str | None", self._r.get(self._chal(phone)))

    def clear_challenge(self, phone: str) -> None:
        self._r.delete(self._chal(phone))

    def register_failure(self, phone: str, window: int) -> int:
        key = self._fail(phone)
        count = cast(int, self._r.incr(key))
        if count == 1:
            self._r.expire(key, window)
        return count

    def clear_failures(self, phone: str) -> None:
        self._r.delete(self._fail(phone))

    def lock(self, phone: str, ttl: int) -> None:
        self._r.set(self._lock(phone), "1", ex=ttl)

    def lock_ttl(self, phone: str) -> int:
        return max(0, cast(int, self._r.ttl(self._lock(phone))))

    def start_cooldown(self, phone: str, ttl: int) -> None:
        self._r.set(self._cool(phone), "1", ex=ttl)

    def cooldown_ttl(self, phone: str) -> int:
        return max(0, cast(int, self._r.ttl(self._cool(phone))))
