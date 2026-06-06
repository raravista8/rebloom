import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GeoPageView } from '@/components/marketing/CanonMarketing';
import JsonLd from '@/components/marketing/JsonLd';
import { SiteFooterStandalone } from '@/components/marketing/SiteFooter';
import { GEO_SLUGS, geoCityBySlug } from '@/lib/geoCities';
import { SITE_URL, abs } from '@/lib/site';

// Geo SEO landing, one template → 10 cities (CLAUDE_CODE_HANDOFF §8.1). SSG over the
// white-listed slugs; anything else 404s (dynamicParams=false) so this dynamic segment
// never shadows /login, /sell, /search, /l, /u, /admin (static routes win regardless).
export const dynamicParams = false;

export function generateStaticParams() {
  return GEO_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = geoCityBySlug(slug);
  if (!city) return {};
  const title = `Дешёвые свежие букеты в ${city.loc} — самовывоз рядом | Передарим`;
  const description = `Свежие букеты в ${city.loc} — в 2–3 раза дешевле магазина. Самовывоз рядом, оплата при встрече.`;
  const url = abs(`/${city.id}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'Передарим', locale: 'ru_RU' },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = geoCityBySlug(slug);
  if (!city) notFound();

  const url = abs(`/${city.id}`);
  // City in Title/H1 only (semantic core §2.3 — Директ via geo-targeting, not keywords).
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: city.nom, item: url },
    ],
  };
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Свежие букеты в ${city.loc} — самовывоз по районам`,
    itemListElement: city.districts.map(([name], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Букеты, ${name}`,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbs, itemList]} />
      <GeoPageView data={city} />
      <SiteFooterStandalone />
    </>
  );
}
