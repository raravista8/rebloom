import type { Metadata } from 'next';
import LoginFlow from '@/components/auth/LoginFlow';

export const metadata: Metadata = {
  title: 'Вход — Передарим',
};

export default function LoginPage() {
  return <LoginFlow />;
}
