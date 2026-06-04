"""TOTP (RFC 6238) unit tests — admin 2FA seed (T1.4, OPERATIONS §6)."""

from __future__ import annotations

from app.core.auth.totp import TOTP_STEP, generate_totp, verify_totp

# Base32 of "12345678901234567890" — RFC 6238 SHA1 test vector seed.
SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"


def test_generate_is_six_digits() -> None:
    code = generate_totp(SECRET, timestamp=59)
    assert len(code) == 6
    assert code.isdigit()


def test_verify_accepts_current_code() -> None:
    ts = 1_700_000_000.0
    assert verify_totp(SECRET, generate_totp(SECRET, ts), timestamp=ts)


def test_verify_rejects_wrong_code() -> None:
    ts = 1_700_000_000.0
    assert not verify_totp(SECRET, "000000", timestamp=ts)


def test_verify_tolerates_one_step_skew() -> None:
    ts = 1_700_000_000.0
    prev = generate_totp(SECRET, ts - TOTP_STEP)
    nxt = generate_totp(SECRET, ts + TOTP_STEP)
    assert verify_totp(SECRET, prev, timestamp=ts)
    assert verify_totp(SECRET, nxt, timestamp=ts)


def test_verify_rejects_two_step_skew() -> None:
    ts = 1_700_000_000.0
    far = generate_totp(SECRET, ts - 2 * TOTP_STEP)
    assert not verify_totp(SECRET, far, timestamp=ts)


def test_codes_change_across_steps() -> None:
    a = generate_totp(SECRET, timestamp=0)
    b = generate_totp(SECRET, timestamp=TOTP_STEP)
    assert a != b
