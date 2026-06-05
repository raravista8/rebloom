// Canonical public origin. Override per-env with NEXT_PUBLIC_SITE_URL; defaults to
// the production domain (ARCHITECTURE §0). Used for metadataBase, canonical URLs,
// JSON-LD @id/url, sitemap and robots.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://peredarim.ru').replace(/\/$/, '');

export function abs(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
