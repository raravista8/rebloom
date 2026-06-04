"""Upload dedup gate (T3.4, SECURITY T-09): a photo matching ANOTHER owner's photo
is held ``pending`` (stolen-photo signal); a unique one or your own re-upload pass."""

from __future__ import annotations

from app.core.photos.schemas import ProcessedImage
from app.core.photos.service import PhotoUploadService
from app.core.result import Ok

from tests.fakes import FakeObjectStorage, FakePhotoRepository

PHASH_A = "0f0f0f0f0f0f0f0f"
PHASH_FAR = "f0f0f0f0f0f0f0f0"  # hamming(A, FAR) = 64


class _Processor:
    """ImageProcessor stub returning a fixed perceptual hash."""

    def __init__(self, phash: str) -> None:
        self._phash = phash

    def process(self, raw: bytes) -> ProcessedImage:
        return ProcessedImage(
            variants={"thumb": b"x", "card": b"x", "full": b"x"},
            content_type="image/webp",
            phash=self._phash,
        )


def _svc(photos: FakePhotoRepository, phash: str) -> PhotoUploadService:
    return PhotoUploadService(photos, _Processor(phash), FakeObjectStorage())


def test_duplicate_of_another_owner_is_held() -> None:
    photos = FakePhotoRepository()
    photos.seed_phash("existing", "other-owner", PHASH_A)  # someone else's photo
    photos.seed("mine", "me", "pending")  # my pending upload slot

    result = _svc(photos, PHASH_A).upload("me", "mine", b"bytes")
    assert isinstance(result, Ok)
    assert photos._photos["mine"][1] == "pending"  # flagged for review


def test_unique_photo_is_approved() -> None:
    photos = FakePhotoRepository()
    photos.seed_phash("existing", "other-owner", PHASH_FAR)
    photos.seed("mine", "me", "pending")

    _svc(photos, PHASH_A).upload("me", "mine", b"bytes")
    assert photos._photos["mine"][1] == "approved"


def test_own_reupload_is_not_flagged() -> None:
    photos = FakePhotoRepository()
    photos.seed_phash("mine-old", "me", PHASH_A)  # my earlier photo, same hash
    photos.seed("mine-new", "me", "pending")

    _svc(photos, PHASH_A).upload("me", "mine-new", b"bytes")
    assert photos._photos["mine-new"][1] == "approved"  # only OTHER owners count
