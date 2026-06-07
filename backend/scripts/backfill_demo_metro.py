"""Backfill metro station + flower types onto DEMO listings — NOT for real prod data.

Companion to ``seed_demo.py``: the demo seed creates msk listings with no metro
landmark and no flower types, so canon 0.9.0's metro/flower features render empty
on the demo box. This assigns each such listing a real metro station (valid for
its own city — msk/spb only; no-metro cities are skipped) and 1–3 flower types
from the canonical enum.

IDEMPOTENT + re-runnable: only touches active listings where
``metro_station_id IS NULL``. A listing that already has a metro id is left alone,
so re-running adds nothing.

DETERMINISTIC spread (no randomness): each eligible listing is ordered by id and
its 0-based index drives the choice — ``stations[idx % len(stations)]`` for the
station, and a rotating window over the flower list for 1–3 types. Same DB →
same assignment every run.

Run INSIDE the api container (it has DATABASE_URL), piped over stdin:

    C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
    $C exec -T api python - < backend/scripts/backfill_demo_metro.py
"""

from __future__ import annotations

import json
import os

from app.core.geo.metro import stations_for_city
from app.core.listings.flowers import FLOWERS
from sqlalchemy import create_engine, text

DB_URL = os.environ["DATABASE_URL"]

# Flower ids in their canonical order (the spread rotates over this list).
FLOWER_IDS: list[str] = [fid for fid, _ in FLOWERS]


def flowers_for(idx: int) -> list[str]:
    """1–3 flower types, deterministically spread by listing index.

    Count cycles 1→2→3→1… ; the starting offset advances each listing so the
    window slides across the whole flower list rather than repeating.
    """
    count = (idx % 3) + 1
    start = idx % len(FLOWER_IDS)
    return [FLOWER_IDS[(start + k) % len(FLOWER_IDS)] for k in range(count)]


def main() -> None:
    engine = create_engine(DB_URL, future=True)
    # Cache the station id list per city (msk/spb only — others have no metro).
    stations_by_city: dict[str, list[str]] = {}
    updated = 0
    with engine.begin() as cx:
        rows = cx.execute(
            text(
                "SELECT id, city_id FROM listings "
                "WHERE status = 'active' AND metro_station_id IS NULL "
                "ORDER BY id"
            )
        ).all()
        for idx, (listing_id, city_id) in enumerate(rows):
            if city_id not in stations_by_city:
                stations_by_city[city_id] = [s.id for s in stations_for_city(city_id)]
            stations = stations_by_city[city_id]
            if not stations:  # no-metro city → leave metro NULL (район fallback)
                continue
            station_id = stations[idx % len(stations)]
            flowers = flowers_for(idx)
            cx.execute(
                text(
                    "UPDATE listings SET metro_station_id = :sid, flower_types = CAST(:fl AS json) "
                    "WHERE id = :id"
                ),
                {"sid": station_id, "fl": json.dumps(flowers), "id": str(listing_id)},
            )
            updated += 1
            print(f"  {listing_id} [{city_id}] -> {station_id} {flowers}")
    print(f"DONE: backfilled {updated} listing(s)")


if __name__ == "__main__":
    main()
