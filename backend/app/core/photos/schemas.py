"""Photo processing value objects."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class ProcessedImage:
    variants: dict[str, bytes]  # variant name → encoded (WebP) bytes, EXIF-free
    content_type: str
    phash: str  # 16-char hex (64-bit) perceptual hash for duplicate detection
