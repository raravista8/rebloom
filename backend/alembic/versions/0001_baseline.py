"""baseline — establish the migration head

Revision ID: 0001_baseline
Revises:
Create Date: 2026-06-03

No-op: creates only the ``alembic_version`` bookkeeping table so later
expand/contract migrations have a head to build on.
"""

from __future__ import annotations

from collections.abc import Sequence

revision: str = "0001_baseline"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
