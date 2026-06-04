import HomeFeed from '@/components/feed/HomeFeed';
import { DEFAULT_CITY } from '@/lib/cities';

// Главная / витрина. City selection persists later (cookie/context); MVP defaults
// to Москва (wave-1 launch city).
export default function HomePage() {
  return <HomeFeed cityId={DEFAULT_CITY} />;
}
