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
        return ProcessedImage(variants=variants, content_type="image/webp", phash=_dhash(base))


def _dhash(image: Image.Image) -> str:
    """64-bit difference hash → 16-char hex (SECURITY T-09). Robust to re-encode
    and resize: downscale to 9×8 grayscale, then compare horizontally-adjacent
    pixels (8 bits × 8 rows)."""
    small = image.convert("L").resize((9, 8), Image.Resampling.LANCZOS)
    pixels = list(small.getdata())
    bits = 0
    for row in range(8):
        for col in range(8):
            left = pixels[row * 9 + col]
            right = pixels[row * 9 + col + 1]
            bits = (bits << 1) | (1 if left > right else 0)
    return f"{bits:016x}"
