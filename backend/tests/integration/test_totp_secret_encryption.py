"""Admin 2FA seed is stored AES-256-GCM-encrypted at rest (ADR-0012, T-10).

Reuses the PII field cipher (same as the deal pickup address): the repo encrypts
on write, decrypts on read, and the raw column never holds the plaintext seed.
"""

from __future__ import annotations

import secrets
import uuid

import pytest
from app.core.auth.totp import generate_totp, verify_totp
from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import User
from app.infrastructure.postgres.users_repo import PostgresUserRepository

pytestmark = pytest.mark.integration

# Base32 admin TOTP seed — public RFC 6238 test vector, not a real secret.
SEED = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # gitleaks:allow


def _phone() -> str:
    return f"+79{secrets.randbelow(10**9):09d}"


def test_totp_secret_ciphertext_at_rest_and_roundtrip() -> None:
    users = PostgresUserRepository()
    user_id = users.get_or_create_by_phone(_phone()).id

    assert users.set_totp_secret(user_id, SEED) is True

    # Raw column is ciphertext, not the plaintext seed.
    with writer_session() as session:
        stored = session.get(User, uuid.UUID(user_id)).totp_secret
    assert stored is not None
    assert stored != SEED
    assert SEED not in stored

    # …and the repo decrypts it back, so TOTP verification still works.
    decrypted = users.get_totp_secret(user_id)
    assert decrypted == SEED
    assert verify_totp(decrypted, generate_totp(SEED)) is True


def test_get_totp_secret_reads_legacy_plaintext_seed() -> None:
    # A seed written before encryption-at-rest (or seeded straight into the DB) sits
    # in the column as plaintext. decrypt-on-read must DEGRADE GRACEFULLY — return it
    # as-is so a pre-existing admin's 2FA keeps working — not raise on the bad token.
    users = PostgresUserRepository()
    user_id = users.get_or_create_by_phone(_phone()).id
    with writer_session() as session:
        session.get(User, uuid.UUID(user_id)).totp_secret = SEED  # plaintext, NOT encrypted

    got = users.get_totp_secret(user_id)
    assert got == SEED
    assert verify_totp(got, generate_totp(SEED)) is True


def test_get_totp_secret_none_when_unset() -> None:
    users = PostgresUserRepository()
    user_id = users.get_or_create_by_phone(_phone()).id
    # A fresh (non-admin) user has no seed → graceful None, no decrypt attempt.
    assert users.get_totp_secret(user_id) is None


def test_set_totp_secret_none_clears_seed() -> None:
    users = PostgresUserRepository()
    user_id = users.get_or_create_by_phone(_phone()).id
    users.set_totp_secret(user_id, SEED)

    assert users.set_totp_secret(user_id, None) is True
    assert users.get_totp_secret(user_id) is None
    with writer_session() as session:
        assert session.get(User, uuid.UUID(user_id)).totp_secret is None
