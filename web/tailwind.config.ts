import type { Config } from 'tailwindcss';
// Semantic tokens (colors→CSS vars, Golos Text, radii, shadows) come from canon.
// CANON_PACKAGE_TZ.md §5: web/ wires the preset; never hardcode hex.
import canonPreset from '@rebloom/canon/tokens/tailwind-preset';

const config: Config = {
  presets: [canonPreset as Partial<Config>],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    // canon dist is pre-styled via canon.css (.pd-* classes); we still scan its
    // dist so any Tailwind utilities it emits are present.
    './node_modules/@rebloom/canon/dist/**/*.{js,mjs,cjs}',
  ],
  theme: { extend: {} },
  plugins: [],
};

export default config;
