import { cookies } from 'next/headers';
import LandingHome from '@/components/marketing/LandingHome';
import { DEFAULT_CITY } from '@/lib/cities';

// Главная — маркетинговый лендинг + живой каталог с фильтрами (canon PdLanding,
// responsive via @container). City from the cookie set on /city (defaults to Москва).
export default async function HomePage() {
  const cityId = (await cookies()).get('city')?.value || DEFAULT_CITY;
  return <LandingHome cityId={cityId} />;
}
