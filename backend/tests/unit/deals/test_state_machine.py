"""Deal state machine — no-escrow «оплата при встрече» (ADR-0013)."""

from __future__ import annotations

import pytest
from app.core.deals.state_machine import can_transition, is_terminal

LEGAL = [
    ("agreed", "meeting"),
    ("agreed", "done"),
    ("agreed", "problem"),
    ("agreed", "cancelled"),
    ("meeting", "done"),
    ("meeting", "problem"),
    ("meeting", "cancelled"),
    ("problem", "done"),
    ("problem", "cancelled"),
]

ILLEGAL = [
    ("done", "meeting"),
    ("done", "cancelled"),
    ("cancelled", "agreed"),
    ("meeting", "agreed"),
    ("problem", "meeting"),
]


@pytest.mark.parametrize(("frm", "to"), LEGAL)
def test_legal_transitions(frm: str, to: str) -> None:
    assert can_transition(frm, to)


@pytest.mark.parametrize(("frm", "to"), ILLEGAL)
def test_illegal_transitions(frm: str, to: str) -> None:
    assert not can_transition(frm, to)


def test_terminal_states() -> None:
    assert is_terminal("done")
    assert is_terminal("cancelled")
    assert not is_terminal("agreed")
    assert not is_terminal("meeting")
    assert not is_terminal("problem")
