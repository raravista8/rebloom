# CANON HANDOFF — 0.9.1: PdCatalog data-driven + два build/copy-фикса

> Сторона **Claude Design** (прототип-референс). Источник правды — файлы в корне проекта.
> Закрывает ТЗ `uploads/canon-0.9.1-fixes.md`. Сборка `src/`+`dist/`+tsup и вендоринг в `web/` — сторона Claude **Code**.

---

## 1. `PdCatalog` — теперь презентационный (data-driven) ✅

`pd-catalog.jsx` переписан: `PdCatalog` больше **не генерит свои демо-данные**. Это чистый
презентационный компонент — всё приходит пропсами, поэтому `web/` может импортить его напрямую на
живом `/catalog` (а не транскрибировать `.pdc-*`-разметку поверх своих данных). Разметка/CSS
loaded-состояния не тронуты (визуал ≤2% к 0.9.0).

**Контракт пропсов `PdCatalog`:**

| Проп | Тип | Назначение |
|---|---|---|
| `platform` | `'desktop'\|'web'` | хром платформы |
| `items` | `Card[]` | карточки текущей выдачи (страница) |
| `state` | `'loading'\|'loaded'\|'empty'\|'no-results'\|'loading-more'\|'end'\|'error'\|'offline'` | состояние коллекции (INTERACTION_STATES §4) |
| `total` | `number` | счётчик → «Показать N букетов» + «N букетов» |
| `filters` + `onFiltersChange(next)` | `{ metro:string[], flowers:string[], size, freshness, rating, priceMin, priceMax, sort }` | компонент НЕ держит истину фильтров |
| `stations` | `{id,name,lines:[{name,color}]}[]` | живой список метро (web: `/api/geo/metro`); компонент не хардкодит свой |
| `flowers` | `{id,label}[]` | enum типов цветов |
| `city` + `cityLoc` + `onCityChange` | `string` + `string` + `(id)=>void` | город: имен. (кнопка) / предл. (заголовок «в Москве») |
| `onLoadMore()` | — | догрузка курсором (для `loading-more`/`end`) |
| `onCardClick(d)` / `cardHref(d)` | — | переход на карточку (web: `/l/{id}`) |
| `onRetry()` | — | для `error`/`offline` |
| `header` | slot | своя auth-aware шапка (иначе дефолтный `PdWebNav`) |

**id, а не имена.** `filters.metro` / `filters.flowers` хранят **стабильные id** станций/цветов, а
не RU-имена. `PdMetroPicker` дополнен (`pd-kit.jsx`): принимает проп `options` (форма `stations`
`{id,name,lines:[{name,color}]}`) + флаг `idMode` — наружу идут id, в UI показывается имя. Старый
путь (`cityKey` → `window.PD_METRO`, toggle по имени) сохранён байт-в-байт для лендинга/десктоп-форм.
`PdMetroDots` (`pd-feed.jsx`) теперь принимает и lineId, и готовый цвет (`#RRGGBB`).

**Состояния коллекции.** Все 8 состояний рисуются из `state` одной разметкой:
`loading` → skeleton-сетка, `empty` → «город пуст», `no-results` → «смягчите фильтры» (+сброс),
`loading-more` → спиннер под сеткой, `end` → стоп-маркер, `error`/`offline` → заглушка + «Повторить»
(`onRetry`). Новые стили — в `pd-catalog.css` (`.pdc-skel/.pdc-state/.pdc-morestate/.pdc-spin/.pdc-end`),
`prefers-reduced-motion` учтён.

**Демо-обёртка.** `window.PdCatalogDemo` (там же) — НЕканоническая: генерит данные, держит
фильтры/пагинацию/`state` и кормит ими `PdCatalog`. Ею пользуются html-витрины
(`Передарим · Каталог букетов.html`). В `web/` её роль играет реальный `CatalogRoute` (фетч + URL-состояние).

**Приёмка #1:** `web/` удаляет `components/catalog/CatalogScreen.tsx` + `CatalogFilters.tsx` и рендерит
`<PdCatalog items state total filters onFiltersChange stations flowers onLoadMore onRetry />` напрямую.

---

## 2. Два фикса

### 2a. Висячий экспорт `PaymentFailed` — фикс на стороне экспорта (Claude Code)
В прототип-референсе экрана `PaymentFailed` **уже нет** (удалён в no-escrow-пассе, ADR-0013; ни в одном
`pd-scr-*.jsx` его нет). Висячий ре-экспорт живёт только в **сборочном** `src/entries/deal.jsx` пакета
(строка 3). При генерации пакета **0.9.1** строку экспорта привести к:

```js
export { DealActive, DealProblem, DealDone, ReviewForm } from "../screens/deal-notifications";
```

(убрать `PaymentFailed`). Это снимает consumer-side build-fix и чинит `tsup: No matching export … PaymentFailed`.
В Design-слое править нечего — экран отсутствует.

### 2b. Грамматика города в поиске `PdWebNav` ✅
`pd-webnav.jsx`: добавлен проп `cityLoc` (предложный, дефолт «Москве»). Плейсхолдер поиска теперь
«Поиск свежих букетов в **{cityLoc}**» → «…в Москве». `city` (имен.) остался для кнопки-города.
web прокидывает `cityPrepositional(city)`.

---

### Карта правок
| Область | Файл |
|---|---|
| PdCatalog презентационный + PdCatalogDemo | `pd-catalog.jsx` |
| Стили состояний коллекции | `pd-catalog.css` |
| PdMetroPicker: `options`/`idMode` (id наружу) | `pd-kit.jsx` |
| PdMetroDots: цвет или lineId | `pd-feed.jsx` |
| PdWebNav: проп `cityLoc` (предл. город) | `pd-webnav.jsx` |
| Витрина: PdCatalogDemo + галерея состояний | `Передарим · Каталог букетов.html` |
| Экспорт-фикс 2a (Claude Code) | `src/entries/deal.jsx` |
