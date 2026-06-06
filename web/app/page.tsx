import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LandingHome from '@/components/marketing/LandingHome';
import { DEFAULT_CITY } from '@/lib/cities';
import { abs } from '@/lib/site';

// Commercial-first home meta (semantic core §6): brand-first title lost the «дешёвые/
// свежие цветы» demand; lead with the value prop, brand at the tail.
export const metadata: Metadata = {
  title: 'Свежие букеты в 2–3 раза дешевле магазина | Передарим',
  description:
    'Свежие букеты напрямую от людей — в 2–3 раза дешевле магазина. Самовывоз рядом, оплата при встрече.',
  alternates: { canonical: abs('/') },
  openGraph: {
    title: 'Свежие букеты в 2–3 раза дешевле магазина | Передарим',
    description: 'Свежие букеты напрямую от людей, в 2–3 раза дешевле магазина. Самовывоз рядом, оплата при встрече.',
    url: abs('/'),
    type: 'website',
    siteName: 'Передарим',
    locale: 'ru_RU',
  },
};

// Главная — маркетинговый лендинг + живой каталог с фильтрами (canon PdLanding,
// responsive via @container). City from the cookie set on /city (defaults to Москва).
export default async function HomePage() {
  const cityId = (await cookies()).get('city')?.value || DEFAULT_CITY;
  return <LandingHome cityId={cityId} />;
}
