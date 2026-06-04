import ReviewForm from '@/components/review/ReviewForm';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewForm id={id} />;
}
