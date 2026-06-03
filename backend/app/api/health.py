"""Health & build-stamp endpoints.

``/healthz`` = liveness (the process is up). ``/readyz`` = readiness
(dependencies reachable) — distinct semantics per SECURITY §8. Dependency
probes are wired in T0.4; until then readiness reports the process only.
``/version`` exposes the build stamp (OPERATIONS §1).
"""

from __future__ import annotations

import os
from typing import Any

from fastapi import APIRouter, Response

from app.api.envelope import ok
from app.infrastructure.postgres.engine import check_primary
from app.infrastructure.redis import check_redis

router = APIRouter(tags=["health"])


@router.get("/healthz")
def healthz() -> dict[str, Any]:
    """Liveness — 200 as long as the process can serve."""
    return ok({"status": "alive"})


@router.get("/readyz")
def readyz(response: Response) -> dict[str, Any]:
    """Readiness — primary DB + Redis must be reachable (distinct from liveness)."""
    checks = {
        "db": "ok" if check_primary() else "down",
        "redis": "ok" if check_redis() else "down",
    }
    ready = all(v == "ok" for v in checks.values())
    if not ready:
        response.status_code = 503
    return ok({"ready": ready, "checks": checks})


@router.get("/version")
def version() -> dict[str, Any]:
    """Build stamp — populated at image build time via env (OPERATIONS §2)."""
    return ok(
        {
            "git_sha": os.getenv("BUILD_VERSION", "dev"),
            "built_at": os.getenv("BUILD_TIME", "unknown"),
        }
    )
