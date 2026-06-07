"""add metro_station_id + flower_types to listings

A bouquet listing gains a metro-station landmark (msk/spb; район fallback
elsewhere) and a list of flower types (export-next.md §0/§1/§2). Both columns
are additive and nullable/defaulted, so they are order-safe vs the old api:
old code never reads them and INSERTs without them (the server default fills
``flower_types``). No backfill — existing listings keep NULL metro + ``[]``.

``flower_types`` uses JSON to match the existing JSON columns (Photo.variants,
FraudSignal.evidence) rather than introducing a PG array dependency here.

Revision ID: 0022_listing_metro_flowers
Revises: 0021_totp_secret_widen
Create Date: 2026-06-07 00:00:00.000000
"""

from __future__ import annotations

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0022_listing_metro_flowers"
down_revision: str | None = "0021_totp_secret_widen"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "listings",
        sa.Column("metro_station_id", sa.String(length=48), nullable=True),
    )
    op.add_column(
        "listings",
        sa.Column(
            "flower_types",
            sa.JSON(),
            server_default=sa.text("'[]'"),
            nullable=False,
        ),
    )
    op.create_index(
        op.f("ix_listings_metro_station_id"),
        "listings",
        ["metro_station_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_listings_metro_station_id"), table_name="listings")
    op.drop_column("listings", "flower_types")
    op.drop_column("listings", "metro_station_id")
