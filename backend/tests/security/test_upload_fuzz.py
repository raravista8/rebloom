"""SECURITY T-04 / FR-011 — upload validation + EXIF stripping."""

from __future__ import annotations

import io

import pytest
from app.core.photos.policy import MAX_UPLOAD_BYTES
from app.infrastructure.images import PillowImageProcessor
from PIL import Image

pytestmark = pytest.mark.security

processor = PillowImageProcessor()


def _png(size: tuple[int, int] = (64, 48)) -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", size, (180, 90, 40)).save(buffer, "PNG")
    return buffer.getvalue()


def _jpeg_with_exif() -> bytes:
    img = Image.new("RGB", (80, 60), (10, 20, 30))
    exif = img.getexif()
    exif[0x0110] = "SECRETCAM"  # Model tag
    buffer = io.BytesIO()
    img.save(buffer, "JPEG", exif=exif)
    return buffer.getvalue()


def test_valid_image_produces_webp_variants() -> None:
    result = processor.process(_png())
    assert result is not None
    assert set(result.variants) == {"thumb", "card", "full"}
    assert result.content_type == "image/webp"
    for data in result.variants.values():
        assert Image.open(io.BytesIO(data)).format == "WEBP"


def test_exif_is_stripped() -> None:
    raw = _jpeg_with_exif()
    assert b"SECRETCAM" in raw  # sanity: marker is in the input
    result = processor.process(raw)
    assert result is not None
    for data in result.variants.values():
        assert b"SECRETCAM" not in data
        assert not dict(Image.open(io.BytesIO(data)).getexif())


@pytest.mark.parametrize(
    "raw",
    [
        b"",
        b"not an image at all",
        b"<svg xmlns='http://www.w3.org/2000/svg'><rect width='1' height='1'/></svg>",
        b"GIF89a\x01\x00\x01\x00",  # truncated/odd
    ],
)
def test_non_images_and_svg_rejected(raw: bytes) -> None:
    assert processor.process(raw) is None


def test_oversize_rejected() -> None:
    assert processor.process(b"\xff" * (MAX_UPLOAD_BYTES + 1)) is None


def test_large_image_downscaled_to_variant_caps() -> None:
    result = processor.process(_png((3000, 2000)))
    assert result is not None
    thumb = Image.open(io.BytesIO(result.variants["thumb"]))
    assert max(thumb.size) <= 320
