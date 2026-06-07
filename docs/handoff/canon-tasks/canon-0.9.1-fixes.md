# ТЗ для Claude Design — canon 0.9.1: PdCatalog data-driven + два build/copy-фикса

> Заполненный промт по `CLAUDE_DESIGN_PROMPT.md` (§0, §2–§6 — без изменений). Две задачи из
> разбора вендоринга 0.9.0: **(1)** сделать `PdCatalog` потребляемым (data-driven), **(2)** убрать
> висячий экспорт + поправить грамматику в шапке. Источник правды правят ТОЛЬКО в Claude Design
> (`reference/prototypes/` → `src/`), потом экспорт-пакет как обычно. **Файлы — реальные пути в `src/`.**

---

## 1. `PdCatalog` — сделать data-driven (сейчас это демо, web не может его импортить)

**Проблема.** В 0.9.0 `src/catalog/catalog.jsx` `PdCatalog` принимает только `{platform}` и **сам
генерит свои демо-данные** — ни `items`, ни состояния фильтров, ни хендлеров. Поэтому `web/` **не смог
его импортировать** на живой `/catalog` и был вынужден **захэндроллить** ту же `.pdc-*`-разметку поверх
реальных данных (`web/components/catalog/CatalogScreen.tsx` + `CatalogFilters.tsx`). Это нарушает
правило «импортируй canon, не транскрибируй JSX» и плодит дрейф. Визуал у `PdCatalog` правильный —
**нужно параметризовать данные**, разметку/CSS не трогать.

**Стало.** `PdCatalog` — **презентационный** (НЕ фетчит и НЕ генерит данные; всё приходит пропсами).
Контракт пропсов (имена — на ваше усмотрение, смысл фиксирован):

| Проп | Тип | Назначение |
|---|---|---|
| `items` | `Card[]` | карточки букетов текущей страницы (или render-prop для карточки) |
| `state` | `'loading'\|'loaded'\|'empty'\|'no-results'\|'loading-more'\|'end'\|'error'\|'offline'` | состояние коллекции (`INTERACTION_STATES §4`) — рисуем skeleton/empty/no-results/стоп-маркер/ретрай |
| `total` | `number` | счётчик под фильтры → кнопка **«Показать N букетов»** |
| `filters` + `onFiltersChange` | `{ metro:string[], flowers:string[], size?, freshness?, priceMin?, priceMax?, sort }` + `(next)=>void` | состояние фильтров наружу; компонент не держит истину |
| `stations` | `{id,name,lines:[{name,color}]}[]` | список станций для метро-пикера — **web подаёт живой список** (из `/api/geo/metro`), компонент НЕ хардкодит свой |
| `flowers` | `{id,label}[]` | список типов цветов для фильтра |
| `city` + `onCityChange` | `string` + `(id)=>void` | город (скоуп) |
| `onLoadMore` | `()=>void` | догрузка (курсор) — для `loading-more`/`end` |
| `onCardClick`/`cardHref` | — | переход на карточку (web даёт роут `/l/{id}`) |
| `onRetry` | `()=>void` | для `error`/`offline` |
| `header` | slot/проп | чтобы web вставил свою auth-aware `PdWebNav` (см. ниже), а не статичную |

**Важно про метро/цветы:** id-ы станций и типов цветов — **стабильные backend-id** (метро —
`/api/geo/metro`, цветы — фиксированный enum `roses…wildflowers`). Пикер показывает имя, но в
`filters.metro`/`filters.flowers` кладёт **id** (а не RU-имя). Сейчас `PdMetroPicker`/`PdFlowerPicker`
отдают имена/лейблы и список метро у них свой (меньше, чем 87 в бэке) — в data-driven варианте список
приходит пропсом `stations`/`flowers`, а наружу идут id.

**Приёмка #1:** `web/` удаляет `components/catalog/CatalogScreen.tsx` + `CatalogFilters.tsx` и рендерит
`<PdCatalog items=… state=… total=… filters=… onFiltersChange=… stations=… onLoadMore=… />` напрямую;
визуал ≤2% к 0.9.0; все состояния коллекции рисуются из `state`.

> То же правило для будущих экранов: **любой canon-экран, который должен показывать реальные данные,
> обязан быть data-driven (пропсы), а не демо-с-собственными-данными** — иначе он не импортируется.

---

## 2. Два мелких фикса в источнике (0.9.0 приехал с ними; я обошёл их consumer-side, но правьте в src)

### 2a. Висячий экспорт `PaymentFailed` ломает сборку
`src/entries/deal.jsx` строка 3 ре-экспортит `PaymentFailed` из `../screens/deal-notifications`, но
экран **`PaymentFailed` удалён** в no-escrow-пассе (ADR-0013) — его больше нет в
`deal-notifications.jsx`. → `tsup` падает: `No matching export … PaymentFailed`. Я убрал его из экспорта
руками, чтобы собрать пакет (как с периодически сбрасываемым build-config). **Стало:** убрать
`PaymentFailed` из строки экспорта `entries/deal.jsx` (оставить `DealActive, DealProblem, DealDone, ReviewForm`).

### 2b. Грамматика города в поиске `PdWebNav`
`src/primitives/web-nav.jsx`: плейсхолдер поиска рендерит город в **именительном** —
«Поиск свежих букетов в **Москва**». Должно быть в предложном — «в **Москве**». Причина: один проп
`city` используется и для кнопки-города (там именительный верный), и для плейсхолдера поиска (нужен
предложный). **Стало (выбрать):** либо отдельный проп `cityLoc`/`cityPrepositional` для плейсхолдера
(web прокинет `cityPrepositional(city)`), либо нейтральный текст «Поиск свежих букетов» без города.

**Приёмка #2:** пакет собирается `npm run build` без правки `entries/deal.jsx` руками; в шапке —
«…в Москве» (или нейтрально).

---

## Упаковка / DoD
Полный экспорт (`src/` + `dist/canon.css` + tokens + `CHANGELOG`) по `CLAUDE_DESIGN_PROMPT §3`; JS-бандлы
собирает потребитель. No-escrow (ADR-0013), без точек в заголовках. После вендоринга web заменит
хэндролл-каталог импортом `PdCatalog` и снимет consumer-side build-fix `entries/deal.jsx`.
