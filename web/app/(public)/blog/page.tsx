import type { Metadata } from 'next';
import { BlogIndexView } from '@/components/marketing/CanonMarketing';
import JsonLd from '@/components/marketing/JsonLd';
import { BLOG_ARTICLES } from '@/lib/blogArticles';
import { SITE_URL, abs } from '@/lib/site';

// Mini-blog — supply warm-up (semantic core §2: дешёвый канал привлечения продавцов).
const URL = abs('/blog');

export const metadata: Metadata = {
  title: 'Блог «Передарима» — что делать с подаренным букетом | Передарим',
  description:
    'Короткие заметки для тех, кому подарили цветы: как продлить букету жизнь, что сделать вместо мусорки и как отдать его дальше за полцены.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Блог «Передарима» — что делать с подаренным букетом',
    description: 'Как продлить букету жизнь, что сделать вместо мусорки и как отдать его дальше за полцены.',
    url: URL,
    type: 'website',
    siteName: 'Передарим',
    locale: 'ru_RU',
  },
};

export default function BlogIndexPage() {
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Блог «Передарима»',
    url: URL,
    blogPost: BLOG_ARTICLES.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: abs(`/blog/${a.id}`),
      description: a.excerpt,
    })),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: URL },
    ],
  };
  return (
    <>
      <JsonLd data={[blogLd, breadcrumbs]} />
      <BlogIndexView />
    </>
  );
}
