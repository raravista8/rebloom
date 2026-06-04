"""AES-256-GCM field cipher (ADR-0012, SECURITY T-10/A04). Implements FieldCipher.

Token layout: ``base64( version(1) ‖ nonce(12) ‖ ciphertext+tag )``. A fresh
random 96-bit nonce per call; GCM authenticates, so a tampered token fails to
decrypt (raises) rather than returning forged plaintext. The key is 32 bytes from
``PII_ENC_KEY`` (base64); a deterministic dev key is used when it's unset (never
in prod — see ``build_field_cipher``)."""

from __future__ import annotations

import base64
import hashlib
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.config import get_settings

_VERSION = b"\x01"
_NONCE_LEN = 12


class AesGcmCipher:
    """Implements :class:`app.core.crypto.ports.FieldCipher`."""

    def __init__(self, key: bytes) -> None:
        if len(key) != 32:
            raise ValueError("PII encryption key must be 32 bytes (AES-256)")
        self._aes = AESGCM(key)

    def encrypt(self, plaintext: str) -> str:
        nonce = os.urandom(_NONCE_LEN)
        ct = self._aes.encrypt(nonce, plaintext.encode("utf-8"), None)
        return base64.b64encode(_VERSION + nonce + ct).decode("ascii")

    def decrypt(self, token: str) -> str:
        raw = base64.b64decode(token)
        if raw[:1] != _VERSION:
            raise ValueError("unsupported cipher version")
        nonce, ct = raw[1 : 1 + _NONCE_LEN], raw[1 + _NONCE_LEN :]
        return self._aes.decrypt(nonce, ct, None).decode("utf-8")


def _resolve_key() -> bytes:
    settings = get_settings()
    if settings.pii_enc_key:
        key = base64.b64decode(settings.pii_enc_key)
        if len(key) != 32:
            raise ValueError("PII_ENC_KEY must be base64 of exactly 32 bytes")
        return key
    if settings.is_prod:
        raise RuntimeError("PII_ENC_KEY must be set in production (ADR-0012)")
    # Deterministic dev key — derived, NOT random, so dev restarts can decrypt.
    return hashlib.sha256(b"rebloom-dev-pii-key").digest()


def build_field_cipher() -> AesGcmCipher:
    return AesGcmCipher(_resolve_key())
