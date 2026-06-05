"""Postgres OAuthIdentityRepo — resolves a provider identity to a platform user.

First sight of a ``(provider, subject)`` creates a phone-less user (linked later
by phone/email per AUTH_HANDOFF §7); thereafter it logs that same user in. One
writer transaction (auth correctness over replica offload, like the phone path)."""

from __future__ import annotations

from sqlalchemy import select

from app.infrastructure.postgres.engine import writer_session
from app.infrastructure.postgres.models import OAuthIdentity, User


class PostgresOAuthIdentityRepo:
    """Implements :class:`app.core.auth.oauth_ports.OAuthIdentityRepo`."""

    def login_or_create(
        self, *, provider: str, subject: str, email: str | None, name: str | None
    ) -> tuple[str, bool]:
        with writer_session() as session:
            ident = session.scalar(
                select(OAuthIdentity).where(
                    OAuthIdentity.provider == provider, OAuthIdentity.subject == subject
                )
            )
            if ident is not None:
                return str(ident.user_id), False

            user = User(
                roles=["buyer"], status="active", display_name=(name[:64] if name else None)
            )
            session.add(user)
            session.flush()
            session.add(
                OAuthIdentity(provider=provider, subject=subject, user_id=user.id, email=email)
            )
            return str(user.id), True
