"""OAuthProviderClient — token exchange (PKCE) + userinfo, fail-closed.

Backend-mediated Authorization Code + PKCE (AUTH_HANDOFF §4.1): the verifier never
leaves the server; client_secret stays here. Uses the stdlib (``urllib``) — no new
runtime dependency (CLAUDE.md §6). Any provider/transport error returns ``None`` so
the domain fails closed (``oauth_failed``). Tokens/secrets are never logged.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

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

    def _post_json(self, url: str, form: dict[str, str]) -> dict[str, Any] | None:
        body = urllib.parse.urlencode(form).encode("ascii")
        req = urllib.request.Request(
            url,
            data=body,
            method="POST",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
        )
        return self._read_json(req)

    def _get_json(self, url: str, bearer: str) -> dict[str, Any] | None:
        req = urllib.request.Request(
            url,
            method="GET",
            headers={"Authorization": f"Bearer {bearer}", "Accept": "application/json"},
        )
        return self._read_json(req)

    def _read_json(self, req: urllib.request.Request) -> dict[str, Any] | None:
        if not req.full_url.lower().startswith("https://"):
            return None  # never speak OAuth over plaintext
        try:
            with urllib.request.urlopen(req, timeout=self._timeout) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, OSError, ValueError, TimeoutError):
            return None
        return payload if isinstance(payload, dict) else None

    def fetch_profile(
        self, provider: str, *, code: str, verifier: str, redirect_uri: str
    ) -> OAuthProfile | None:
        cfg = self._configs.get(provider)
        if cfg is None or not cfg.configured:
            return None

        token = self._post_json(
            cfg.token_url,
            {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": cfg.client_id,
                "client_secret": cfg.client_secret,
                "code_verifier": verifier,
            },
        )
        access_token = token.get("access_token") if token else None
        if not access_token:
            return None

        data = self._get_json(cfg.userinfo_url, str(access_token))
        if data is None:
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
