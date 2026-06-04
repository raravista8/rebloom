import ListingChat from '@/components/listing/ListingChat';

export default async function ListingChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingChat id={id} />;
}
