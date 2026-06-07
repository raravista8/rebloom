import type { Metadata } from 'next';
import CatalogScreen from '@/components/catalog/CatalogScreen';

// Browse-first public catalog (canon 0.9.0). Grid shown immediately (not the search-first
// «введите запрос» idle). Public — no auth gate (the in-app /search sits behind auth).
export const metadata: Metadata = {
  title: 'Каталог свежих букетов — Передарим',
  description: 'Свежие букеты рядом от людей, в 2–3 раза дешевле магазина. Оплата при встрече.',
  alternates: { canonical: '/catalog' },
};

export default function CatalogPage() {
  return <CatalogScreen />;
}
