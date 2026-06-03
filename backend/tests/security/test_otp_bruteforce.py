"""SECURITY T-01 / A07 — OTP brute-force lockout & no user enumeration."""

from __future__ import annotations

import pytest
from app.core.auth.service import MAX_FAILURES, OtpService
from app.core.errors import OTP_LOCKED, VALIDATION_ERROR
from app.core.result import Err

from tests.fakes import FakeClock, FakeOtpStore, RecordingSms

pytestmark = pytest.mark.security

PHONE = "+79161234567"


def _service() -> OtpService:
    clock = FakeClock()
    return OtpService(FakeOtpStore(clock), RecordingSms(), "secret", code_factory=lambda: "123456")


def test_no_enumeration_without_challenge() -> None:
    # Verifying a phone that never requested a code returns the same generic
    # error as a wrong code — the response must not reveal challenge existence.
    result = _service().verify_otp(PHONE, "000000")
    assert isinstance(result, Err)
    assert result.error.code == VALIDATION_ERROR


def test_bruteforce_triggers_lockout() -> None:
    service = _service()
    service.request_otp(PHONE)
    for _ in range(MAX_FAILURES - 1):
        assert service.verify_otp(PHONE, "999999").is_err()
    final = service.verify_otp(PHONE, "999999")
    assert isinstance(final, Err) and final.error.code == OTP_LOCKED


def test_locked_phone_cannot_request_or_verify() -> None:
    service = _service()
    service.request_otp(PHONE)
    for _ in range(MAX_FAILURES):
        service.verify_otp(PHONE, "999999")
    assert service.request_otp(PHONE).is_err()
    blocked = service.verify_otp(PHONE, "123456")  # even the right code is blocked
    assert isinstance(blocked, Err) and blocked.error.code == OTP_LOCKED
