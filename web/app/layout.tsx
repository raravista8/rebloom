import type { Metadata, Viewport } from 'next';
import { Golos_Text } from 'next/font/google';
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
  title: 'Передарим — вторая жизнь подаренных букетов',
  description:
    'C2C-маркетплейс ресейла подаренных букетов: свежие цветы дешевле флориста, безопасная сделка через эскроу.',
  applicationName: 'Передарим',
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
      <body>{children}</body>
    </html>
  );
}
