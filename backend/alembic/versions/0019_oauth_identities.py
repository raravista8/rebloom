"""oauth identities + nullable user phone (OAuth-first auth)

Revision ID: 0019_oauth
Revises: 0018_pickup_address
Create Date: 2026-06-05 10:00:00.000000

Expand-only (DEPLOYMENT §6): phone becomes nullable (OAuth-first users may have no
phone yet) and a linked-identity table is added. No backfill needed.
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0019_oauth"
down_revision: str | None = "0018_pickup_address"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("users", "phone", existing_type=sa.String(length=16), nullable=True)
    op.create_table(
        "oauth_identities",
        sa.Column("provider", sa.String(length=16), nullable=False),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name=op.f("fk_oauth_identities_user_id_users"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_oauth_identities")),
        sa.UniqueConstraint("provider", "subject", name="uq_oauth_identities_provider"),
    )
    op.create_index(
        op.f("ix_oauth_identities_user_id"), "oauth_identities", ["user_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_oauth_identities_user_id"), table_name="oauth_identities")
    op.drop_table("oauth_identities")
    op.alter_column("users", "phone", existing_type=sa.String(length=16), nullable=False)
