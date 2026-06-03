"""OTP issue/verify policy (FR-001..003)."""

from __future__ import annotations

from app.core.auth.service import (
    LOCKOUT_SECONDS,
    MAX_FAILURES,
    OTP_TTL_SECONDS,
    RESEND_COOLDOWN_SECONDS,
    OtpService,
)
from app.core.errors import OTP_LOCKED, RATE_LIMITED, VALIDATION_ERROR
from app.core.result import Err, Ok

from tests.fakes import FakeClock, FakeOtpStore, RecordingSms

PHONE = "+79161234567"
CODE = "123456"


def make_service(code: str = CODE) -> tuple[OtpService, FakeOtpStore, RecordingSms, FakeClock]:
    clock = FakeClock()
    store = FakeOtpStore(clock)
    sms = RecordingSms()
    service = OtpService(store, sms, "test-secret", code_factory=lambda: code)
    return service, store, sms, clock


def test_request_sends_six_digit_code() -> None:
    service, _store, sms, _clock = make_service()
    result = service.request_otp(PHONE)
    assert isinstance(result, Ok)
    assert result.value.retry_after_sec == RESEND_COOLDOWN_SECONDS
    assert sms.sent == [(PHONE, CODE)]


def test_resend_is_rate_limited_until_cooldown_elapses() -> None:
    service, _store, _sms, clock = make_service()
    assert isinstance(service.request_otp(PHONE), Ok)

    again = service.request_otp(PHONE)
    assert isinstance(again, Err)
    assert again.error.code == RATE_LIMITED

    clock.advance(RESEND_COOLDOWN_SECONDS + 1)
    assert isinstance(service.request_otp(PHONE), Ok)


def test_verify_correct_code_authenticates() -> None:
    service, _store, _sms, _clock = make_service()
    service.request_otp(PHONE)
    result = service.verify_otp(PHONE, CODE)
    assert isinstance(result, Ok)
    assert result.value.phone == PHONE


def test_verify_normalizes_both_sides() -> None:
    service, _store, _sms, _clock = make_service()
    service.request_otp("8 916 123 45 67")  # stored under +7916...
    result = service.verify_otp("+7 (916) 123-45-67", CODE)
    assert isinstance(result, Ok)
    assert result.value.phone == PHONE


def test_verify_wrong_code_fails() -> None:
    service, _store, _sms, _clock = make_service()
    service.request_otp(PHONE)
    result = service.verify_otp(PHONE, "000000")
    assert isinstance(result, Err)
    assert result.error.code == VALIDATION_ERROR


def test_lockout_after_max_failures_then_blocks_issuance() -> None:
    service, _store, _sms, _clock = make_service()
    service.request_otp(PHONE)
    for _ in range(MAX_FAILURES - 1):
        r = service.verify_otp(PHONE, "000000")
        assert isinstance(r, Err) and r.error.code == VALIDATION_ERROR
    locked = service.verify_otp(PHONE, "000000")
    assert isinstance(locked, Err) and locked.error.code == OTP_LOCKED

    blocked = service.request_otp(PHONE)
    assert isinstance(blocked, Err) and blocked.error.code == OTP_LOCKED


def test_lock_expires_after_lockout_window() -> None:
    service, _store, _sms, clock = make_service()
    service.request_otp(PHONE)
    for _ in range(MAX_FAILURES):
        service.verify_otp(PHONE, "000000")
    assert service.request_otp(PHONE).is_err()

    clock.advance(LOCKOUT_SECONDS + 1)
    assert isinstance(service.request_otp(PHONE), Ok)


def test_expired_challenge_cannot_be_used() -> None:
    service, _store, _sms, clock = make_service()
    service.request_otp(PHONE)
    clock.advance(OTP_TTL_SECONDS + 1)
    result = service.verify_otp(PHONE, CODE)
    assert isinstance(result, Err)
    assert result.error.code == VALIDATION_ERROR


def test_success_clears_failure_counter() -> None:
    service, _store, _sms, _clock = make_service()
    service.request_otp(PHONE)
    service.verify_otp(PHONE, "000000")
    service.verify_otp(PHONE, "000000")
    assert isinstance(service.verify_otp(PHONE, CODE), Ok)

    # Counter reset: a fresh challenge + one wrong try must not be near lockout.
    service.request_otp(PHONE)
    again = service.verify_otp(PHONE, "000000")
    assert isinstance(again, Err) and again.error.code == VALIDATION_ERROR
