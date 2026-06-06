"""Demo / staging seed — reviews + seller ratings for the Moscow demo sellers.

For each demo seller (seeded by seed_demo.py) creates a spread of completed deals
with reviews so the seller picks up a realistic, VARIED rating — some excellent,
some poor. Each review needs its own `done` deal (reviews are UNIQUE per
deal+author and FK to deals), so per review we mint: a throwaway `sold` listing
(keeps the seller's 2 active ones untouched), a `done` deal with a pooled buyer,
and the review; then we recompute users.seller_rating = avg(visible scores)
exactly like the app's reviews repo does.

Idempotent: a seller that already has reviews is skipped. Run via stdin into the
api container (DATABASE_URL is set there):

    C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
    $C exec -T api python - < backend/scripts/seed_reviews.py
"""

from __future__ import annotations

import os
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import create_engine, text

DB_URL = os.environ["DATABASE_URL"]
CITY = "msk"
engine = create_engine(DB_URL, future=True)

# Pooled review authors (buyers). Distinct from sellers so author != target.
BUYERS = [
    ("Игорь", "+79992000001"),
    ("Дмитрий", "+79992000002"),
    ("Алексей", "+79992000003"),
    ("Сергей", "+79992000004"),
    ("Павел", "+79992000005"),
    ("Антон", "+79992000006"),
    ("Кирилл", "+79992000007"),
    ("Роман", "+79992000008"),
]

# Seller phone -> list of review scores (the spread drives the rating).
PROFILES = {
    "+79990000015": [5, 5, 5],  # Лера   — 5.00 идеально
    "+79990000010": [5, 5, 4, 5, 5],  # Аня    — 4.80 отлично
    "+79990000011": [5, 4, 5, 4],  # Марина — 4.50 хорошо
    "+79990000012": [4, 3, 5, 2, 4],  # Ольга  — 3.60 средне
    "+79990000013": [2, 1, 3, 2],  # Ника   — 2.00 плохо
    "+79990000014": [1, 2, 1],  # Света  — 1.33 очень плохо
}

TEXTS = {
    5: [
        "Букет свежий, как на фото. Продавец на связи, встретились у метро — всё за пять минут.",
        "Шикарные цветы, простояли почти неделю. Очень довольна, спасибо!",
        "Всё честно: оплатила при встрече, когда увидела букет. Рекомендую продавца.",
    ],
    4: [
        "Хороший букет, чуть меньше, чем ожидала, но свежий. В целом рекомендую.",
        "Цветы приятные, встреча прошла нормально. Небольшая задержка, но не критично.",
    ],
    3: [
        "Нормально. Часть цветов уже подвяла, но за такую цену терпимо.",
        "Средне: букет ок, но продавец опоздал минут на двадцать.",
    ],
    2: [
        "Букет выглядел заметно хуже, чем на фото. Долго ждала на встрече.",
        "Так себе: цветы несвежие, пришлось торговаться уже на месте.",
    ],
    1: [
        "Не советую: цветы вялые, продавец опоздал на час и был груб.",
        "Плохо. Букет совсем не такой, как на фотографии. Зря потратила время.",
    ],
}


def main() -> None:
    new_reviews = 0
    text_idx = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    with engine.begin() as cx:
        # 1) buyer pool (idempotent by phone)
        buyer_ids: list[str] = []
        for name, phone in BUYERS:
            row = cx.execute(text("SELECT id FROM users WHERE phone = :p"), {"p": phone}).first()
            if row:
                buyer_ids.append(str(row[0]))
                continue
            bid = str(uuid.uuid4())
            cx.execute(
                text(
                    "INSERT INTO users (id, phone, display_name, city_id, roles, status) "
                    "VALUES (:id, :phone, :dn, :city, :roles, 'active')"
                ),
                {"id": bid, "phone": phone, "dn": name, "city": CITY, "roles": ["buyer"]},
            )
            buyer_ids.append(bid)

        # 2) reviews per seller
        bi = 0
        for phone, scores in PROFILES.items():
            srow = cx.execute(
                text("SELECT id, display_name FROM users WHERE phone = :p"), {"p": phone}
            ).first()
            if srow is None:
                print(f"seller missing (run seed_demo first): {phone}")
                continue
            seller_id, seller_name = str(srow[0]), srow[1]
            already = cx.execute(
                text("SELECT count(*) FROM reviews WHERE target_id = :s"), {"s": seller_id}
            ).scalar_one()
            if already:
                print(f"reviews exist, skip: {seller_name} ({already})")
                continue
            for score in scores:
                buyer_id = buyer_ids[bi % len(buyer_ids)]
                bi += 1
                price = 290000 + score * 40000
                listing_id = str(uuid.uuid4())
                deal_id = str(uuid.uuid4())
                cx.execute(
                    text(
                        "INSERT INTO listings (id, seller_id, size, freshness, price_kopecks, "
                        "city_id, status, like_count, freshness_score, expires_at) VALUES "
                        "(:id, :sid, 'M', 'today', :price, :city, 'sold', 0, 0, :exp)"
                    ),
                    {
                        "id": listing_id,
                        "sid": seller_id,
                        "price": price,
                        "city": CITY,
                        "exp": datetime.now(UTC) - timedelta(days=3),
                    },
                )
                cx.execute(
                    text(
                        "INSERT INTO deals (id, listing_id, buyer_id, seller_id, amount_kopecks, "
                        "commission_kopecks, status, delivery_method, released_at) VALUES "
                        "(:id, :lid, :bid, :sid, :amt, 0, 'done', 'self_pickup', :ts)"
                    ),
                    {
                        "id": deal_id,
                        "lid": listing_id,
                        "bid": buyer_id,
                        "sid": seller_id,
                        "amt": price,
                        "ts": datetime.now(UTC) - timedelta(days=2),
                    },
                )
                body = TEXTS[score][text_idx[score] % len(TEXTS[score])]
                text_idx[score] += 1
                cx.execute(
                    text(
                        "INSERT INTO reviews (id, deal_id, author_id, target_id, score, text, "
                        "moderation_status) VALUES (:id, :did, :aid, :tid, :sc, :tx, 'visible')"
                    ),
                    {
                        "id": str(uuid.uuid4()),
                        "did": deal_id,
                        "aid": buyer_id,
                        "tid": seller_id,
                        "sc": score,
                        "tx": body,
                    },
                )
                new_reviews += 1
            # recompute stored rating exactly like reviews_repo._recompute_seller_rating
            cx.execute(
                text(
                    "UPDATE users SET seller_rating = ("
                    "  SELECT round(avg(score), 2) FROM reviews "
                    "  WHERE target_id = :s AND moderation_status = 'visible'"
                    ") WHERE id = :s"
                ),
                {"s": seller_id},
            )
            print(f"seeded {seller_name}: {len(scores)} reviews {scores}")

        # 3) report
        rows = cx.execute(
            text(
                "SELECT u.display_name, u.phone, u.seller_rating, "
                "  count(r.id) FILTER (WHERE r.moderation_status='visible') AS n, "
                "  string_agg(r.score::text, '' ORDER BY r.score DESC) AS scores "
                "FROM users u LEFT JOIN reviews r ON r.target_id = u.id "
                "WHERE u.phone LIKE '+7999000001%' OR u.phone = '+79990000001' "
                "GROUP BY u.id, u.display_name, u.phone, u.seller_rating "
                "ORDER BY u.seller_rating DESC NULLS LAST"
            )
        ).all()
    print(f"\nDONE: +{new_reviews} reviews\n")
    print(f"{'Продавец':<16}{'Телефон':<15}{'Рейтинг':<9}{'Отзывов':<9}Оценки")
    print("-" * 62)
    for dn, ph, rating, n, scores in rows:
        stars = f"{float(rating):.2f}" if rating is not None else "—"
        dist = "/".join(str(s) for s in sorted(scores or "", reverse=True)) if scores else "—"
        print(f"{(dn or '?'):<16}{ph:<15}{stars:<9}{n:<9}{dist}")


if __name__ == "__main__":
    main()
