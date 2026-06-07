"""UserView public serialization — created_at exposed as ISO-8601 (API_CONTRACT §2)."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.users.schemas import UserView


def _view(created_at: datetime | None) -> UserView:
    return UserView(
        id="u1",
        phone="+79990000000",
        display_name="Аня",
        city_id="msk",
        roles=("buyer", "seller"),
        seller_rating=4.7,
        status="active",
        created_at=created_at,
    )


def test_to_public_serializes_created_at_iso() -> None:
    out = _view(datetime(2026, 1, 15, 9, 30, tzinfo=UTC)).to_public(deals_count=3)
    assert out["created_at"] == "2026-01-15T09:30:00+00:00"


def test_to_public_created_at_none_when_absent() -> None:
    out = _view(None).to_public()
    assert out["created_at"] is None
