"""Domain error catalogue.

``code`` values are the stable, client-facing ``error`` strings from
API_CONTRACT §7. The API boundary maps a :class:`DomainError` onto the failure
envelope ``{"ok": false, "error": code, ...}``.
"""

from __future__ import annotations

from dataclasses import dataclass

# Stable error codes — must match API_CONTRACT.md §7 exactly.
ErrorCode = str


@dataclass(frozen=True, slots=True)
class DomainError:
    """A domain-level failure. Never carries PII or secrets in ``message``."""

    code: ErrorCode
    message: str = ""


# Catalogue (API_CONTRACT §7) — instantiate at call sites with context-free text.
VALIDATION_ERROR: ErrorCode = "validation_error"
UNAUTHORIZED: ErrorCode = "unauthorized"
FORBIDDEN: ErrorCode = "forbidden"
NOT_FOUND: ErrorCode = "not_found"
RATE_LIMITED: ErrorCode = "rate_limited"
OTP_LOCKED: ErrorCode = "otp_locked"
MODERATION_PENDING: ErrorCode = "moderation_pending"
CONTENT_BLOCKED: ErrorCode = "content_blocked"
LISTING_UNAVAILABLE: ErrorCode = "listing_unavailable"
PAYMENT_FAILED: ErrorCode = "payment_failed"
OAUTH_FAILED: ErrorCode = "oauth_failed"
CONFLICT: ErrorCode = "conflict"
INTERNAL: ErrorCode = "internal"
