"""Photo pipeline ports — image processing + blob storage."""

from __future__ import annotations

from typing import Protocol

from app.core.photos.schemas import ProcessedImage


class ImageProcessor(Protocol):
    """Validate + re-encode + strip EXIF + make variants. ``None`` = rejected."""

    def process(self, raw: bytes) -> ProcessedImage | None: ...


class ObjectStorage(Protocol):
    """Store a blob under ``key`` and return its (CDN) URL."""

    def put(self, key: str, data: bytes, content_type: str) -> str: ...
