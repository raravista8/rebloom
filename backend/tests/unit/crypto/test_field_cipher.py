"""AES-256-GCM field cipher (ADR-0012, SECURITY T-10)."""

from __future__ import annotations

import base64

import pytest
from app.infrastructure.crypto import AesGcmCipher

KEY = base64.b64decode("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")  # 32 bytes


def test_roundtrip_including_cyrillic() -> None:
    cipher = AesGcmCipher(KEY)
    plaintext = "Москва, ул. Цветочная, 12, кв. 5"
    token = cipher.encrypt(plaintext)
    assert token != plaintext
    assert cipher.decrypt(token) == plaintext


def test_distinct_nonce_per_call() -> None:
    cipher = AesGcmCipher(KEY)
    a = cipher.encrypt("same text")
    b = cipher.encrypt("same text")
    assert a != b  # random nonce → different ciphertext
    assert cipher.decrypt(a) == cipher.decrypt(b) == "same text"


def test_tampered_token_raises() -> None:
    cipher = AesGcmCipher(KEY)
    token = cipher.encrypt("secret address")
    raw = bytearray(base64.b64decode(token))
    raw[-1] ^= 0x01  # flip a bit in the tag → authentication fails
    tampered = base64.b64encode(bytes(raw)).decode()
    with pytest.raises(Exception):  # noqa: B017 - InvalidTag
        cipher.decrypt(tampered)


def test_wrong_key_cannot_decrypt() -> None:
    token = AesGcmCipher(KEY).encrypt("address")
    other = AesGcmCipher(b"\x00" * 32)
    with pytest.raises(Exception):  # noqa: B017
        other.decrypt(token)


def test_rejects_non_32_byte_key() -> None:
    with pytest.raises(ValueError, match="32 bytes"):
        AesGcmCipher(b"too short")
