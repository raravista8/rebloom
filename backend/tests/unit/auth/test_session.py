"""Server-side session lifecycle (ADR-0007)."""

from __future__ import annotations

from app.core.auth.session import SessionService

from tests.fakes import FakeSessionStore


def test_create_resolve_revoke() -> None:
    service = SessionService(FakeSessionStore())
    token = service.create("user-1")
    assert token
    assert service.resolve(token) == "user-1"

    service.revoke(token)
    assert service.resolve(token) is None


def test_resolve_unknown_token_is_none() -> None:
    assert SessionService(FakeSessionStore()).resolve("nope") is None


def test_tokens_are_unique() -> None:
    service = SessionService(FakeSessionStore())
    tokens = {service.create("u") for _ in range(50)}
    assert len(tokens) == 50
