"""RBAC roles (SECURITY §5). Any user can be buyer+seller; staff roles are
moderator/support/admin."""

from __future__ import annotations

ROLES = frozenset({"buyer", "seller", "moderator", "support", "admin"})


def has_role(roles: tuple[str, ...], role: str) -> bool:
    return role in roles
