# CANON PACKAGE TZ — экспорт npm-пакета `@rebloom/canon` (Claude Design → Claude Code)

> Контракт между **Claude Design** (производит UI) и **Claude Code** (потребляет в `web/`). Парный документ — `DESIGN_BRIEF.md` (что проектировать). Операционная процедура вендоринга также продублирована в `../OPERATIONS.md §7` — этот файл — её канонический источник.

## 1. Зачем
Дизайн рождается в Claude Design и попадает в код **только** как версионированный npm-пакет `@rebloom/canon`. Цель — единый источник истины UI: то, что нарисовано и проверено в Claude Design, и есть то, что рендерит `web/` (а значит и обёрнутые Capacitor iOS/Android). Ручная пересборка JSX в коде запрещена.

## 2. Идентичность пакета
- **Имя:** `@rebloom/canon` (scoped). **Тип:** web, React + Tailwind. **Версия:** SemVer.
- **Место в репозитории:** вендорится в `packages/canon/`; потребитель — `web/` (Next.js).
- **Code-name `rebloom`** в имени пакета (не бренд) — намеренно (brand≠code-name).

## 3. Структура пакета (что лежит в `packages/canon/`)
```
packages/canon/
  src/            # исходники компонентов (TSX) — SINGLE SOURCE, правит ТОЛЬКО Claude Design
  dist/           # собранный билд — КОММИТИТСЯ в репозиторий
  tokens/         # tailwind-preset (ts) + css-vars (theme.css) — дизайн-токены
  package.json
  CHANGELOG.md    # история версий
  README.md       # карта entry points + примеры импортов
```

## 4. Контракт `package.json`
- `name: "@rebloom/canon"`, `version` (SemVer), `description` (что изменилось — кратко).
- `main`/`module`/`exports` — карта entry points (по группам: `./buttons`, `./cards`, `./forms`, `./feed`, `./deal`, `./tokens`, `./motion` (анимации/easing/варианты — см. `MOTION.md`), `./admin` (data-таблицы/чарты/KPI — см. `ADMIN_DESIGN_BRIEF.md`)…); `types` для TS.
- `peerDependencies`: `react`, `react-dom` (диапазоном, как в `web/`); `tailwindcss` — peer/dev. Анимационная библиотека (напр. Framer Motion) — в `dependencies`/`peer` по факту реализации моушна (`MOTION.md §4`).
- `sideEffects`: только css-файлы (для tree-shaking JS).
- `files`: `dist`, `tokens`, `README.md`, `CHANGELOG.md`.

## 5. Контракт стилей и токенов
- Компоненты стилизуются Tailwind-классами поверх **общего пресета** (`tokens/tailwind-preset`), который `web/tailwind.config` подключает через `presets: [...]`. Цвета/радиусы/тени/типографика — **только из семантических токенов**, без сырых hex в компонентах.
- Тема — через CSS-vars (`tokens/theme.css`), чтобы менять централизованно.
- **Кириллица:** сборщик (esbuild/tsup) экранирует кириллицу в `\uXXXX`. После сборки **проверять наличие ASCII-маркеров** компонентов, чтобы убедиться, что собралась новая версия (а не старый код под новым лейблом).

## 6. Сборка
- `dist/` собирается (tsup или эквивалент) и **коммитится** (потребитель не пересобирает дизайн).
- Команда: `cd packages/canon && npm run build`.
- `dts` — по факту настройки пакета (carry-forward, если типы генерятся отдельно).

## 7. Версионирование и CHANGELOG (дисциплина)
- Каждый экспорт: **bump `version`** + **prepend секции в `CHANGELOG.md`** (что добавлено/изменено/сломано).
- **Главное правило (выстрадано в `vitrina`): НЕ доверять лейблу версии.** Перед вендорингом — **дифф `src/` зипа против вендоренного `src/`** и сверка с CHANGELOG: бывает, что под новым номером приезжает старый код.
- Ломающие изменения разметки/классов/селекторов — major; они требуют сверки потребительских адаптеров (§9).

## 8. Что обязан содержать каждый ЭКСПОРТ-ЗИП из Claude Design
`export/canon-X.Y.Z-pkg/` со всем из §3 (`src/`, `dist/`, `tokens/`, `package.json`, `CHANGELOG.md`, `README.md`) **плюс**:
- **baseline-скриншоты** изменённых экранов/компонентов (в рамке устройства) — для pixel-diff в `web/tests/visual/`.
- **дельта `SCREEN_INDEX`**: какие экраны добавлены/изменены и их статус.
- короткая записка «что изменилось» (1–5 пунктов) — основа для CHANGELOG-секции.

## 9. Процедура вендоринга (Claude Code, round-trip) — канон
1. **Проверить, что дифф реальный** (§7): дифф зип-`src/` vs вендоренного `src/`, сверить с CHANGELOG.
2. `cp` изменённые `src/*` (и `tokens/*`) в `packages/canon/`.
3. Bump `package.json` version + description; prepend CHANGELOG-секцию.
4. `npm run build`; закоммитить `dist/`; проверить ASCII-маркеры (кириллица §5).
5. Cache-bust установка в потребителя:
   `cd web && rm -rf node_modules/@rebloom/canon && npm cache clean --force && npm install --install-links file:../packages/canon --force`
   (`--install-links` обязателен — бандлер не ходит по `file:`-симлинкам.)
6. **Сверить потребительские адаптеры**, если canon поменял разметку/классы/href (обёртки в `web/components/` могут опираться на классы/селекторы canon).
7. Bump version-строк в `SCREEN_INDEX.md`, `VISUAL_COVERAGE.md`, `web/CLAUDE.md`.
8. `cd web && npm run test:visual` — diff ≤ 2% против новых baselines.

## 10. Правила потребителя (Claude Code) — НЕЛЬЗЯ
- **НИКОГДА не править `packages/canon/src/*` руками** — перетрётся следующим экспортом, ломает паритет.
- Не форкать компоненты; импортировать entry и компоновать в `web/components/` (обёртки — только с обоснованием).
- Изменение компонента = задача для Claude Design (новая версия), не локальный патч.

## 11. Токены «на будущее» (опционально, не для MVP)
Дополнительно отдавать токены в **stack-portable** виде (NativeWind-friendly `tailwind.config` / CSS-vars), чтобы при желании открыть нативный путь (RN) без переписывания продукта. MVP потребляет web-canon; нативная реализация — отдельное инженерное решение (ADR-0004, отклонено сейчас).

## 12. Приёмка (Definition of Done вендоринга)
- `web/` собирается чисто; `npm run test:visual` ≤ 2%.
- Маркеры новой версии присутствуют в установленном `dist/`.
- `version` + `CHANGELOG` обновлены; трекеры (`SCREEN_INDEX`, `VISUAL_COVERAGE`) синхронизированы.
- Ни одного ручного правка в `src/`.
