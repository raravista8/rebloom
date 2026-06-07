"""Metro reference data — lines + stations for cities that have a metro (msk, spb).

Pure core data (no infrastructure imports): the dict below IS the source of truth.
A listing's pickup landmark is its nearest metro station (the «главный ориентир»
in cities with a metro); cities without a metro fall back to the район (geo_coarse).

This is a **curated launch starter set**, not an exhaustive map: the well-known
stations + every named transfer hub (Киевская, Курская, Парк культуры,
Комсомольская, …). Transfer stations carry multiple ``line_ids`` and render as
multiple coloured dots. It is expandable — add rows to ``STATIONS``; callers read
through the helpers below.

# [verify exact hex] line colours are the well-known official radial/ring values
# (Московский / Петербургский метрополитен brand palette) — accurate to the eye,
# but confirm the exact brand hex before any pixel-critical use.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class MetroLine:
    id: str
    name: str
    color: str  # official line colour, hex (#RRGGBB)


@dataclass(frozen=True, slots=True)
class MetroStation:
    id: str
    name: str
    city_id: str
    line_ids: tuple[str, ...]  # >1 = transfer hub (multi-colour)


# --- Lines -----------------------------------------------------------------

# Moscow: 1–14 radial/ring lines + БКЛ (Большая кольцевая, line 11). The classic
# ring is line 5 (Кольцевая). Line 14 is the МЦК (overground ring, white/red).
_MSK_LINES: tuple[MetroLine, ...] = (
    MetroLine("msk-1", "Сокольническая", "#D41317"),
    MetroLine("msk-2", "Замоскворецкая", "#48B85E"),
    MetroLine("msk-3", "Арбатско-Покровская", "#0078BE"),
    MetroLine("msk-4", "Филёвская", "#19C1F3"),
    MetroLine("msk-5", "Кольцевая", "#894E35"),
    MetroLine("msk-6", "Калужско-Рижская", "#F58220"),
    MetroLine("msk-7", "Таганско-Краснопресненская", "#943D90"),
    MetroLine("msk-8", "Калининская", "#FFCB31"),
    MetroLine("msk-9", "Серпуховско-Тимирязевская", "#9A9C9F"),
    MetroLine("msk-10", "Люблинско-Дмитровская", "#B3D445"),
    MetroLine("msk-11", "Большая кольцевая", "#79CDCD"),
    MetroLine("msk-12", "Солнцевская", "#FFCB31"),
    MetroLine("msk-13", "Некрасовская", "#DE64A1"),
    MetroLine("msk-14", "МЦК", "#FF7F00"),
    MetroLine("msk-15", "Бутовская", "#A1B3D4"),
)

# St-Petersburg: 5 lines.
_SPB_LINES: tuple[MetroLine, ...] = (
    MetroLine("spb-1", "Кировско-Выборгская", "#D6083B"),
    MetroLine("spb-2", "Московско-Петроградская", "#0078C9"),
    MetroLine("spb-3", "Невско-Василеостровская", "#009A49"),
    MetroLine("spb-4", "Правобережная", "#F58220"),
    MetroLine("spb-5", "Фрунзенско-Приморская", "#702082"),
)

LINES: dict[str, MetroLine] = {line.id: line for line in (*_MSK_LINES, *_SPB_LINES)}


# --- Stations --------------------------------------------------------------
# Curated starter set. Transfer hubs list every line that touches them so the
# card can render a coloured dot per line.

_MSK_STATIONS: tuple[MetroStation, ...] = (
    # line 1 — Сокольническая
    MetroStation("msk-sokolniki", "Сокольники", "msk", ("msk-1",)),
    MetroStation("msk-krasnye-vorota", "Красные Ворота", "msk", ("msk-1",)),
    MetroStation("msk-chistye-prudy", "Чистые пруды", "msk", ("msk-1",)),
    MetroStation("msk-lubyanka", "Лубянка", "msk", ("msk-1",)),
    MetroStation("msk-okhotny-ryad", "Охотный Ряд", "msk", ("msk-1",)),
    MetroStation("msk-vorobyovy-gory", "Воробьёвы горы", "msk", ("msk-1",)),
    MetroStation("msk-universitet", "Университет", "msk", ("msk-1",)),
    # line 2 — Замоскворецкая
    MetroStation("msk-mayakovskaya", "Маяковская", "msk", ("msk-2",)),
    MetroStation("msk-avtozavodskaya", "Автозаводская", "msk", ("msk-2",)),
    MetroStation("msk-aeroport", "Аэропорт", "msk", ("msk-2",)),
    MetroStation("msk-sokol", "Сокол", "msk", ("msk-2",)),
    # line 3 — Арбатско-Покровская
    MetroStation("msk-izmaylovskaya", "Измайловская", "msk", ("msk-3",)),
    MetroStation("msk-semyonovskaya", "Семёновская", "msk", ("msk-3",)),
    MetroStation("msk-baumanskaya", "Бауманская", "msk", ("msk-3",)),
    # line 4 — Филёвская
    MetroStation("msk-fili", "Фили", "msk", ("msk-4",)),
    MetroStation("msk-bagrationovskaya", "Багратионовская", "msk", ("msk-4",)),
    # line 6 — Калужско-Рижская
    MetroStation("msk-vdnkh", "ВДНХ", "msk", ("msk-6",)),
    MetroStation("msk-alekseevskaya", "Алексеевская", "msk", ("msk-6",)),
    MetroStation("msk-akademicheskaya", "Академическая", "msk", ("msk-6",)),
    MetroStation("msk-novye-cheryomushki", "Новые Черёмушки", "msk", ("msk-6",)),
    # line 7 — Таганско-Краснопресненская
    MetroStation("msk-vykhino", "Выхино", "msk", ("msk-7",)),
    MetroStation("msk-1905-goda", "Улица 1905 года", "msk", ("msk-7",)),
    MetroStation("msk-shchukinskaya", "Щукинская", "msk", ("msk-7",)),
    # line 8 — Калининская
    MetroStation("msk-novogireevo", "Новогиреево", "msk", ("msk-8",)),
    MetroStation("msk-aviamotornaya", "Авиамоторная", "msk", ("msk-8", "msk-14")),
    # line 9 — Серпуховско-Тимирязевская
    MetroStation("msk-otradnoe", "Отрадное", "msk", ("msk-9",)),
    MetroStation("msk-timiryazevskaya", "Тимирязевская", "msk", ("msk-9",)),
    MetroStation("msk-nagatinskaya", "Нагатинская", "msk", ("msk-9",)),
    # line 10 — Люблинско-Дмитровская
    MetroStation("msk-maryina-roshcha", "Марьина Роща", "msk", ("msk-10", "msk-11")),
    MetroStation("msk-dubrovka", "Дубровка", "msk", ("msk-10",)),
    MetroStation("msk-lyublino", "Люблино", "msk", ("msk-10",)),
    # line 12 — Солнцевская
    MetroStation("msk-ramenki", "Раменки", "msk", ("msk-12",)),
    MetroStation("msk-solntsevo", "Солнцево", "msk", ("msk-12",)),
    # line 13 — Некрасовская
    MetroStation("msk-kosino", "Косино", "msk", ("msk-13",)),
    MetroStation("msk-nekrasovka", "Некрасовка", "msk", ("msk-13",)),
    # line 15 — Бутовская
    MetroStation("msk-buninskaya-alleya", "Бунинская аллея", "msk", ("msk-15",)),
    # --- transfer hubs (multi-line) ---
    MetroStation("msk-kievskaya", "Киевская", "msk", ("msk-3", "msk-4", "msk-5")),
    MetroStation("msk-kurskaya", "Курская", "msk", ("msk-3", "msk-5", "msk-8")),
    MetroStation("msk-park-kultury", "Парк культуры", "msk", ("msk-1", "msk-5")),
    MetroStation("msk-komsomolskaya", "Комсомольская", "msk", ("msk-1", "msk-5")),
    MetroStation("msk-belorusskaya", "Белорусская", "msk", ("msk-2", "msk-5")),
    MetroStation("msk-novoslobodskaya", "Новослободская", "msk", ("msk-5", "msk-10")),
    MetroStation("msk-prospekt-mira", "Проспект Мира", "msk", ("msk-5", "msk-6")),
    MetroStation("msk-taganskaya", "Таганская", "msk", ("msk-5", "msk-7", "msk-10")),
    MetroStation("msk-oktyabrskaya", "Октябрьская", "msk", ("msk-5", "msk-6")),
    MetroStation("msk-paveletskaya", "Павелецкая", "msk", ("msk-2", "msk-5")),
    MetroStation("msk-dobryninskaya", "Добрынинская", "msk", ("msk-5", "msk-9")),
    MetroStation("msk-teatralnaya", "Театральная", "msk", ("msk-1", "msk-2", "msk-3")),
    MetroStation("msk-tverskaya", "Тверская", "msk", ("msk-2", "msk-7")),
    MetroStation("msk-pushkinskaya", "Пушкинская", "msk", ("msk-7", "msk-9")),
    MetroStation("msk-chekhovskaya", "Чеховская", "msk", ("msk-9", "msk-7")),
    MetroStation(
        "msk-biblioteka-lenina",
        "Библиотека имени Ленина",
        "msk",
        ("msk-1", "msk-3", "msk-4", "msk-9"),
    ),
    MetroStation("msk-arbatskaya", "Арбатская", "msk", ("msk-3", "msk-4")),
    MetroStation("msk-tretyakovskaya", "Третьяковская", "msk", ("msk-6", "msk-8")),
    MetroStation("msk-china-town", "Китай-город", "msk", ("msk-6", "msk-7")),
    MetroStation("msk-savyolovskaya", "Савёловская", "msk", ("msk-9", "msk-11")),
    MetroStation("msk-delovoy-tsentr", "Деловой центр", "msk", ("msk-11", "msk-12")),
    MetroStation("msk-petrovsky-park", "Петровский парк", "msk", ("msk-11", "msk-2")),
    MetroStation("msk-elektrozavodskaya", "Электрозаводская", "msk", ("msk-3", "msk-11")),
)

_SPB_STATIONS: tuple[MetroStation, ...] = (
    # line 1 — Кировско-Выборгская
    MetroStation("spb-deviatkino", "Девяткино", "spb", ("spb-1",)),
    MetroStation("spb-ploshchad-lenina", "Площадь Ленина", "spb", ("spb-1",)),
    MetroStation("spb-chernyshevskaya", "Чернышевская", "spb", ("spb-1",)),
    MetroStation("spb-kirovsky-zavod", "Кировский завод", "spb", ("spb-1",)),
    MetroStation("spb-avtovo", "Автово", "spb", ("spb-1",)),
    MetroStation("spb-prospekt-veteranov", "Проспект Ветеранов", "spb", ("spb-1",)),
    # line 2 — Московско-Петроградская
    MetroStation("spb-prospekt-prosvescheniya", "Проспект Просвещения", "spb", ("spb-2",)),
    MetroStation("spb-petrogradskaya", "Петроградская", "spb", ("spb-2",)),
    MetroStation("spb-frunzenskaya", "Фрунзенская", "spb", ("spb-2",)),
    MetroStation("spb-moskovskaya", "Московская", "spb", ("spb-2",)),
    # line 3 — Невско-Василеостровская
    MetroStation("spb-vasileostrovskaya", "Василеостровская", "spb", ("spb-3",)),
    MetroStation("spb-elizarovskaya", "Елизаровская", "spb", ("spb-3",)),
    MetroStation("spb-lomonosovskaya", "Ломоносовская", "spb", ("spb-3",)),
    MetroStation("spb-primorskaya", "Приморская", "spb", ("spb-3",)),
    MetroStation("spb-begovaya", "Беговая", "spb", ("spb-3",)),
    # line 4 — Правобережная
    MetroStation("spb-novocherkasskaya", "Новочеркасская", "spb", ("spb-4",)),
    MetroStation("spb-ladozhskaya", "Ладожская", "spb", ("spb-4",)),
    MetroStation("spb-prospekt-bolshevikov", "Проспект Большевиков", "spb", ("spb-4",)),
    # line 5 — Фрунзенско-Приморская
    MetroStation("spb-komendantsky-prospekt", "Комендантский проспект", "spb", ("spb-5",)),
    MetroStation("spb-krestovsky-ostrov", "Крестовский остров", "spb", ("spb-5",)),
    MetroStation("spb-mezhdunarodnaya", "Международная", "spb", ("spb-5",)),
    MetroStation("spb-shushary", "Шушары", "spb", ("spb-5",)),
    # --- transfer hubs (multi-line) ---
    MetroStation("spb-ploshchad-vosstaniya", "Площадь Восстания", "spb", ("spb-1", "spb-3")),
    MetroStation("spb-vladimirskaya", "Владимирская", "spb", ("spb-1", "spb-5")),
    MetroStation(
        "spb-tekhnologichesky-institut", "Технологический институт", "spb", ("spb-1", "spb-2")
    ),
    MetroStation("spb-gostiny-dvor", "Гостиный двор", "spb", ("spb-3", "spb-5")),
    MetroStation("spb-sennaya-ploshchad", "Сенная площадь", "spb", ("spb-2", "spb-4", "spb-5")),
    MetroStation("spb-pushkinskaya", "Пушкинская", "spb", ("spb-1", "spb-5")),
    MetroStation("spb-spasskaya", "Спасская", "spb", ("spb-2", "spb-4", "spb-5")),
    MetroStation("spb-dostoevskaya", "Достоевская", "spb", ("spb-4", "spb-1")),
)

STATIONS: dict[str, MetroStation] = {s.id: s for s in (*_MSK_STATIONS, *_SPB_STATIONS)}


# --- Helpers ---------------------------------------------------------------


def get_station(sid: str) -> MetroStation | None:
    return STATIONS.get(sid)


def is_valid(sid: str) -> bool:
    return sid in STATIONS


def stations_for_city(city_id: str) -> list[MetroStation]:
    return [s for s in STATIONS.values() if s.city_id == city_id]


def resolve(sid: str | None) -> dict[str, object] | None:
    """Render a station for a card/detail: id, name, and one entry per line
    (name + colour) — transfers carry several. ``None`` for unknown/absent ids."""
    if sid is None:
        return None
    station = STATIONS.get(sid)
    if station is None:
        return None
    lines = [
        {"name": LINES[lid].name, "color": LINES[lid].color}
        for lid in station.line_ids
        if lid in LINES
    ]
    return {"id": station.id, "name": station.name, "lines": lines}
