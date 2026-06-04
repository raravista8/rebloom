// tokens/tailwind-preset.ts
var v = (name) => `var(--${name})`;
var preset = {
  theme: {
    extend: {
      colors: {
        bg: v("pd-bg"),
        surface: v("pd-surface"),
        "surface-2": v("pd-surface-2"),
        "surface-3": v("pd-surface-3"),
        border: v("pd-border"),
        "border-strong": v("pd-border-strong"),
        text: v("pd-text"),
        muted: v("pd-muted"),
        faint: v("pd-faint"),
        primary: {
          DEFAULT: v("pd-primary"),
          press: v("pd-primary-press"),
          soft: v("pd-primary-soft"),
          on: v("pd-on-primary")
        },
        fresh: v("pd-fresh"),
        aging: v("pd-aging"),
        old: v("pd-old"),
        like: v("pd-like"),
        success: v("pd-success"),
        warn: v("pd-warn"),
        danger: v("pd-danger"),
        "fresh-soft": v("pd-fresh-soft"),
        "warn-soft": v("pd-warn-soft"),
        "danger-soft": v("pd-danger-soft")
      },
      fontFamily: {
        sans: ["'Golos Text'", "system-ui", "-apple-system", "sans-serif"]
      },
      borderRadius: {
        sm: "var(--r-sm)",
        // 11px
        DEFAULT: "var(--pd-radius)",
        // 16px
        lg: "var(--r-lg)",
        // 22px
        pill: "var(--r-pill)"
        // 999px
      },
      transitionTimingFunction: {
        standard: "var(--pd-ease-standard)",
        decelerate: "var(--pd-ease-decelerate)",
        accelerate: "var(--pd-ease-accelerate)"
      },
      transitionDuration: {
        fast: "160",
        base: "240",
        slow: "320"
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,.12)",
        "card-hover": "0 12px 30px rgba(60,44,28,.15)",
        sheet: "0 26px 60px rgba(40,30,20,.18)",
        window: "0 34px 80px rgba(40,30,20,.22)"
      }
    }
  }
};
var tailwind_preset_default = preset;

export { tailwind_preset_default };
