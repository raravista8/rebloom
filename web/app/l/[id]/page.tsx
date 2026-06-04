import ListingDetail from '@/components/listing/ListingDetail';

// Карточка букета. Client-fetched for now (personalized `liked` state + route-stub
// testability). SSR/SSG for crawlable share links is a tracked follow-up.
export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
