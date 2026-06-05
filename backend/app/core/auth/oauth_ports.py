"""Ports for the OAuth (Authorization Code + PKCE) login flow — AUTH_HANDOFF §4.

The domain (:mod:`app.core.auth.oauth`) depends only on these Protocols; the HTTP
calls to providers, the Redis state store, and the identity table live in
infrastructure adapters (hexagonal, ARCHITECTURE §10).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True, slots=True)
class OAuthProfile:
    """Normalized provider profile (after token exchange + userinfo)."""

    subject: str  # stable provider-side user id
    email: str | None = None
    name: str | None = None


@dataclass(frozen=True, slots=True)
class StoredState:
    """The CSRF/PKCE state persisted between ``start`` and ``callback``."""

    provider: str
    verifier: str
    redirect_uri: str


class OAuthStateStore(Protocol):
    """Short-lived CSRF state + PKCE verifier, keyed by the opaque ``state``.

    ``take`` is single-use (get-and-delete) so a ``state`` cannot be replayed
    (SECURITY: OAuth anti-CSRF / replay).
    """

    def put(
        self, state: str, *, provider: str, verifier: str, redirect_uri: str, ttl: int
    ) -> None: ...
    def take(self, state: str) -> StoredState | None: ...


class OAuthProviderClient(Protocol):
    """Exchanges the authorization ``code`` (+ PKCE verifier) for a token and
    returns the normalized profile. Returns ``None`` on any failure (fail-closed)."""

    def fetch_profile(
        self, provider: str, *, code: str, verifier: str, redirect_uri: str
    ) -> OAuthProfile | None: ...


class OAuthIdentityRepo(Protocol):
    """Resolves a provider identity to a platform user, creating one on first
    sight. Returns ``(user_id, is_new)``."""

    def login_or_create(
        self, *, provider: str, subject: str, email: str | None, name: str | None
    ) -> tuple[str, bool]: ...
