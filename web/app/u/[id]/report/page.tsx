import ReportScreen from '@/components/report/ReportScreen';
export default async function UserReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportScreen targetType="user" targetId={id} backHref={`/u/${id}`} />;
}
