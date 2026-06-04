import DisputeForm from '@/components/dispute/DisputeForm';

export default async function DisputeNewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DisputeForm id={id} />;
}
