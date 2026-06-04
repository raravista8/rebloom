"""TOTP (RFC 6238) for admin 2FA — hand-rolled to avoid a runtime dep.

Standard authenticator-app compatible: base32 secret, 30s step, 6 digits,
HMAC-SHA1. Verification allows ±1 step for clock skew (ADR-0007, OPERATIONS §6).
"""

from __future__ import annotations

import base64
import hmac
import struct
import time as _time
from hashlib import sha1

TOTP_STEP = 30
TOTP_DIGITS = 6


def _decode_secret(secret: str) -> bytes:
    padded = secret.upper() + "=" * (-len(secret) % 8)
    return base64.b32decode(padded)


def _hotp(secret_bytes: bytes, counter: int) -> str:
    digest = hmac.new(secret_bytes, struct.pack(">Q", counter), sha1).digest()
    offset = digest[-1] & 0x0F
    code = struct.unpack(">I", digest[offset : offset + 4])[0] & 0x7FFFFFFF
    return f"{code % (10**TOTP_DIGITS):0{TOTP_DIGITS}d}"


def generate_totp(secret: str, timestamp: float | None = None) -> str:
    ts = _time.time() if timestamp is None else timestamp
    return _hotp(_decode_secret(secret), int(ts // TOTP_STEP))


def verify_totp(secret: str, code: str, timestamp: float | None = None, window: int = 1) -> bool:
    ts = _time.time() if timestamp is None else timestamp
    counter = int(ts // TOTP_STEP)
    secret_bytes = _decode_secret(secret)
    return any(
        hmac.compare_digest(_hotp(secret_bytes, counter + i), code)
        for i in range(-window, window + 1)
    )
