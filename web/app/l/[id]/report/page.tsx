import ReportScreen from '@/components/report/ReportScreen';
export default async function ListingReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportScreen targetType="listing" targetId={id} backHref={`/l/${id}`} />;
}
