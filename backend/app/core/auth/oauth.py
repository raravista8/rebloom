"""OAuth login policy — Authorization Code + PKCE (AUTH_HANDOFF §4.1, SECURITY §10).

Pure domain, returns ``Result`` — no HTTP, no DB. The flow:

  start(provider, redirect_uri) → {authorize_url, state}
    · generate opaque ``state`` (anti-CSRF) + PKCE ``verifier``
    · persist them server-side keyed by ``state`` (single-use)
    · hand back the provider authorize URL with the S256 ``code_challenge``

  callback(provider, code, state) → {user_id, is_new}
    · ``state`` must exist (single-use take) and match the provider → else reject
    · exchange ``code`` (+ verifier) and fetch the profile via the provider port
    · resolve the identity to a user (create on first sight)

``redirect_uri`` is checked against a per-provider allowlist so an attacker can't
point the flow at their own callback (SECURITY §10).
"""

from __future__ import annotations

import base64
import hashlib
import secrets
import urllib.parse
from collections.abc import Callable
from dataclasses import dataclass

from app.core.auth.oauth_config import PROVIDERS, ProviderConfig
from app.core.auth.oauth_ports import OAuthIdentityRepo, OAuthProviderClient, OAuthStateStore
from app.core.errors import NOT_FOUND, OAUTH_FAILED, VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result

STATE_TTL_SECONDS = 600  # 10 min — the user must finish consent within this window


@dataclass(frozen=True, slots=True)
class OAuthStart:
    authorize_url: str
    state: str


@dataclass(frozen=True, slots=True)
class OAuthLogin:
    user_id: str
    is_new: bool


def _pkce_challenge(verifier: str) -> str:
    """RFC 7636 S256: base64url(sha256(verifier)), no padding."""
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return base64.urlsafe_b64encode(digest).decode("ascii").rstrip("=")


class OAuthService:
    def __init__(
        self,
        configs: dict[str, ProviderConfig],
        state_store: OAuthStateStore,
        provider_client: OAuthProviderClient,
        identity_repo: OAuthIdentityRepo,
        *,
        state_factory: Callable[[], str] | None = None,
        verifier_factory: Callable[[], str] | None = None,
    ) -> None:
        self._configs = configs
        self._states = state_store
        self._client = provider_client
        self._identities = identity_repo
        self._new_state = state_factory or (lambda: secrets.token_urlsafe(24))
        self._new_verifier = verifier_factory or (lambda: secrets.token_urlsafe(48))

    def start(self, provider: str, redirect_uri: str) -> Result[OAuthStart, DomainError]:
        cfg = self._configs.get(provider)
        if provider not in PROVIDERS or cfg is None:
            return Err(DomainError(NOT_FOUND, "unknown_provider"))
        if not cfg.configured:
            return Err(DomainError(OAUTH_FAILED, "not_configured"))
        if redirect_uri not in cfg.redirect_allowlist:
            return Err(DomainError(VALIDATION_ERROR, "redirect_uri_not_allowed"))

        state = self._new_state()
        verifier = self._new_verifier()
        self._states.put(
            state,
            provider=provider,
            verifier=verifier,
            redirect_uri=redirect_uri,
            ttl=STATE_TTL_SECONDS,
        )
        params = {
            "response_type": "code",
            "client_id": cfg.client_id,
            "redirect_uri": redirect_uri,
            "scope": cfg.scope,
            "state": state,
            "code_challenge": _pkce_challenge(verifier),
            "code_challenge_method": "S256",
        }
        sep = "&" if "?" in cfg.authorize_url else "?"
        return Ok(OAuthStart(cfg.authorize_url + sep + urllib.parse.urlencode(params), state))

    def callback(self, provider: str, code: str, state: str) -> Result[OAuthLogin, DomainError]:
        if not code or not state:
            return Err(DomainError(VALIDATION_ERROR, "missing_code_or_state"))
        stored = self._states.take(state)  # single-use → no replay
        if stored is None or stored.provider != provider:
            return Err(DomainError(OAUTH_FAILED, "bad_state"))
        cfg = self._configs.get(provider)
        if cfg is None or not cfg.configured:
            return Err(DomainError(OAUTH_FAILED, "not_configured"))

        profile = self._client.fetch_profile(
            provider, code=code, verifier=stored.verifier, redirect_uri=stored.redirect_uri
        )
        if profile is None or not profile.subject:
            return Err(DomainError(OAUTH_FAILED, "exchange_failed"))

        user_id, is_new = self._identities.login_or_create(
            provider=provider, subject=profile.subject, email=profile.email, name=profile.name
        )
        return Ok(OAuthLogin(user_id=user_id, is_new=is_new))
