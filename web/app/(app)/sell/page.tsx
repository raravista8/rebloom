import type { Metadata } from 'next';
import SellForm from '@/components/sell/SellForm';

export const metadata: Metadata = {
  title: 'Продать букет — Передарим',
};

export default function SellPage() {
  return <SellForm />;
}
