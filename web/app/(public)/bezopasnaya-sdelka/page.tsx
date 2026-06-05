import type { Metadata } from 'next';
import { SafeDealView } from '@/components/marketing/CanonMarketing';
import JsonLd from '@/components/marketing/JsonLd';
import { SiteFooterStandalone } from '@/components/marketing/SiteFooter';
import { SITE_URL, abs } from '@/lib/site';

// «Безопасная сделка» — снимает возражение «обман» (semantic core §6, кластер доверия).
const URL = abs('/bezopasnaya-sdelka');

export const metadata: Metadata = {
  title: 'Безопасная сделка — оплата при встрече | Передарим',
  description:
    'Никакой предоплаты: вы платите за букет наличными или переводом только при встрече, когда забрали его. Как безопасно купить цветы с рук на «Передариме».',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Безопасная сделка — оплата при встрече | Передарим',
    description: 'Платите за букет, только когда забрали его. Безопасно покупаем цветы с рук.',
    url: URL,
    type: 'article',
    siteName: 'Передарим',
    locale: 'ru_RU',
  },
};

// FAQ mirrors the visible canon copy (marketing/seo.jsx PdSafeDeal, 0.5.0 pay-at-meeting)
// — structured data must match on-page content. Keep in sync if Claude Design re-words it.
const FAQ: [string, string][] = [
  [
    'Нужно ли платить заранее?',
    'Нет. Предоплаты нет — вы договариваетесь с продавцом в чате и платите при встрече, когда букет уже у вас в руках. Площадка денег не удерживает.',
  ],
  [
    'Сколько берёт сервис?',
    'Публикация и сделки бесплатны — площадка денег между пользователями не проводит. Расчёт идёт напрямую между покупателем и продавцом.',
  ],
  [
    'А если букет не такой, как на фото?',
    'Просто не платите — деньги вы отдаёте, только когда увидели букет вживую и он вам подошёл. Если продавец ведёт себя нечестно, пожалуйтесь, и поддержка его ограничит.',
  ],
  [
    'Почему так безопаснее, чем по объявлению?',
    'Вход по номеру телефона, реальные отзывы и рейтинг, модерация и жалобы. Никаких переводов незнакомцам заранее — только оплата на месте при самовывозе.',
  ],
];

export default function SafeDealPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Безопасная сделка', item: URL },
    ],
  };
  return (
    <>
      <JsonLd data={[faqLd, breadcrumbs]} />
      <SafeDealView />
      <SiteFooterStandalone />
    </>
  );
}
