// @rebloom/canon · tsup build config
// Produces dist/ (committed by the consumer after vendoring — CANON_PACKAGE_TZ.md §6/§9 step 4).
// One bundle per entry point (matches package.json "exports").
//
// Cyrillic note (§5): set `esbuildOptions.charset` so non-ASCII is escaped to \uXXXX.
// After build, grep dist/ for ASCII component markers (e.g. "PdBtn", "AdminFraud")
// to confirm a NEW version compiled — never trust the version label alone (§7).
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index:            'src/index.jsx',
    buttons:          'src/entries/buttons.jsx',
    cards:            'src/entries/cards.jsx',
    forms:            'src/entries/forms.jsx',
    feed:             'src/entries/feed.jsx',
    deal:             'src/entries/deal.jsx',
    auth:             'src/entries/auth.jsx',
    settings:         'src/entries/settings.jsx',
    screens:          'src/entries/screens.jsx',
    admin:            'src/entries/admin.jsx',
    motion:           'src/entries/motion.ts',
    tokens:           'src/entries/tokens.ts',
    'tailwind-preset':'tokens/tailwind-preset.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ['react', 'react-dom', 'framer-motion'],
  // Bundle + emit the canonical stylesheet alongside JS.
  loader: { '.css': 'css' },
  esbuildOptions(options) {
    options.charset = 'ascii'; // escape Cyrillic to \uXXXX (§5)
    options.jsx = 'automatic';
  },
  // Unambiguous extensions under "type":"module": .mjs (ESM) / .cjs (CJS) —
  // matches the package.json "exports" map regardless of the type field.
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.cjs' };
  },
});
