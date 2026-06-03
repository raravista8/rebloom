"""In-memory fakes implementing the auth ports — for fast, deterministic tests."""

from __future__ import annotations


class FakeClock:
    def __init__(self) -> None:
        self.t = 0.0

    def advance(self, seconds: float) -> None:
        self.t += seconds

    def now(self) -> float:
        return self.t


class FakeOtpStore:
    """Implements :class:`app.core.auth.ports.OtpStore` with a controllable clock."""

    def __init__(self, clock: FakeClock) -> None:
        self._clock = clock
        self._challenge: dict[str, tuple[str, float]] = {}
        self._failures: dict[str, tuple[int, float]] = {}
        self._lock: dict[str, float] = {}
        self._cooldown: dict[str, float] = {}

    @staticmethod
    def _remaining(expiry: float, now: float) -> int:
        return max(0, int(expiry - now))

    def set_challenge(self, phone: str, code_hash: str, ttl: int) -> None:
        self._challenge[phone] = (code_hash, self._clock.now() + ttl)

    def get_challenge(self, phone: str) -> str | None:
        entry = self._challenge.get(phone)
        if entry is None:
            return None
        code_hash, expiry = entry
        if expiry <= self._clock.now():
            del self._challenge[phone]
            return None
        return code_hash

    def clear_challenge(self, phone: str) -> None:
        self._challenge.pop(phone, None)

    def register_failure(self, phone: str, window: int) -> int:
        now = self._clock.now()
        entry = self._failures.get(phone)
        if entry is not None and entry[1] > now:
            count, expiry = entry[0] + 1, entry[1]
        else:
            count, expiry = 1, now + window
        self._failures[phone] = (count, expiry)
        return count

    def clear_failures(self, phone: str) -> None:
        self._failures.pop(phone, None)

    def lock(self, phone: str, ttl: int) -> None:
        self._lock[phone] = self._clock.now() + ttl

    def lock_ttl(self, phone: str) -> int:
        return self._remaining(self._lock.get(phone, 0.0), self._clock.now())

    def start_cooldown(self, phone: str, ttl: int) -> None:
        self._cooldown[phone] = self._clock.now() + ttl

    def cooldown_ttl(self, phone: str) -> int:
        return self._remaining(self._cooldown.get(phone, 0.0), self._clock.now())


class RecordingSms:
    """Implements :class:`app.core.auth.ports.SmsSender`; records what was sent."""

    def __init__(self) -> None:
        self.sent: list[tuple[str, str]] = []

    def send_code(self, phone: str, code: str) -> None:
        self.sent.append((phone, code))

    @property
    def last_code(self) -> str:
        return self.sent[-1][1]
