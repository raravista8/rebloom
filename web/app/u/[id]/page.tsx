import ProfileScreen from '@/components/profile/ProfileScreen';

// Профиль продавца. Public (SSR for share/SEO is a tracked follow-up).
export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileScreen id={id} />;
}
