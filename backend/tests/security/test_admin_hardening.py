"""Admin IP-allowlist + OTP-reveal prod hard-guard (SECURITY A07/A09, OPERATIONS §6)."""

from __future__ import annotations

import app.api.deps as deps
import pytest
from app.api.deps import _client_ip, require_admin
from app.config import Settings
from app.core.users.schemas import UserView
from fastapi import HTTPException


def _settings(**kw: object) -> Settings:
    return Settings(**kw)  # type: ignore[arg-type]


def _admin() -> UserView:
    return UserView(
        id="a",
        phone=None,
        display_name="A",
        city_id="msk",
        roles=("buyer", "admin"),
        seller_rating=None,
        status="active",
    )


class _Req:
    def __init__(self, xff: str | None = None, host: str = "10.0.0.1") -> None:
        self.headers = {"x-forwarded-for": xff} if xff else {}
        self.client = type("C", (), {"host": host})()


# ── OTP reveal hard-guard ──
@pytest.mark.parametrize(
    ("env", "reveal", "ack", "expected"),
    [
        ("local", False, False, True),  # local always reveals
        ("local", True, False, True),
        ("staging", True, False, True),  # non-prod: the flag alone reveals
        ("staging", False, False, False),
        ("prod", True, False, False),  # prod: SMS_REVEAL_OTP ALONE does nothing — the guard
        ("prod", True, True, True),  # prod: needs the explicit ack
        ("prod", False, True, False),
    ],
)
def test_otp_reveal_active(env: str, reveal: bool, ack: bool, expected: bool) -> None:
    s = _settings(app_env=env, sms_reveal_otp=reveal, sms_reveal_otp_allow_prod=ack)
    assert s.otp_reveal_active is expected


# ── admin IP allowlist ──
def test_admin_ip_allowset_parsing() -> None:
    assert _settings(admin_ip_allowlist="").admin_ip_allowset == frozenset()
    assert _settings(admin_ip_allowlist=" 1.2.3.4 , 5.6.7.8 ").admin_ip_allowset == {
        "1.2.3.4",
        "5.6.7.8",
    }


def test_client_ip_prefers_leftmost_xff() -> None:
    assert _client_ip(_Req(xff="9.9.9.9, 10.0.0.2")) == "9.9.9.9"  # type: ignore[arg-type]
    assert _client_ip(_Req(xff=None, host="10.0.0.5")) == "10.0.0.5"  # type: ignore[arg-type]


def test_require_admin_allows_when_allowlist_empty(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(deps, "get_settings", lambda: _settings(admin_ip_allowlist=""))
    assert require_admin(_Req(xff="9.9.9.9"), _admin()).id == "a"  # type: ignore[arg-type]


def test_require_admin_blocks_unlisted_ip(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(deps, "get_settings", lambda: _settings(admin_ip_allowlist="1.2.3.4"))
    with pytest.raises(HTTPException) as e:
        require_admin(_Req(xff="9.9.9.9"), _admin())  # type: ignore[arg-type]
    assert e.value.status_code == 403


def test_require_admin_allows_listed_ip(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        deps, "get_settings", lambda: _settings(admin_ip_allowlist="9.9.9.9,1.2.3.4")
    )
    assert require_admin(_Req(xff="9.9.9.9, 10.0.0.2"), _admin()).id == "a"  # type: ignore[arg-type]
