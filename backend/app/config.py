"""Application configuration loaded from the environment (Pydantic Settings).

Env contract lives in ``.env.example`` at the repo root. Secrets are NEVER
committed; only ``.env.example`` is. See SECURITY §6.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

AppEnv = Literal["local", "staging", "prod"]


class Settings(BaseSettings):
    """Typed view over the process environment.

    ``extra='ignore'`` (not ``forbid``) here on purpose: the deployment ``.env``
    legitimately carries vars consumed by other services (web, compose). Domain
    and API Pydantic models use ``extra='forbid'`` per CLAUDE.md §4.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # ── App ──
    app_env: AppEnv = "local"
    app_secret_key: str = "dev-insecure-change-me"
    app_base_url: str = "http://localhost:8000"
    log_level: str = "INFO"
    # Staging affordance: log the plaintext OTP when no real SMS provider is wired
    # (so a test box without SMS is still loginnable). The code stays random,
    # single-use and rate-limited — only its visibility to log-holders changes.
    # Default off; NEVER enable on a box with real users. APP_ENV=local also reveals.
    sms_reveal_otp: bool = False
    # Hard-guard: in prod, `sms_reveal_otp` ALONE does nothing — revealing the OTP on a
    # prod box also requires this explicit acknowledgement, so a stray SMS_REVEAL_OTP=true
    # in a real deploy can't silently leak login codes. Both must be removed at launch.
    sms_reveal_otp_allow_prod: bool = False
    # Admin IP allowlist (OPERATIONS §6): comma-separated client IPs permitted on /admin.
    # Empty = allow any (the dev/default). Enforced on top of session + TOTP 2FA + RBAC.
    admin_ip_allowlist: str = ""

    @property
    def otp_reveal_active(self) -> bool:
        """Whether ConsoleSmsSender should log the plaintext OTP. In prod the reveal
        needs the extra `sms_reveal_otp_allow_prod` ack (SECURITY: auth-secret-in-logs)."""
        if self.app_env == "local":
            return True
        return self.sms_reveal_otp and (self.app_env != "prod" or self.sms_reveal_otp_allow_prod)

    @property
    def admin_ip_allowset(self) -> frozenset[str]:
        return frozenset(ip.strip() for ip in self.admin_ip_allowlist.split(",") if ip.strip())

    # ── Postgres (writer + optional read-replica) ──
    database_url: str = "postgresql+psycopg://rebloom_app:rebloom@localhost:5432/rebloom"
    database_replica_url: str = ""
    db_migrator_url: str = "postgresql+psycopg://rebloom_migrator:rebloom@localhost:5432/rebloom"

    # ── Redis (queue + sessions + counters + pub/sub) ──
    redis_url: str = "redis://localhost:6379/0"

    # ── Photo storage (local FS in dev; S3 + CDN in prod, OPERATIONS §4) ──
    photo_storage_dir: str = ".data/photos"
    cdn_base_url: str = "http://localhost:8000/media"

    # ── Commission (ADR-0010) ──
    platform_commission_bps: int = Field(default=1000, ge=0, le=10000)
    commission_who_pays: Literal["seller", "buyer", "split"] = "seller"

    # ── Deals ──
    reservation_ttl_minutes: int = Field(default=30, ge=1)  # FR-022 payment timeout

    # ── ЮKassa webhook verification (SECURITY T-02) ──
    yookassa_webhook_secret: str = ""
    yookassa_webhook_ip_allowlist: str = ""  # comma-separated; empty = allow (dev)

    # ── PII field encryption (ADR-0012, SECURITY T-10). base64 of 32 bytes.
    # Empty in dev → a deterministic dev key is used; MUST be set in prod.
    pii_enc_key: str = ""

    # ── OAuth providers (AUTH_HANDOFF §4) — backend-only secrets, never shipped to
    # the client. Empty id/secret = that provider is disabled (button → oauth_failed).
    # `oauth_redirect_allowlist` = comma-separated permitted post-login redirect_uri.
    oauth_redirect_allowlist: str = ""
    oauth_yandex_client_id: str = ""
    oauth_yandex_client_secret: str = ""
    oauth_sber_client_id: str = ""
    oauth_sber_client_secret: str = ""
    oauth_vk_client_id: str = ""
    oauth_vk_client_secret: str = ""
    oauth_tid_client_id: str = ""
    oauth_tid_client_secret: str = ""

    @property
    def is_prod(self) -> bool:
        return self.app_env == "prod"

    @property
    def reader_url(self) -> str:
        """DSN for read-only queries — replica when configured, else writer."""
        return self.database_replica_url or self.database_url


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Process-wide settings singleton."""
    return Settings()
