# WHAT CHANGED — canon 0.6.0 (basis for the CHANGELOG section)

1. **Settings: «Способы оплаты» (payments) + «Самозанятость» (self-employment) removed.** The platform handles no money in the current model (pay-on-meeting, peer-to-peer), so a payouts/receipts surface was dangling. Removed from the hub, mobile screens, desktop nav + panes, and module exports. Hub «Аккаунт» is now **Профиль · Способы входа**. `web/` drops `/settings/payments` and `/settings/self-employed`.

2. **Landing hero re-led on the C2C story.** It under-communicated that real people resell their own gifted bouquets. Eyebrow «Люди передаривают свои букеты»; **H1 «Свежие букеты _напрямую от людей_, в 2–3 раза дешевле магазина»**; lede now spells out the mechanic. New premium hero photo (`hero-lacybird.png`); price proof **17 200 ₽ → от 4 500 ₽ (−74%)**; live-count «128 букетов от людей рядом». An interim seller-avatar row was added then removed per review.

3. **Hero composition fix.** `text-wrap:balance` + desktop H1 `60→50px` + wider text column (`1.16fr`) + top-aligned image (`align-self:start`) + «2–3» `nowrap` — eliminates one-word-per-line ragging.

4. **SEO geo hero mirrors the landing, city-substituted.** «Свежие букеты _напрямую от людей_ в {городе}, в 2–3 раза дешевле магазина» + matching intro. `PdSeoMeta` **H1** synced; **Title/Description stay as the keyword snippet** (Title ≠ H1 on purpose). SEO H1/Title keep dashes (snippet format).

5. **Admin polish.** Жалоба action **«Решить» → «Разобрать»** (desktop + mobile); Finance plashka reworded («Платежи **идут**… напрямую, площадка их не обрабатывает»); Overview KPI «Оборот сделок» gains an **«оценка по завершённым»** caption to match Finance (platform can't see payments → turnover is an estimate).

6. **Copy pass.** Interface text de-em-dashed across client app + admin (connector «—» → comma/colon); city normalized to Москва. SEO H1/Title intentionally keep dashes.

---

**Authoritative source:** everything was authored in the design prototypes — `reference/prototypes/*`
(+ `reference/prototypes/img/hero-lacybird.png`) is byte-current. `src/*` and `dist/canon.css` are
re-converted from them. Note: `src/marketing/seo.jsx` had pre-existing copy drift in a few
safe-deal/rules sentences — trust `reference/prototypes/pd-seo.jsx` there. Rebuild `dist/*.js` via
`npm run build`.
