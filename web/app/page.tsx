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
    'Свежие букеты рядом с вами в 2–3 раза дешевле цветочного. Самовывоз у дома, безопасная сделка с защитой денег. Заберите букет за полцены или передайте свой.',
  alternates: { canonical: abs('/') },
  openGraph: {
    title: 'Свежие букеты в 2–3 раза дешевле магазина | Передарим',
    description: 'Свежие букеты рядом, в 2–3 раза дешевле магазина. Самовывоз у дома, безопасная сделка.',
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
