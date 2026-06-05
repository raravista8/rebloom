"""No-escrow deal statuses — «оплата при встрече» (ADR-0013).

Swaps the deal ``status`` CHECK constraint to the new state machine and migrates
existing rows by the documented mapping. Expand/contract-safe: the data is mapped
before the new constraint is applied; the old constraint is dropped first so the
intermediate states are never rejected.

    created→agreed · paid_held→meeting · released→done · disputed→problem
    refunded→cancelled · cancelled→cancelled

Revision ID: 0020_no_escrow
Revises: 0019_oauth
"""

from __future__ import annotations

from alembic import op

revision = "0020_no_escrow"
down_revision = "0019_oauth"
branch_labels = None
depends_on = None

# Static literal statements (no f-string SQL — CLAUDE.md hard rule; bandit-clean).
_FORWARD = (
    "UPDATE deals SET status = 'agreed'    WHERE status = 'created'",
    "UPDATE deals SET status = 'meeting'   WHERE status = 'paid_held'",
    "UPDATE deals SET status = 'done'      WHERE status = 'released'",
    "UPDATE deals SET status = 'problem'   WHERE status = 'disputed'",
    "UPDATE deals SET status = 'cancelled' WHERE status = 'refunded'",
)
_BACK = (
    "UPDATE deals SET status = 'created'   WHERE status = 'agreed'",
    "UPDATE deals SET status = 'paid_held' WHERE status = 'meeting'",
    "UPDATE deals SET status = 'released'  WHERE status = 'done'",
    "UPDATE deals SET status = 'disputed'  WHERE status = 'problem'",
)


def _remap(statements: tuple[str, ...]) -> None:
    for stmt in statements:
        op.execute(stmt)


def upgrade() -> None:
    op.drop_constraint("status_valid", "deals", type_="check")
    _remap(_FORWARD)
    op.create_check_constraint(
        "status_valid",
        "deals",
        "status IN ('agreed','meeting','done','problem','cancelled')",
    )
    op.alter_column("deals", "status", server_default="agreed")


def downgrade() -> None:
    op.drop_constraint("status_valid", "deals", type_="check")
    _remap(_BACK)
    op.create_check_constraint(
        "status_valid",
        "deals",
        "status IN ('created','paid_held','released','refunded','disputed','cancelled')",
    )
    op.alter_column("deals", "status", server_default="created")
