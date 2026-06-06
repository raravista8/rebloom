# ТЗ для Claude Design — полный экспорт `@rebloom/canon` 0.8.1

> **Контекст.** Поставка 0.8.0 пришла **docs-only** — в zip были только 4 `.md`
> (CHANGELOG, OTP_KEYBOARD_AUTOFILL, VISUAL_TEXT_CHANGES, README), а `src/ dist/
> tokens/ package.json` **отсутствовали**. Поэтому видимые правки применены в `web/`
> руками (хэндролл-экраны) + временными CSS-override в `globals.css`, а часть правок
> **повисла заблокированной** (живёт внутри canon-компонентов, которые `web/` импортирует
> целиком). Нужен **полный экспорт** по контракту `CANON_PACKAGE_TZ.md`, который закроет
> блок и позволит снять временные web-override.

## 0. Главное требование
Отдать **полный пакет** `export/canon-0.8.1-pkg/` строго по `CANON_PACKAGE_TZ.md §3/§8`:
`src/`, `dist/` (включая собранный `canon.css` и `dist/favicon/`), `tokens/`,
`package.json` (bump → **0.8.1**), `CHANGELOG.md`, `README.md`, baseline-скриншоты
изменённых экранов. **НЕ docs-only.** Прото-исходники `reference/prototypes/*` —
byte-current под `src/` (как обычно).

## 1. Что обязано быть В ЭКСПОРТЕ (закрыть блок 0.8.0)

### 1.1 🐛 SEO-страницы — снять завершающие точки (`pd-seo.jsx` · `.pds-h2-sub`)
`web/` импортирует `PdGeoPage` / `PdSafeDeal` / `PdBlog*` **целиком**, поэтому текст
правится **только** в canon-исходнике. По `VISUAL_TEXT_CHANGES_0.8.0.md §D-SEO` снять
точку у 5 подзаголовков:
- «…лучшие разбирают за часы.» → «…за часы»
- «…без поездок через весь город.» → «…весь город»
- «…подберите свежий букет за полцены.» → «…за полцены»
- «…крупнейших городах России, выберите свой.» → «…выберите свой»
- «Три шага, без предоплаты и посредников.» → «…и посредников»

### 1.2 🐛 Фото на десктоп-чузере входа (`pd-auth.jsx` · `AuthDesktopChooser`/`DeskShell` · `.pad-photo`)
`src` фото → **`img/hero-lacybird.png`** (сейчас `img/1561181286-d3fee7d55364.jpg`).
Тот же «lacy bird», что у hero лендинга (A1). **Положить ассет** так, чтобы он
резолвился из роутов auth (`dist` / package `files`). Это снимет наш временный rewrite
в `web/next.config.mjs`.

### 1.3 🐛 Три CSS-фикса — в `canon.css` (сейчас web-override)
Перенести в `src/styles/canon.css` (и в собранный `dist/canon.css`):
- **A6** `.pa .pa-consent { margin-top:30px; line-height:1.7 }` (двухклассовый селектор,
  чтобы перебить ресет `.pa p{margin:0}` — иначе `margin-top` = 0, как было).
- **A7** `.pd-check .t { padding-top:3px }`.
- **C** `.pd-notice { text-wrap:pretty }`.
После этого я **удалю** соответствующий блок из `web/app/globals.css`.

## 2. Долги прошлых версий — тоже закрыть этим экспортом

### 2.1 🔴 `PdMobileMenu` — нужны route-пропсы (долг 0.7.0)
Сейчас гостевые ссылки бургер-меню **зашиты как `.html`-пути превью** → на `web/` это
404. Из-за этого бургер на canon-SEO-страницах (`.pds`/`.pdc`) **скрыт** CSS-оверрайдом
в `web/`. Нужно: дать компоненту проп для ссылок (например `links=[{label,sub,href}]`
или per-item `href`), чтобы потребитель передавал **реальные роуты**
(`/catalog`, `/#how`, `/bezopasnaya-sdelka`, `/#app`). Тогда я включу бургер на
SEO-страницах и сниму web-override `.pds/.pdc .pdl-nav-burger{display:none}`.

### 2.2 🟠 Копирайт «комиссия 5%» — убрать (долг 0.7.0)
В `pd-land.jsx` финальный CTA: «Публикация бесплатна, **комиссия сервиса всего 5% с
продажи**.» — **противоречит ADR-0013** (no-escrow, «площадка денег не касается») и
соседнему тексту «Площадка денег не касается». Вернуть к «Публикация бесплатна»
(без комиссии). Если 5% — реальное решение, это отдельный ADR монетизации (тогда нужен
и механизм сбора при оплате-при-встрече).

## 3. Дисциплина сборки (повторяющийся косяк — НЕ сбросить снова)
Каждая поставка **сбрасывает** локальные build-фиксы — пожалуйста, **сохранить** в `package.json`/`tsup.config.ts`:
- `tsup.config.ts` → `outExtension({format}) => ({ js: format==='esm' ? '.mjs' : '.cjs' })`
  (иначе emit `.js` под `"type":"module"` ломает карту `exports`).
- `package.json` `exports.*.require` → `./dist/X.**cjs**` (не `.js`).
Иначе я переприменяю их при вендоринге — но лучше зафиксировать в источнике.

## 4. Приёмка (Definition of Done)
- В zip есть `src/` **и** `dist/` (не только `.md`); `dist/canon.css` содержит A6/A7/C;
  `dist/favicon/` на месте.
- Диф `src/` зипа против вендоренного показывает ровно правки §1–§2 (не доверять лейблу
  версии — `CANON_PACKAGE_TZ.md §7`).
- `package.json` `version` = `0.8.1`, CHANGELOG-секция с перечнем §1–§2, baseline-скриншоты
  изменённых экранов (вход-десктоп, SEO-гео, лендинг-финал).
- После вендоринга в `web/`: `npm run test:visual` ≤ 2%.
- ASCII-маркеры в `dist/*.mjs` подтверждают новую сборку (кириллица экранируется в `\uXXXX`).

## 5. Что я сделаю на стороне `web/` после получения экспорта
1. Вендорю по `CANON_PACKAGE_TZ.md §9` (cp `src/`, build, restore `canon.css`+favicon, install).
2. **Удаляю временные web-override:** блок 0.8.0-CSS из `globals.css` (A6/A7/C), rewrite
   `/img/1561181286-d3fee7d55364.jpg` из `next.config.mjs`, скрытие SEO-бургера
   (`.pds/.pdc .pdl-nav-burger`).
3. Прогон `test:visual` + локальный E2E (`web/tests/e2e-local/journeys.mjs`) против реального бэка.

---
> Ссылки: контракт упаковки — `docs/handoff/CANON_PACKAGE_TZ.md`; что менялось в 0.8.0 —
> `packages/canon/VISUAL_TEXT_CHANGES_0.8.0.md` + `OTP_KEYBOARD_AUTOFILL.md`; почему хэндролл —
> `docs/OPERATIONS.md §7` (the home landing / auth are hand-rolled in `web/`).
