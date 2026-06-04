"""Deal state machine — one legal release path (FR-020..026)."""

from __future__ import annotations

import pytest
from app.core.deals.state_machine import (
    can_transition,
    is_release_trigger,
    is_terminal,
)


@pytest.mark.parametrize(
    ("frm", "to"),
    [
        ("created", "paid_held"),
        ("created", "cancelled"),
        ("paid_held", "released"),
        ("paid_held", "refunded"),
        ("paid_held", "disputed"),
        ("disputed", "released"),
        ("disputed", "refunded"),
    ],
)
def test_legal_transitions(frm: str, to: str) -> None:
    assert can_transition(frm, to)


@pytest.mark.parametrize(
    ("frm", "to"),
    [
        ("created", "released"),  # must be paid first
        ("paid_held", "created"),
        ("released", "refunded"),  # terminal
        ("refunded", "released"),
        ("cancelled", "paid_held"),
        ("released", "disputed"),
    ],
)
def test_illegal_transitions(frm: str, to: str) -> None:
    assert not can_transition(frm, to)


def test_terminal_states() -> None:
    assert is_terminal("released") and is_terminal("refunded") and is_terminal("cancelled")
    assert not is_terminal("paid_held") and not is_terminal("created")


def test_release_triggers() -> None:
    assert is_release_trigger("buyer_confirm")
    assert is_release_trigger("support_decision")
    assert not is_release_trigger("timeout")  # never release on timeout (fail-secure)
