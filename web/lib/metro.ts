// Metro station catalog — MIRRORS backend/app/core/geo/metro.py (the authoritative
// catalog the API validates `metro_station_id` against, and that /api/search filters by).
// Each station: stable backend id + RU name + one entry per line (name + official colour;
// transfer hubs carry several). The picker shows the name, but EMITS the id — so the form
// and the search filter send backend-valid ids. canon's PdMetroPicker is hardwired to its
// own (smaller, name-keyed) PD_METRO list, so it can't produce these ids — we render the
// same canon `.pd-mpick*` markup over this catalog instead (compose-over-canon-CSS,
// CANON_PACKAGE_TZ §10). If this drifts from the backend, refresh from metro.py.
//
// Cities with a metro (msk, spb). No-metro cities → the район text fallback.

export interface MetroLine {
  name: string;
  color: string;
}
export interface MetroStation {
  id: string;
  name: string;
  lines: MetroLine[];
}

export const CITY_METRO_KEY: Record<string, 'msk' | 'spb'> = { msk: 'msk', spb: 'spb' };

export const METRO_STATIONS: Record<'msk' | 'spb', MetroStation[]> = {
  msk: [
  { id: "msk-sokolniki", name: "Сокольники", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-krasnye-vorota", name: "Красные Ворота", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-chistye-prudy", name: "Чистые пруды", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-lubyanka", name: "Лубянка", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-okhotny-ryad", name: "Охотный Ряд", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-vorobyovy-gory", name: "Воробьёвы горы", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-universitet", name: "Университет", lines: [{ name: "Сокольническая", color: "#D41317" }] },
  { id: "msk-mayakovskaya", name: "Маяковская", lines: [{ name: "Замоскворецкая", color: "#48B85E" }] },
  { id: "msk-avtozavodskaya", name: "Автозаводская", lines: [{ name: "Замоскворецкая", color: "#48B85E" }] },
  { id: "msk-aeroport", name: "Аэропорт", lines: [{ name: "Замоскворецкая", color: "#48B85E" }] },
  { id: "msk-sokol", name: "Сокол", lines: [{ name: "Замоскворецкая", color: "#48B85E" }] },
  { id: "msk-izmaylovskaya", name: "Измайловская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }] },
  { id: "msk-semyonovskaya", name: "Семёновская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }] },
  { id: "msk-baumanskaya", name: "Бауманская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }] },
  { id: "msk-fili", name: "Фили", lines: [{ name: "Филёвская", color: "#19C1F3" }] },
  { id: "msk-bagrationovskaya", name: "Багратионовская", lines: [{ name: "Филёвская", color: "#19C1F3" }] },
  { id: "msk-vdnkh", name: "ВДНХ", lines: [{ name: "Калужско-Рижская", color: "#F58220" }] },
  { id: "msk-alekseevskaya", name: "Алексеевская", lines: [{ name: "Калужско-Рижская", color: "#F58220" }] },
  { id: "msk-akademicheskaya", name: "Академическая", lines: [{ name: "Калужско-Рижская", color: "#F58220" }] },
  { id: "msk-novye-cheryomushki", name: "Новые Черёмушки", lines: [{ name: "Калужско-Рижская", color: "#F58220" }] },
  { id: "msk-vykhino", name: "Выхино", lines: [{ name: "Таганско-Краснопресненская", color: "#943D90" }] },
  { id: "msk-1905-goda", name: "Улица 1905 года", lines: [{ name: "Таганско-Краснопресненская", color: "#943D90" }] },
  { id: "msk-shchukinskaya", name: "Щукинская", lines: [{ name: "Таганско-Краснопресненская", color: "#943D90" }] },
  { id: "msk-novogireevo", name: "Новогиреево", lines: [{ name: "Калининская", color: "#FFCB31" }] },
  { id: "msk-aviamotornaya", name: "Авиамоторная", lines: [{ name: "Калининская", color: "#FFCB31" }, { name: "МЦК", color: "#FF7F00" }] },
  { id: "msk-otradnoe", name: "Отрадное", lines: [{ name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }] },
  { id: "msk-timiryazevskaya", name: "Тимирязевская", lines: [{ name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }] },
  { id: "msk-nagatinskaya", name: "Нагатинская", lines: [{ name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }] },
  { id: "msk-maryina-roshcha", name: "Марьина Роща", lines: [{ name: "Люблинско-Дмитровская", color: "#B3D445" }, { name: "Большая кольцевая", color: "#79CDCD" }] },
  { id: "msk-dubrovka", name: "Дубровка", lines: [{ name: "Люблинско-Дмитровская", color: "#B3D445" }] },
  { id: "msk-lyublino", name: "Люблино", lines: [{ name: "Люблинско-Дмитровская", color: "#B3D445" }] },
  { id: "msk-ramenki", name: "Раменки", lines: [{ name: "Солнцевская", color: "#FFCB31" }] },
  { id: "msk-solntsevo", name: "Солнцево", lines: [{ name: "Солнцевская", color: "#FFCB31" }] },
  { id: "msk-kosino", name: "Косино", lines: [{ name: "Некрасовская", color: "#DE64A1" }] },
  { id: "msk-nekrasovka", name: "Некрасовка", lines: [{ name: "Некрасовская", color: "#DE64A1" }] },
  { id: "msk-buninskaya-alleya", name: "Бунинская аллея", lines: [{ name: "Бутовская", color: "#A1B3D4" }] },
  { id: "msk-kievskaya", name: "Киевская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }, { name: "Филёвская", color: "#19C1F3" }, { name: "Кольцевая", color: "#894E35" }] },
  { id: "msk-kurskaya", name: "Курская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }, { name: "Кольцевая", color: "#894E35" }, { name: "Калининская", color: "#FFCB31" }] },
  { id: "msk-park-kultury", name: "Парк культуры", lines: [{ name: "Сокольническая", color: "#D41317" }, { name: "Кольцевая", color: "#894E35" }] },
  { id: "msk-komsomolskaya", name: "Комсомольская", lines: [{ name: "Сокольническая", color: "#D41317" }, { name: "Кольцевая", color: "#894E35" }] },
  { id: "msk-belorusskaya", name: "Белорусская", lines: [{ name: "Замоскворецкая", color: "#48B85E" }, { name: "Кольцевая", color: "#894E35" }] },
  { id: "msk-novoslobodskaya", name: "Новослободская", lines: [{ name: "Кольцевая", color: "#894E35" }, { name: "Люблинско-Дмитровская", color: "#B3D445" }] },
  { id: "msk-prospekt-mira", name: "Проспект Мира", lines: [{ name: "Кольцевая", color: "#894E35" }, { name: "Калужско-Рижская", color: "#F58220" }] },
  { id: "msk-taganskaya", name: "Таганская", lines: [{ name: "Кольцевая", color: "#894E35" }, { name: "Таганско-Краснопресненская", color: "#943D90" }, { name: "Люблинско-Дмитровская", color: "#B3D445" }] },
  { id: "msk-oktyabrskaya", name: "Октябрьская", lines: [{ name: "Кольцевая", color: "#894E35" }, { name: "Калужско-Рижская", color: "#F58220" }] },
  { id: "msk-paveletskaya", name: "Павелецкая", lines: [{ name: "Замоскворецкая", color: "#48B85E" }, { name: "Кольцевая", color: "#894E35" }] },
  { id: "msk-dobryninskaya", name: "Добрынинская", lines: [{ name: "Кольцевая", color: "#894E35" }, { name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }] },
  { id: "msk-teatralnaya", name: "Театральная", lines: [{ name: "Сокольническая", color: "#D41317" }, { name: "Замоскворецкая", color: "#48B85E" }, { name: "Арбатско-Покровская", color: "#0078BE" }] },
  { id: "msk-tverskaya", name: "Тверская", lines: [{ name: "Замоскворецкая", color: "#48B85E" }, { name: "Таганско-Краснопресненская", color: "#943D90" }] },
  { id: "msk-pushkinskaya", name: "Пушкинская", lines: [{ name: "Таганско-Краснопресненская", color: "#943D90" }, { name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }] },
  { id: "msk-chekhovskaya", name: "Чеховская", lines: [{ name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }, { name: "Таганско-Краснопресненская", color: "#943D90" }] },
  { id: "msk-arbatskaya", name: "Арбатская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }, { name: "Филёвская", color: "#19C1F3" }] },
  { id: "msk-tretyakovskaya", name: "Третьяковская", lines: [{ name: "Калужско-Рижская", color: "#F58220" }, { name: "Калининская", color: "#FFCB31" }] },
  { id: "msk-china-town", name: "Китай-город", lines: [{ name: "Калужско-Рижская", color: "#F58220" }, { name: "Таганско-Краснопресненская", color: "#943D90" }] },
  { id: "msk-savyolovskaya", name: "Савёловская", lines: [{ name: "Серпуховско-Тимирязевская", color: "#9A9C9F" }, { name: "Большая кольцевая", color: "#79CDCD" }] },
  { id: "msk-delovoy-tsentr", name: "Деловой центр", lines: [{ name: "Большая кольцевая", color: "#79CDCD" }, { name: "Солнцевская", color: "#FFCB31" }] },
  { id: "msk-petrovsky-park", name: "Петровский парк", lines: [{ name: "Большая кольцевая", color: "#79CDCD" }, { name: "Замоскворецкая", color: "#48B85E" }] },
  { id: "msk-elektrozavodskaya", name: "Электрозаводская", lines: [{ name: "Арбатско-Покровская", color: "#0078BE" }, { name: "Большая кольцевая", color: "#79CDCD" }] },
  ],
  spb: [
  { id: "spb-deviatkino", name: "Девяткино", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }] },
  { id: "spb-ploshchad-lenina", name: "Площадь Ленина", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }] },
  { id: "spb-chernyshevskaya", name: "Чернышевская", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }] },
  { id: "spb-kirovsky-zavod", name: "Кировский завод", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }] },
  { id: "spb-avtovo", name: "Автово", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }] },
  { id: "spb-prospekt-veteranov", name: "Проспект Ветеранов", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }] },
  { id: "spb-prospekt-prosvescheniya", name: "Проспект Просвещения", lines: [{ name: "Московско-Петроградская", color: "#0078C9" }] },
  { id: "spb-petrogradskaya", name: "Петроградская", lines: [{ name: "Московско-Петроградская", color: "#0078C9" }] },
  { id: "spb-frunzenskaya", name: "Фрунзенская", lines: [{ name: "Московско-Петроградская", color: "#0078C9" }] },
  { id: "spb-moskovskaya", name: "Московская", lines: [{ name: "Московско-Петроградская", color: "#0078C9" }] },
  { id: "spb-vasileostrovskaya", name: "Василеостровская", lines: [{ name: "Невско-Василеостровская", color: "#009A49" }] },
  { id: "spb-elizarovskaya", name: "Елизаровская", lines: [{ name: "Невско-Василеостровская", color: "#009A49" }] },
  { id: "spb-lomonosovskaya", name: "Ломоносовская", lines: [{ name: "Невско-Василеостровская", color: "#009A49" }] },
  { id: "spb-primorskaya", name: "Приморская", lines: [{ name: "Невско-Василеостровская", color: "#009A49" }] },
  { id: "spb-begovaya", name: "Беговая", lines: [{ name: "Невско-Василеостровская", color: "#009A49" }] },
  { id: "spb-novocherkasskaya", name: "Новочеркасская", lines: [{ name: "Правобережная", color: "#F58220" }] },
  { id: "spb-ladozhskaya", name: "Ладожская", lines: [{ name: "Правобережная", color: "#F58220" }] },
  { id: "spb-prospekt-bolshevikov", name: "Проспект Большевиков", lines: [{ name: "Правобережная", color: "#F58220" }] },
  { id: "spb-komendantsky-prospekt", name: "Комендантский проспект", lines: [{ name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-krestovsky-ostrov", name: "Крестовский остров", lines: [{ name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-mezhdunarodnaya", name: "Международная", lines: [{ name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-shushary", name: "Шушары", lines: [{ name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-ploshchad-vosstaniya", name: "Площадь Восстания", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }, { name: "Невско-Василеостровская", color: "#009A49" }] },
  { id: "spb-vladimirskaya", name: "Владимирская", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }, { name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-gostiny-dvor", name: "Гостиный двор", lines: [{ name: "Невско-Василеостровская", color: "#009A49" }, { name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-sennaya-ploshchad", name: "Сенная площадь", lines: [{ name: "Московско-Петроградская", color: "#0078C9" }, { name: "Правобережная", color: "#F58220" }, { name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-pushkinskaya", name: "Пушкинская", lines: [{ name: "Кировско-Выборгская", color: "#D6083B" }, { name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-spasskaya", name: "Спасская", lines: [{ name: "Московско-Петроградская", color: "#0078C9" }, { name: "Правобережная", color: "#F58220" }, { name: "Фрунзенско-Приморская", color: "#702082" }] },
  { id: "spb-dostoevskaya", name: "Достоевская", lines: [{ name: "Правобережная", color: "#F58220" }, { name: "Кировско-Выборгская", color: "#D6083B" }] },
  ],
};

/** Stations for a city_id, or [] when the city has no metro. */
export function stationsForCity(cityId: string): MetroStation[] {
  const key = CITY_METRO_KEY[cityId];
  return key ? METRO_STATIONS[key] : [];
}

const BY_ID = new Map<string, MetroStation>();
for (const list of Object.values(METRO_STATIONS)) for (const s of list) BY_ID.set(s.id, s);

/** Look up a station by backend id (any city). */
export function stationById(id: string): MetroStation | undefined {
  return BY_ID.get(id);
}
