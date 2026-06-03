"""Listing lifecycle transitions (FR-010/013/014)."""

from __future__ import annotations

import pytest
from app.core.listings.state_machine import can_transition, status_after_publish


@pytest.mark.parametrize(
    ("frm", "to"),
    [
        ("draft", "pending_review"),
        ("draft", "active"),
        ("pending_review", "active"),
        ("active", "reserved"),
        ("reserved", "sold"),
        ("reserved", "active"),
        ("active", "archived"),
    ],
)
def test_legal_transitions(frm: str, to: str) -> None:
    assert can_transition(frm, to)


@pytest.mark.parametrize(
    ("frm", "to"),
    [
        ("sold", "active"),
        ("archived", "active"),
        ("active", "sold"),  # must go through reserved
        ("draft", "sold"),
        ("active", "draft"),
    ],
)
def test_illegal_transitions(frm: str, to: str) -> None:
    assert not can_transition(frm, to)


def test_publish_gates_on_photo_moderation() -> None:
    assert status_after_publish(all_photos_approved=True) == "active"
    assert status_after_publish(all_photos_approved=False) == "pending_review"
