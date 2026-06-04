"""Upload policy constants (SECURITY T-04, FR-011)."""

from __future__ import annotations

ALLOWED_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MiB
MAX_DIMENSION = 6000  # reject absurd inputs (decompression bombs)
OUTPUT_CONTENT_TYPE = "image/webp"

# Variant name → longest-edge px (aspect preserved). Served from CDN.
VARIANTS: dict[str, int] = {"thumb": 320, "card": 800, "full": 1600}


def is_allowed_content_type(content_type: str) -> bool:
    return content_type.split(";")[0].strip().lower() in ALLOWED_CONTENT_TYPES
