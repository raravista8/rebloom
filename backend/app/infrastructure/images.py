"""Pillow image processor (ADR-0011) — validate, re-encode to WebP, strip EXIF.

Opening with Pillow rejects non-images and SVG (it can't decode them). Every
variant is a fresh WebP encode from an RGB copy, so no source EXIF/GPS survives
(SECURITY T-04, FR-011).
"""

from __future__ import annotations

import io

from PIL import Image, UnidentifiedImageError

from app.core.photos.policy import MAX_DIMENSION, MAX_UPLOAD_BYTES, VARIANTS
from app.core.photos.schemas import ProcessedImage

_ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


class PillowImageProcessor:
    """Implements :class:`app.core.photos.ports.ImageProcessor`."""

    def process(self, raw: bytes) -> ProcessedImage | None:
        if not raw or len(raw) > MAX_UPLOAD_BYTES:
            return None
        try:
            with Image.open(io.BytesIO(raw)) as img:
                img.load()
                if img.format not in _ALLOWED_FORMATS:
                    return None
                width, height = img.size
                if not (0 < width <= MAX_DIMENSION and 0 < height <= MAX_DIMENSION):
                    return None
                base = img.convert("RGB")
        except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
            return None

        variants: dict[str, bytes] = {}
        for name, edge in VARIANTS.items():
            variant = base.copy()
            variant.thumbnail((edge, edge))  # preserve aspect, cap longest edge
            buffer = io.BytesIO()
            variant.save(buffer, format="WEBP", quality=82)  # fresh encode → no EXIF
            variants[name] = buffer.getvalue()
        return ProcessedImage(variants=variants, content_type="image/webp")
