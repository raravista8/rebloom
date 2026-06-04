"""user dsr deletion + deleted status

Revision ID: 0010_dsr
Revises: 0009_messages
Create Date: 2026-06-04 11:17:18.325405
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0010_dsr"
down_revision: str | None = "0009_messages"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users", sa.Column("deletion_requested_at", sa.DateTime(timezone=True), nullable=True)
    )
    # Widen status to allow the DSR soft-deleted state (autogenerate misses
    # CHECK-constraint edits — expand/contract: drop then recreate).
    op.drop_constraint("status_valid", "users", type_="check")
    op.create_check_constraint(
        "status_valid", "users", "status IN ('active', 'limited', 'blocked', 'deleted')"
    )


def downgrade() -> None:
    op.drop_constraint("status_valid", "users", type_="check")
    op.create_check_constraint(
        "status_valid", "users", "status IN ('active', 'limited', 'blocked')"
    )
    op.drop_column("users", "deletion_requested_at")
