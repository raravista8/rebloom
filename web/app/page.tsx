import { cookies } from 'next/headers';
import HomeFeed from '@/components/feed/HomeFeed';
import { DEFAULT_CITY } from '@/lib/cities';

// Главная / витрина. City is read from the cookie set on /city (defaults to Москва).
export default async function HomePage() {
  const cityId = (await cookies()).get('city')?.value || DEFAULT_CITY;
  return <HomeFeed cityId={cityId} />;
}
