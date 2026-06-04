"""Realtime bus port (ARCHITECTURE §12). Domain services publish events; the WS
layer subscribes. Adapter is Redis pub/sub (infrastructure/realtime.py)."""

from __future__ import annotations

from typing import Any, Protocol


class RealtimeBus(Protocol):
    def publish(self, channel: str, message: dict[str, Any]) -> None:
        """Fire-and-forget fan-out. Best-effort — never blocks the caller's
        transaction; a delivery failure just means clients fall back to polling."""
        ...


def deal_channel(deal_id: str) -> str:
    return f"deal:{deal_id}"


def listing_channel(listing_id: str) -> str:
    return f"listing:{listing_id}"
