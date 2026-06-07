# CANON HANDOFF — 0.9.2: `PdCard` data-driven (разблокирует импорт `PdCatalog`)

> Сторона **Claude Design** (прототип-референс). Источник правды — `reference/prototypes/` → `src/`.
> Закрывает ТЗ `uploads/canon-0.9.2-pdcard.md`. Сборка `dist/` (tsup) и вендоринг в `web/` — Claude **Code**.

---

## Контекст
0.9.1 сделал `PdCatalog` презентационным, но импортить его на живой `/catalog` мешала карточка
`PdCard`: фото строилось только из локального Unsplash-id, а лайк жил во внутреннем `useState`.
0.9.2 чинит оба блокера в `src/feed/feed.jsx` + даёт `renderCard`-slot и клиентскую сортировку.

## Блокеры — закрыты ✅

### 1. Фото — полный URL
`PdCard` рисует `d.photoUrl || pdPhotoSrc(d.photo)`. Хелпер:
```js
const pdPhotoSrc = (photo) => (typeof photo === 'string' && /^(https?:)?\/\//.test(photo)) ? photo : PD_IMG(photo);
```
- полный URL (`https://…`, `//cdn…`) → как есть (CDN/Object Storage, `photo_thumb_url`);
- локальный id → `PD_IMG(id)` (прототип/демо).

Web кладёт в `item.photoUrl` (или `item.photo`) полный URL — карточки каталога больше не битые.

### 2. Лайк — наружу
`LikeBtn` теперь **controlled-aware**:
- передан `onToggle` → `liked`/`count` controlled-пропы, клик зовёт `onToggle(next)` — web вешает
  реальный `POST /api/listings/{id}/like` (гость → `/login`), оптимистично/с откатом по ответу;
- не передан → прежний локальный оптимистичный стейт (демо, главная — без регресса).

`PdCard` принимает **`onLike(id, next)`** и прокидывает в `LikeBtn`.

## Желательное — сделано

### 3. «Новый» продавец
`seller.r == null` → чип **«Новый»** (`.pd-rating--new`) вместо `seller.r.toFixed(1)` («0.0»).
`seller` читается безопасно (`d.seller || {}`).

### 4. Сортировка
`PdCatalog` сортирует `cheap`/`exp`/`rating` **клиентски** по уже выданным `items`
(бэкенд-лента знает только секции `fresh`/`liked`). `fresh`/default — порядок как пришёл сверху.
Опции больше не inert при бэкенде без price-sort.

### 5. Рейтинг-фильтр — out of scope
Фильтр по рейтингу продавца в сайдбаре/панели бэкендом не поддерживается → пока **inert**
(оставлен в UI). Рабочим станет при бэкенд-фильтре (отдельная задача).

## Escape-hatch: `renderCard`-slot
`PdCatalog` принимает `renderCard={(item)=>…}` — web может подставить **свой `BouquetCard` целиком**
(тогда п.1–2 решаются на стороне web). Без пропа — дефолтная `PdCard` с `onLike`.

## Приёмка
`web/` удаляет `components/catalog/CatalogScreen.tsx` (+`CatalogFilters.tsx`), рендерит
`<PdCatalog items state total filters onFiltersChange stations flowers onLoadMore onLike renderCard? onRetry/>`.
Фото и лайки на `/catalog` работают как на главной. Визуал ≤2%. Версия → 0.9.2, секция в `CHANGELOG`,
дифф `src/`: `feed.jsx` (+`catalog.jsx` `renderCard`/`onLike`/sort, +`styles/canon.css` `.pd-rating--new`).

### Карта правок
| Область | Файл |
|---|---|
| PdCard: фото-URL, onLike, «Новый» + LikeBtn controlled | `src/feed/feed.jsx` |
| PdCatalog: `renderCard`-slot, `onLike`-проп, клиентская сортировка | `src/catalog/catalog.jsx` |
| `.pd-rating--new` (чип «Новый») | `src/styles/canon.css` · `dist/canon.css` · (proto: `pd.css`) |
| Прототип-референс | `reference/prototypes/pd-feed.jsx` · `pd-catalog.jsx` · `pd.css` |
