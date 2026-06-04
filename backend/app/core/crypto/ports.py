"""Field cipher port (ADR-0012, SECURITY T-10). Authenticated encryption for
sensitive columns (addresses/geo). Adapter is AES-256-GCM in infrastructure."""

from __future__ import annotations

from typing import Protocol


class FieldCipher(Protocol):
    def encrypt(self, plaintext: str) -> str:
        """Return an opaque, tamper-evident token (safe to store)."""
        ...

    def decrypt(self, token: str) -> str:
        """Inverse of ``encrypt``. Raises if the token was tampered with."""
        ...
