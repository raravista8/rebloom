"""Webhook signature (HMAC-SHA256) — pure, constant-time compare (SECURITY T-02)."""

from __future__ import annotations

import hmac
from hashlib import sha256


def sign(body: bytes, secret: str) -> str:
    return hmac.new(secret.encode(), body, sha256).hexdigest()


def verify_signature(body: bytes, signature: str, secret: str) -> bool:
    return hmac.compare_digest(sign(body, secret), signature)
