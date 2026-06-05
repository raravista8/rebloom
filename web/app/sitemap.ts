import type { MetadataRoute } from 'next';
import { GEO_SLUGS } from '@/lib/geoCities';
import { BLOG_ARTICLES } from '@/lib/blogArticles';
import { abs } from '@/lib/site';

// Public, crawlable surface only (CLAUDE_CODE_HANDOFF §8.3). In-app/private routes
// (/deal, /me, /settings, /admin, /notifications) are intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']) => ({
    url: abs(path),
    changeFrequency,
    priority,
  });
  return [
    entry('/', 1.0, 'daily'),
    entry('/bezopasnaya-sdelka', 0.6, 'monthly'),
    entry('/blog', 0.5, 'weekly'),
    ...GEO_SLUGS.map((slug) => entry(`/${slug}`, 0.8, 'daily')),
    ...BLOG_ARTICLES.map((a) => entry(`/blog/${a.id}`, 0.4, 'monthly')),
  ];
}
