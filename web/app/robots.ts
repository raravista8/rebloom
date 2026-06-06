import type { MetadataRoute } from 'next';
import { abs } from '@/lib/site';

// Allow crawl of the public surface; keep private/auth/app routes out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/settings',
        '/me',
        '/sell',
        '/deal',
        '/deals',
        '/notifications',
        '/login',
      ],
    },
    sitemap: abs('/sitemap.xml'),
    host: abs('/'),
  };
}
