"""widen users.totp_secret for AES-256-GCM ciphertext

The admin 2FA seed is now stored encrypted at rest (ADR-0012, SECURITY T-10),
reusing the PII field cipher. The base64 ciphertext (version+nonce+ct+tag) is
longer than the raw base32 seed, so the column is widened 64 → 256.
Expand/contract-safe: a pure widen is additive and order-safe vs the old api
(it read/wrote plaintext into the same column); there are no admin secrets in
prod yet, so no backfill.

Revision ID: 0021_totp_secret_widen
Revises: 0020_no_escrow
Create Date: 2026-06-06 00:00:00.000000
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0021_totp_secret_widen"
down_revision: str | None = "0020_no_escrow"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "totp_secret",
        existing_type=sa.String(length=64),
        type_=sa.String(length=256),
        existing_nullable=True,
    )


def downgrade() -> None:
    # Clear any seed that won't fit the narrower column: a stored value is now
    # ciphertext (~84 chars), which (a) overflows VARCHAR(64) and (b) the old
    # plaintext-reading code couldn't use anyway. Affected admins re-enrol 2FA.
    op.execute("UPDATE users SET totp_secret = NULL WHERE length(totp_secret) > 64")
    op.alter_column(
        "users",
        "totp_secret",
        existing_type=sa.String(length=256),
        type_=sa.String(length=64),
        existing_nullable=True,
    )
