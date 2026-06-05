"""httpx OAuthProviderClient — token exchange (PKCE) + userinfo, fail-closed.

Backend-mediated Authorization Code + PKCE (AUTH_HANDOFF §4.1): the verifier never
leaves the server; client_secret stays here. Any provider/transport error returns
``None`` so the domain fails closed (``oauth_failed``). Tokens/secrets are never
logged.
"""

from __future__ import annotations

import httpx

from app.core.auth.oauth_config import ProviderConfig
from app.core.auth.oauth_ports import OAuthProfile

_DEFAULT_TIMEOUT = 8.0


class HttpxOAuthProviderClient:
    """Implements :class:`app.core.auth.oauth_ports.OAuthProviderClient`."""

    def __init__(
        self, configs: dict[str, ProviderConfig], *, timeout: float = _DEFAULT_TIMEOUT
    ) -> None:
        self._configs = configs
        self._timeout = timeout

    def fetch_profile(
        self, provider: str, *, code: str, verifier: str, redirect_uri: str
    ) -> OAuthProfile | None:
        cfg = self._configs.get(provider)
        if cfg is None or not cfg.configured:
            return None
        try:
            with httpx.Client(timeout=self._timeout) as client:
                token_resp = client.post(
                    cfg.token_url,
                    data={
                        "grant_type": "authorization_code",
                        "code": code,
                        "redirect_uri": redirect_uri,
                        "client_id": cfg.client_id,
                        "client_secret": cfg.client_secret,
                        "code_verifier": verifier,
                    },
                    headers={"Accept": "application/json"},
                )
                token_resp.raise_for_status()
                access_token = token_resp.json().get("access_token")
                if not access_token:
                    return None
                info_resp = client.get(
                    cfg.userinfo_url,
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json",
                    },
                )
                info_resp.raise_for_status()
                data = info_resp.json()
        except (httpx.HTTPError, ValueError):
            return None

        if not isinstance(data, dict):
            return None
        subject = str(data.get(cfg.subject_field) or "").strip()
        if not subject:
            return None

        def _field(key: str | None) -> str | None:
            if not key:
                return None
            val = data.get(key)
            return str(val) if val else None

        return OAuthProfile(
            subject=subject, email=_field(cfg.email_field), name=_field(cfg.name_field)
        )
