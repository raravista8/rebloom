# WHAT CHANGED — canon 0.6.1 (basis for the CHANGELOG section)

Landing-only patch (`./marketing` · `PdLanding`).

1. **Mobile hero reworked.** Stacked «text → photo below» felt like a bouquet dumped at the bottom; a full-bleed photo-background overlay overlapped. Final solution: on narrow containers the **photo is a bounded banner on top** (`order:-1`, `aspect-ratio:16/9`), with the price tag + live-count chips contained inside the card, and the dark text block below. Scoped to `@container pdl (max-width:899.98px)` — the **desktop side-by-side hero is unchanged**.

2. **Header city selector.** Guest nav gains a tappable «📍 Москва ▾» so the visitor sees their city immediately and can switch it. On mobile it replaces «Войти» (which moves under the hamburger); on desktop both show. `web/` wires the real picker + persisted geo.

3. **Trust trimmed.** «Рядом с домом» removed from the hero trust chips **and** the «Как это работает» advantages (duplicated the headline; pickup is covered elsewhere). Both now: «В 2–3 раза дешевле · Оплата при встрече».

---

**Authoritative:** `reference/prototypes/pd-land.{jsx,css}` are byte-current. `src/marketing/landing.jsx`,
`dist/canon.css` and `src/styles/canon.css` re-synced. Rebuild `dist/*.js` via `npm run build`.
Landing-scoped — nothing else changed since 0.6.0.
