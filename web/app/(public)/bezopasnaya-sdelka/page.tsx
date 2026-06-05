import type { Metadata } from 'next';
import { SafeDealView } from '@/components/marketing/CanonMarketing';
import JsonLd from '@/components/marketing/JsonLd';
import { SITE_URL, abs } from '@/lib/site';

// «Безопасная сделка» — снимает возражение «обман» (semantic core §6, кластер доверия).
const URL = abs('/bezopasnaya-sdelka');

export const metadata: Metadata = {
  title: 'Безопасная сделка и эскроу — как защищены деньги | Передарим',
  description:
    'Деньги покупателя замораживаются на счёте сервиса и уходят продавцу только после того, как букет у вас в руках. Что такое эскроу простыми словами и как работает безопасная сделка на «Передариме».',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Безопасная сделка и эскроу — как защищены деньги | Передарим',
    description: 'Деньги уходят продавцу только после того, как вы забрали букет. Эскроу простыми словами.',
    url: URL,
    type: 'article',
    siteName: 'Передарим',
    locale: 'ru_RU',
  },
};

// FAQ mirrors the visible canon copy (marketing/seo.jsx PdSafeDeal) — structured data
// must match on-page content. Keep in sync if Claude Design re-words the page.
const FAQ: [string, string][] = [
  [
    'Кто хранит мои деньги до сделки?',
    'Деньги лежат на номинальном счёте платёжного провайдера, а не на личной карте продавца. Сервис лишь даёт команду «отдать» или «вернуть» по итогам сделки.',
  ],
  [
    'Сколько берёт сервис?',
    '5% с продажи и только когда букет продан. Публикация бесплатна. Для покупателя цена в объявлении — финальная.',
  ],
  [
    'Что считается доказательством в споре?',
    'Фото букета при встрече, переписка в чате сделки и история статусов. Поэтому всё общение по сделке лучше вести внутри приложения.',
  ],
  [
    'Можно ли договориться и оплатить мимо сервиса?',
    'Можно, но тогда защиты нет — это обычная передача денег незнакомцу. Эскроу работает, только если оплата прошла через «Передарим».',
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
    </>
  );
}
