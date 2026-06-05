"""Per-provider OAuth configuration (AUTH_HANDOFF §4.2/§4.4).

Endpoints have well-known defaults; ``client_id``/``client_secret`` and the
``redirect_uri`` allowlist come from the environment (backend-only — secrets are
never shipped to the client). A provider is *configured* only when its id+secret
are present, so absent credentials cleanly disable that button (``oauth_failed``)
rather than 500.
"""

from __future__ import annotations

from dataclasses import dataclass

PROVIDERS = ("yandex", "sber", "vk", "tid")


@dataclass(frozen=True, slots=True)
class ProviderConfig:
    client_id: str
    client_secret: str
    authorize_url: str
    token_url: str
    userinfo_url: str
    scope: str
    subject_field: str
    email_field: str | None
    name_field: str | None
    redirect_allowlist: tuple[str, ...]

    @property
    def configured(self) -> bool:
        return bool(
            self.client_id
            and self.client_secret
            and self.authorize_url
            and self.token_url
            and self.userinfo_url
        )


# Well-known endpoints + the profile-field mapping per provider. Yandex's are
# stable; the others are sensible defaults overridable per-provider via env
# (`OAUTH_<PROVIDER>_AUTHORIZE_URL`, …) once the integration is finalized.
_DEFAULTS: dict[str, dict[str, str]] = {
    "yandex": {
        "authorize_url": "https://oauth.yandex.ru/authorize",
        "token_url": "https://oauth.yandex.ru/token",  # nosec B105
        "userinfo_url": "https://login.yandex.ru/info?format=json",
        "scope": "login:info login:email",
        "subject_field": "id",
        "email_field": "default_email",
        "name_field": "real_name",
    },
    "sber": {
        "authorize_url": "https://online.sberbank.ru/CSAFront/oidc/authorize.do",
        "token_url": "https://api.sberbank.ru/ru/prod/tokens/v2/oidc",  # nosec B105
        "userinfo_url": "https://api.sberbank.ru/ru/prod/sberbankid/v2.1/userInfo",
        "scope": "openid name email phone",
        "subject_field": "sub",
        "email_field": "email",
        "name_field": "name",
    },
    "vk": {
        "authorize_url": "https://id.vk.com/authorize",
        "token_url": "https://id.vk.com/oauth2/auth",  # nosec B105
        "userinfo_url": "https://id.vk.com/oauth2/user_info",
        "scope": "email",
        "subject_field": "user_id",
        "email_field": "email",
        "name_field": "first_name",
    },
    "tid": {
        "authorize_url": "https://id.tinkoff.ru/auth/authorize",
        "token_url": "https://id.tinkoff.ru/auth/token",  # nosec B105
        "userinfo_url": "https://id.tinkoff.ru/userinfo/userinfo",
        "scope": "openid name email phone",
        "subject_field": "sub",
        "email_field": "email",
        "name_field": "name",
    },
}


def _env(settings: object, name: str, default: str = "") -> str:
    """Read an optional env-backed override off Settings (extra='ignore' lets the
    deployment .env carry OAUTH_* without being declared on the model)."""
    return str(getattr(settings, name.lower(), default) or default)


def load_provider_configs(settings: object) -> dict[str, ProviderConfig]:
    """Build the provider map from defaults + environment overrides."""
    allowlist = tuple(
        u.strip() for u in _env(settings, "oauth_redirect_allowlist").split(",") if u.strip()
    )
    out: dict[str, ProviderConfig] = {}
    for p in PROVIDERS:
        d = _DEFAULTS[p]
        out[p] = ProviderConfig(
            client_id=_env(settings, f"oauth_{p}_client_id"),
            client_secret=_env(settings, f"oauth_{p}_client_secret"),
            authorize_url=_env(settings, f"oauth_{p}_authorize_url", d["authorize_url"]),
            token_url=_env(settings, f"oauth_{p}_token_url", d["token_url"]),
            userinfo_url=_env(settings, f"oauth_{p}_userinfo_url", d["userinfo_url"]),
            scope=_env(settings, f"oauth_{p}_scope", d["scope"]),
            subject_field=d["subject_field"],
            email_field=d["email_field"] or None,
            name_field=d["name_field"] or None,
            redirect_allowlist=allowlist,
        )
    return out
