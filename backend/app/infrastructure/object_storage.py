"""Object storage adapters (ObjectStorage port).

``LocalFsStorage`` is the dev/test backend (writes under a local dir, serves via
a base URL). The S3 adapter (Yandex Object Storage + CDN) lands when creds exist
(OPERATIONS §4) behind the same port.
"""

from __future__ import annotations

from pathlib import Path


class LocalFsStorage:
    """Implements :class:`app.core.photos.ports.ObjectStorage` on the filesystem."""

    def __init__(self, base_dir: Path, base_url: str) -> None:
        self._base_dir = base_dir
        self._base_url = base_url.rstrip("/")

    def put(self, key: str, data: bytes, content_type: str) -> str:
        path = self._base_dir / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return f"{self._base_url}/{key}"
