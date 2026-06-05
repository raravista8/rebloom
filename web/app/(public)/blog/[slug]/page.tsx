import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticleView } from '@/components/marketing/CanonMarketing';
import JsonLd from '@/components/marketing/JsonLd';
import { SiteFooterStandalone } from '@/components/marketing/SiteFooter';
import { BLOG_ARTICLES, blogArticleBySlug } from '@/lib/blogArticles';
import { SITE_URL, abs } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = blogArticleBySlug(slug);
  if (!a) return {};
  const url = abs(`/blog/${a.id}`);
  return {
    title: `${a.title} | Передарим`,
    description: a.excerpt,
    alternates: { canonical: url },
    openGraph: { title: a.title, description: a.excerpt, url, type: 'article', siteName: 'Передарим', locale: 'ru_RU' },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = blogArticleBySlug(slug);
  if (!a) notFound();

  const url = abs(`/blog/${a.id}`);
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    url,
    author: { '@type': 'Organization', name: 'Передарим' },
    publisher: { '@type': 'Organization', name: 'Передарим' },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: abs('/blog') },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  };
  return (
    <>
      <JsonLd data={[articleLd, breadcrumbs]} />
      <BlogArticleView article={a} />
      <SiteFooterStandalone />
    </>
  );
}
