"""Redis pub/sub realtime bus (ARCHITECTURE §12). Publish is sync (called from the
sync domain services); subscribe is async (consumed by the WebSocket handler).
Messages are JSON; Cyrillic is preserved (ensure_ascii=False)."""

from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator
from typing import Any

from app.config import get_settings
from app.infrastructure.redis import client

logger = logging.getLogger("rebloom.realtime")


class RedisRealtimeBus:
    """Implements :class:`app.core.realtime.ports.RealtimeBus`."""

    def publish(self, channel: str, message: dict[str, Any]) -> None:
        try:
            client.publish(channel, json.dumps(message, ensure_ascii=False))
        except Exception:  # best-effort — clients degrade to polling
            logger.warning("realtime publish to %s failed", channel)


class RealtimeSubscription:
    """Async context manager + iterator over a channel. ``__aenter__`` performs
    the SUBSCRIBE *eagerly* so a caller can announce readiness without racing the
    first publish. Uses a dedicated async Redis connection (the sync client is for
    publish) and tears it down on exit."""

    def __init__(self, channel: str) -> None:
        self._channel = channel
        self._conn: Any = None
        self._pubsub: Any = None

    async def __aenter__(self) -> RealtimeSubscription:
        import redis.asyncio as aioredis

        self._conn = aioredis.from_url(  # type: ignore[no-untyped-call]
            get_settings().redis_url, decode_responses=True
        )
        self._pubsub = self._conn.pubsub()
        await self._pubsub.subscribe(self._channel)
        return self

    async def __aexit__(self, *exc: object) -> None:
        if self._pubsub is not None:
            await self._pubsub.unsubscribe(self._channel)
            await self._pubsub.aclose()
        if self._conn is not None:
            await self._conn.aclose()

    async def __aiter__(self) -> AsyncIterator[dict[str, Any]]:
        async for raw in self._pubsub.listen():
            if raw.get("type") == "message":
                try:
                    yield json.loads(raw["data"])
                except (ValueError, TypeError):
                    continue
