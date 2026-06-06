"""Demo / staging seed for an EMPTY test box — NOT for real production.

Creates a test seller account (so the box owner can exercise the publish flow)
plus a handful of Moscow sellers, each with active bouquet listings and generated
placeholder photos, so the feed and chat can be tested end-to-end.

Idempotent: users are keyed by phone (existing ones are reused), and a seller is
given listings only until it has 2 active ones — re-running adds nothing new.

Run INSIDE the api container (it has DATABASE_URL, PHOTO_STORAGE_DIR,
CDN_BASE_URL, Pillow and the photos volume mounted). Pipe it over stdin so no
image rebuild is needed:

    C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
    $C exec -T api python - < backend/scripts/seed_demo.py

Photos are written under PHOTO_STORAGE_DIR/photos/<id>/<variant>.webp (the same
key layout PhotoUploadService uses) and served by Caddy at CDN_BASE_URL/...
"""

from __future__ import annotations

import io
import json
import math
import os
import random
import uuid
from datetime import UTC, datetime, timedelta
from pathlib import Path

from PIL import Image, ImageDraw
from sqlalchemy import create_engine, text

DB_URL = os.environ["DATABASE_URL"]
PHOTO_DIR = Path(os.environ.get("PHOTO_STORAGE_DIR", "/data/photos"))
CDN = os.environ["CDN_BASE_URL"].rstrip("/")
CITY = "msk"
VARIANT_WIDTH = {"thumb": 320, "card": 800, "full": 1600}
LISTINGS_PER_SELLER = 2

rnd = random.Random(20260606)

# (background, flower-1, flower-2)
PALETTES = [
    ((250, 238, 240), (212, 96, 120), (236, 168, 59)),
    ((238, 244, 238), (224, 122, 95), (124, 156, 110)),
    ((245, 240, 250), (158, 110, 188), (236, 168, 59)),
    ((248, 242, 232), (210, 130, 70), (180, 150, 90)),
    ((240, 246, 250), (90, 140, 200), (236, 168, 59)),
]

# (display_name, phone, is_owner_test_account)
SELLERS = [
    ("Тест Продавец", "+79990000001", True),
    ("Аня", "+79990000010", False),
    ("Марина", "+79990000011", False),
    ("Ольга", "+79990000012", False),
    ("Ника", "+79990000013", False),
    ("Света", "+79990000014", False),
    ("Лера", "+79990000015", False),
]

# (size, freshness, price_kopecks, name)
BOUQUETS = [
    ("M", "today", 450000, "Пионы и эвкалипт"),
    ("L", "today", 690000, "Кустовые розы"),
    ("S", "d1_2", 290000, "Ромашки полевые"),
    ("M", "today", 520000, "Тюльпаны микс"),
    ("L", "d1_2", 740000, "Гортензия и лизиантус"),
    ("M", "d3_plus", 350000, "Хризантемы"),
    ("S", "today", 320000, "Букет невесты мини"),
    ("XL", "today", 980000, "Большой микс, 51 шт"),
]
FRESH_SCORE = {"today": 0.95, "d1_2": 0.6, "d3_plus": 0.3}


def make_image(name: str, size: str, palette: tuple) -> Image.Image:
    bg, c1, c2 = palette
    width, height = 1600, 2000
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)
    for _ in range(7):
        x = rnd.randint(560, 1040)
        draw.line([(x, 1300), (800, 1860)], fill=(120, 150, 110), width=14)
    centers = [(800, 760), (560, 900), (1040, 900), (660, 1140), (940, 1140), (800, 1000)]
    for cx, cy in centers:
        col = c1 if rnd.random() < 0.6 else c2
        radius = rnd.randint(150, 230)
        for angle in range(0, 360, 45):
            px = cx + int(radius * 0.6 * math.cos(math.radians(angle)))
            py = cy + int(radius * 0.6 * math.sin(math.radians(angle)))
            draw.ellipse(
                [px - radius // 2, py - radius // 2, px + radius // 2, py + radius // 2], fill=col
            )
        draw.ellipse(
            [cx - radius // 3, cy - radius // 3, cx + radius // 3, cy + radius // 3], fill=c2
        )
    draw.rectangle([0, 1880, width, height], fill=(255, 255, 255))
    draw.text((60, 1915), f"{name}  -  {size}", fill=(60, 54, 46))
    return img


def variant_bytes(img: Image.Image) -> dict[str, bytes]:
    out: dict[str, bytes] = {}
    for name, target_w in VARIANT_WIDTH.items():
        target_h = int(img.height * target_w / img.width)
        resized = img.resize((target_w, target_h), Image.LANCZOS)
        buffer = io.BytesIO()
        resized.save(buffer, format="WEBP", quality=82)
        out[name] = buffer.getvalue()
    return out


def write_variants(photo_id: str, variants: dict[str, bytes]) -> dict[str, str]:
    urls: dict[str, str] = {}
    for name, data in variants.items():
        path = PHOTO_DIR / "photos" / photo_id / f"{name}.webp"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        urls[name] = f"{CDN}/photos/{photo_id}/{name}.webp"
    return urls


def main() -> None:
    engine = create_engine(DB_URL, future=True)
    new_users = new_listings = 0
    bouquet_idx = 0
    with engine.begin() as cx:
        for name, phone, is_owner in SELLERS:
            row = cx.execute(text("SELECT id FROM users WHERE phone = :p"), {"p": phone}).first()
            if row:
                user_id = str(row[0])
                print(f"user exists: {name} {phone} -> {user_id}")
            else:
                user_id = str(uuid.uuid4())
                cx.execute(
                    text(
                        "INSERT INTO users (id, phone, display_name, city_id, roles, status) "
                        "VALUES (:id, :phone, :dn, :city, :roles, 'active')"
                    ),
                    {
                        "id": user_id,
                        "phone": phone,
                        "dn": name,
                        "city": CITY,
                        "roles": ["buyer", "seller"],
                    },
                )
                new_users += 1
                print(f"created user: {name} {phone} -> {user_id}")
            if is_owner:
                continue
            active = cx.execute(
                text("SELECT count(*) FROM listings WHERE seller_id = :s AND status = 'active'"),
                {"s": user_id},
            ).scalar_one()
            for _ in range(LISTINGS_PER_SELLER - int(active)):
                size, fresh, price, bname = BOUQUETS[bouquet_idx % len(BOUQUETS)]
                bouquet_idx += 1
                listing_id = str(uuid.uuid4())
                photo_id = str(uuid.uuid4())
                palette = PALETTES[rnd.randrange(len(PALETTES))]
                urls = write_variants(photo_id, variant_bytes(make_image(bname, size, palette)))
                cx.execute(
                    text(
                        "INSERT INTO listings (id, seller_id, size, freshness, price_kopecks, "
                        "city_id, status, like_count, freshness_score, expires_at, geo_coarse) "
                        "VALUES (:id, :sid, :size, :fr, :price, :city, 'active', :likes, :fs, "
                        ":exp, :geo)"
                    ),
                    {
                        "id": listing_id,
                        "sid": user_id,
                        "size": size,
                        "fr": fresh,
                        "price": price,
                        "city": CITY,
                        "likes": rnd.randint(0, 40),
                        "fs": FRESH_SCORE[fresh],
                        "exp": datetime.now(UTC) + timedelta(days=7),
                        "geo": "Москва, рядом с метро",
                    },
                )
                cx.execute(
                    text(
                        "INSERT INTO photos (id, owner_id, listing_id, object_key, content_type, "
                        "variants, exif_stripped, moderation_status) "
                        "VALUES (:id, :oid, :lid, :ok, 'image/webp', "
                        "CAST(:variants AS json), true, 'approved')"
                    ),
                    {
                        "id": photo_id,
                        "oid": user_id,
                        "lid": listing_id,
                        "ok": f"photos/{photo_id}/card.webp",
                        "variants": json.dumps(urls),
                    },
                )
                new_listings += 1
                print(f"  listing {bname} ({size}/{fresh}) {price // 100} RUB -> {listing_id}")
    print(f"DONE: +{new_users} users, +{new_listings} active listings in {CITY}")


if __name__ == "__main__":
    main()
