"""Ports (Protocols) for the auth domain — implemented by infrastructure adapters."""

from __future__ import annotations

from typing import Protocol


class OtpStore(Protocol):
    """Short-lived OTP state: challenge, failure counter, lockout, resend cooldown.

    All methods are keyed by the canonical phone. TTLs are enforced by the store
    (Redis in prod); ``*_ttl`` return remaining seconds, 0 when absent.
    """

    def set_challenge(self, phone: str, code_hash: str, ttl: int) -> None: ...
    def get_challenge(self, phone: str) -> str | None: ...
    def clear_challenge(self, phone: str) -> None: ...

    def register_failure(self, phone: str, window: int) -> int: ...
    def clear_failures(self, phone: str) -> None: ...

    def lock(self, phone: str, ttl: int) -> None: ...
    def lock_ttl(self, phone: str) -> int: ...

    def start_cooldown(self, phone: str, ttl: int) -> None: ...
    def cooldown_ttl(self, phone: str) -> int: ...


class SmsSender(Protocol):
    """Delivers the OTP code out-of-band (SMS provider in prod)."""

    def send_code(self, phone: str, code: str) -> None: ...


class CodeFactory(Protocol):
    """Generates a numeric OTP code (overridable in tests)."""

    def __call__(self) -> str: ...
