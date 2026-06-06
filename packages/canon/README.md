# @rebloom/canon — 0.8.0

Auth-polish release. Start here:

- **`CHANGELOG.md`** — the 0.8.0 delta (what & why), house style. Prior history: `canon-0.7.0-pkg/CHANGELOG.md`.
- **`OTP_KEYBOARD_AUTOFILL.md`** — ⭐ the OTP “keyboard up + SMS AutoFill” logic. Prototype mock vs.
  real `web/` implementation (`autocomplete="one-time-code"`, iOS QuickType, Android WebOTP).
  **Read before touching the code-entry step.**
- **`VISUAL_TEXT_CHANGES_0.8.0.md`** — exhaustive screen-by-screen list of every visual & text
  change, incl. the login background photo.

## What changed, in one breath
Login aside photo fixed (prod 404 → hero photo) · official T‑ID badge · no pre-selected OAuth
provider · «или» divider · «Опубликовать букет» · consent spacing specificity fix · checkbox text
alignment · `PdNotice` text-wrap · new `AuthOtpFill` + system-keyboard AutoFill state · project-wide
**no-trailing-period** rule for titles/subtitles.

## Source of truth
`reference/prototypes/*` here are byte-current with the design source (the changed files:
`pd-auth.{jsx,css}`, `pd.css`, `ios-frame.jsx`, `android-frame.jsx`, `pd-land.jsx`, `pd-seo.jsx`,
`pd-settings.jsx`, `pd-admin-mobile.jsx`, `Передарим · Вход.html`, `img/oauth/tid.svg`,
`img/hero-lacybird.png`). Port into `src/auth/auth.jsx` + `src/styles/canon.css`, rebuild
`dist/*`. New asset to ship: `img/oauth/tid.svg`.
