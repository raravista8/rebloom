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


class FakeSessionStore:
    """Implements :class:`app.core.auth.ports.SessionStore` (no TTL simulation)."""

    def __init__(self) -> None:
        self._data: dict[str, str] = {}

    def save(self, token: str, user_id: str, ttl: int) -> None:
        self._data[token] = user_id

    def get(self, token: str) -> str | None:
        return self._data.get(token)

    def delete(self, token: str) -> None:
        self._data.pop(token, None)

    def refresh(self, token: str, ttl: int) -> None:
        return None


class FakeUserRepository:
    """Implements :class:`app.core.users.ports.UserRepository` in memory."""

    def __init__(self) -> None:
        from app.core.users.schemas import UserView

        self._view = UserView
        self._by_phone: dict[str, object] = {}
        self._by_id: dict[str, object] = {}
        self._seq = 0

    def get_or_create_by_phone(self, phone: str) -> object:
        existing = self._by_phone.get(phone)
        if existing is not None:
            return existing
        self._seq += 1
        view = self._view(
            id=f"00000000-0000-0000-0000-{self._seq:012d}",
            phone=phone,
            display_name=None,
            city_id=None,
            roles=("buyer",),
            seller_rating=None,
            status="active",
        )
        self._by_phone[phone] = view
        self._by_id[view.id] = view
        return view

    def get_by_id(self, user_id: str) -> object | None:
        return self._by_id.get(user_id)
