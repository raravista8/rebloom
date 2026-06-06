import type { Metadata, Viewport } from 'next';
import { Golos_Text } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import Metrica from '@/components/analytics/Metrica';
// Token order: theme vars first, then canon component styles, then our overrides.
import '@rebloom/canon/tokens/theme.css';
import '@rebloom/canon/canon.css';
import './globals.css';

// Self-hosted Golos Text exposed as a CSS variable; globals.css points the canon
// --pd-font token at it (so we don't depend on an external Google Fonts request —
// matters inside the Capacitor-wrapped app).
const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-golos',
  display: 'swap',
});

export const metadata: Metadata = {
  // Absolute origin for canonical/OG/sitemap URLs (per-page canonical set on each page).
  metadataBase: new URL(SITE_URL),
  title: 'Передарим — вторая жизнь подаренных букетов',
  description:
    'C2C-маркетплейс ресейла подаренных букетов: свежие цветы дешевле флориста, оплата при встрече, самовывоз рядом.',
  applicationName: 'Передарим',
  // «Соцветие» favicon set shipped with @rebloom/canon 0.2.0 (copied to public/).
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FAF8F4',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={golos.variable}>
      <body>{children}<Metrica /></body>
    </html>
  );
}
