"""OTP issue/verify policy (FR-001..003, SECURITY T-01).

Pure domain logic returning ``Result`` — no I/O, no framework. Codes are stored
only as HMAC-SHA256 hashes so a store dump never reveals a live code.
"""

from __future__ import annotations

import hmac
import secrets
from dataclasses import dataclass
from hashlib import sha256

from app.core.auth.ports import CodeFactory, OtpStore, SmsSender
from app.core.auth.schemas import normalize_phone
from app.core.errors import (
    OTP_LOCKED,
    RATE_LIMITED,
    VALIDATION_ERROR,
    DomainError,
)
from app.core.result import Err, Ok, Result

# Policy constants (FR-001..003).
OTP_LENGTH = 6
OTP_TTL_SECONDS = 300  # 5 min
MAX_FAILURES = 5  # within the window → lockout
FAILURE_WINDOW_SECONDS = 900  # 15 min
LOCKOUT_SECONDS = 3600  # 1 h
RESEND_COOLDOWN_SECONDS = 60


@dataclass(frozen=True, slots=True)
class OtpRequested:
    retry_after_sec: int


@dataclass(frozen=True, slots=True)
class VerifiedPhone:
    phone: str


def _default_code_factory() -> str:
    return f"{secrets.randbelow(10**OTP_LENGTH):0{OTP_LENGTH}d}"


class OtpService:
    def __init__(
        self,
        store: OtpStore,
        sms: SmsSender,
        secret: str,
        *,
        code_factory: CodeFactory | None = None,
    ) -> None:
        self._store = store
        self._sms = sms
        self._secret = secret.encode()
        self._code_factory = code_factory or _default_code_factory

    def _hash(self, code: str) -> str:
        return hmac.new(self._secret, code.encode(), sha256).hexdigest()

    def request_otp(self, raw_phone: str) -> Result[OtpRequested, DomainError]:
        phone = normalize_phone(raw_phone)
        if phone is None:
            return Err(DomainError(VALIDATION_ERROR, "invalid_phone"))
        if self._store.lock_ttl(phone) > 0:
            return Err(DomainError(OTP_LOCKED, "locked"))
        if self._store.cooldown_ttl(phone) > 0:
            return Err(DomainError(RATE_LIMITED, "resend_cooldown"))

        code = self._code_factory()
        self._store.set_challenge(phone, self._hash(code), OTP_TTL_SECONDS)
        self._store.start_cooldown(phone, RESEND_COOLDOWN_SECONDS)
        self._sms.send_code(phone, code)
        return Ok(OtpRequested(retry_after_sec=RESEND_COOLDOWN_SECONDS))

    def verify_otp(self, raw_phone: str, code: str) -> Result[VerifiedPhone, DomainError]:
        phone = normalize_phone(raw_phone)
        if phone is None:
            return Err(DomainError(VALIDATION_ERROR, "invalid_phone"))
        if self._store.lock_ttl(phone) > 0:
            return Err(DomainError(OTP_LOCKED, "locked"))

        stored = self._store.get_challenge(phone)
        if stored is not None and hmac.compare_digest(stored, self._hash(code)):
            self._store.clear_challenge(phone)
            self._store.clear_failures(phone)
            return Ok(VerifiedPhone(phone))

        # Failure path — count and lock out on threshold (no user enumeration:
        # the same generic error is returned whether or not a challenge existed).
        failures = self._store.register_failure(phone, FAILURE_WINDOW_SECONDS)
        if failures >= MAX_FAILURES:
            self._store.lock(phone, LOCKOUT_SECONDS)
            self._store.clear_challenge(phone)
            return Err(DomainError(OTP_LOCKED, "locked"))
        return Err(DomainError(VALIDATION_ERROR, "invalid_code"))
