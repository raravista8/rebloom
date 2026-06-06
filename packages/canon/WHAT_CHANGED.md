# WHAT CHANGED — canon 0.6.2 (basis for the CHANGELOG section)

Landing-only patch (`./marketing` · `PdLanding`). **Read `CLAUDE_CODE_HANDOFF.md §0` first** — it lists the
hero fields prod silently dropped after 0.6.0 and how to verify them.

## ⚠️ Why this version exists
After 0.6.0 shipped the new C2C hero, **prod still rendered the OLD hero** (eyebrow «Вторая жизнь букетов»,
H1 «…дешевле цветочного магазина», no photo, price «от 690 ₽ / −60%»). Root cause: the hero copy lives in the
**component**, but the `web/` build was driven off the **meta-contract table in the handoff (§8.3), which still
carried the pre-0.6.0 H1** — so the visible H1/eyebrow/lede/price/photo were never re-vendored. 0.6.2 fixes the
contract and adds an explicit hero-field checklist so this can't silently regress again.

## Changes

1. **Hero fields re-asserted (no visual change vs 0.6.0 — this is a vendoring fix).** Canonical hero is:
   eyebrow «Люди передаривают свои букеты», H1 «Свежие букеты *напрямую от людей*, в 2–3 раза дешевле
   магазина», lede «Букет подарили, он порадовал и уже не нужен…», photo `hero-lacybird.png`, price tag
   `17 200 ₽ в цветочной → от 4 500 ₽`, badge `−74%`, live-count «128 букетов от людей рядом». **§8.3 meta H1
   corrected** to match the component.

2. **Desktop city selector is now a real popover.** The header «📍 Москва ▾» opens an anchored dropdown
   (`.pdl-citymenu`: the full list of all 10 cities with live counts + checkmark on the current one — no search,
   all rows fit without scrolling) — **not** the mobile full-screen «Город» page that prod was falling back to
   on desktop. `NavCity` owns the open/close + selection; the open/close ref sits on the wrapper so a second
   click on the trigger reliably closes it; also closes on outside-click / Esc. `web/` wires the real city
   dictionary + persisted geo.

3. **City selector placed consistently.** It now sits **immediately after the brand** in *both* header states
   (guest + authorized). Previously the guest header put it on the right, next to «Войти» — the two states
   disagreed. One position now.

4. **Authorized-header CTA unified to «Опубликовать букет».** The landing header preview used «Продать букет»
   (the in-app verb) while everything else on the marketing surface says «Опубликовать букет». On the landing
   the brand voice wins; the **in-app** authenticated surfaces (feed/catalog/sell) keep «Продать букет».

5. **Avatar ring fixed.** `.pdl-nav-ava` is a `<button>` and never reset its UA border → a dark ring around the
   terracotta avatar. Added `border:none; padding:0; cursor:pointer`.

---

**Authoritative:** `reference/prototypes/pd-land.{jsx,css}` are byte-current. `src/marketing/landing.jsx`,
`dist/canon.css` and `src/styles/canon.css` re-synced. Rebuild `dist/*.js` via `npm run build`.
Landing-scoped — nothing else changed since 0.6.1.
