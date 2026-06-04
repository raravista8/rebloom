'use client';
// Мои сделки — GET /api/deals (the user's deals as buyer or seller). Tab screen.
// Status filter chips; rows link to the deal. States loading/list/empty/error.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdEmpty, PdSkelCard, PdNotice, PdBtn } from '@/components/canon';
import { IconDeals } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { api } from '@/lib/api';
import { formatPriceKopecks, formatDate } from '@/lib/format';
import type { DealView, Paginated } from '@/lib/types';

const STATUS_LABEL: Record<string, string> = {
  created: 'ожидает оплаты',
  paid_held: 'в эскроу',
  released: 'завершено',
  refunded: 'возврат',
  disputed: 'спор',
  cancelled: 'отменено',
};
const STATUS_COLOR: Record<string, string> = {
  paid_held: 'var(--pd-primary)',
  released: 'var(--pd-fresh)',
  disputed: 'var(--pd-warn)',
  refunded: 'var(--pd-muted)',
  cancelled: 'var(--pd-muted)',
  created: 'var(--pd-muted)',
};

export default function DealsListScreen() {
  const [items, setItems] = useState<DealView[]>([]);
  const [phase, setPhase] = useState<'loading' | 'list' | 'empty' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const p = await api.get<Paginated<DealView>>('/deals?limit=50');
      setItems(p.items);
      setPhase(p.items.length === 0 ? 'empty' : 'list');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenChrome title="Сделки" back={false} tab>
      {phase === 'loading' && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <PdSkelCard key={i} />
          ))}
        </div>
      )}
      {phase === 'empty' && (
        <PdEmpty glyph={IconDeals} title="Пока нет сделок" text="Купите или продайте букет — здесь появятся ваши сделки и их статусы.">
          <Link href="/"><PdBtn variant="primary">Смотреть букеты</PdBtn></Link>
        </PdEmpty>
      )}
      {phase === 'error' && (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <PdNotice kind="danger">Не удалось загрузить сделки.</PdNotice>
          <div style={{ marginTop: 14 }}><button className="pd-link" onClick={load}>Повторить</button></div>
        </div>
      )}
      {phase === 'list' && (
        <div className="pd-list">
          {items.map((d) => (
            <Link key={d.id} href={`/deal/${d.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="pd-row" style={{ cursor: 'pointer' }}>
                {d.listing.photo_thumb_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.listing.photo_thumb_url} alt="" style={{ width: 46, height: 46, borderRadius: 11, objectFit: 'cover', flex: 'none' }} />
                ) : (
                  <div style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--pd-surface-2)', flex: 'none' }} />
                )}
                <div className="mid">
                  <div className="ttl">Букет · {formatPriceKopecks(d.amount_kopecks)}</div>
                  <div className="sub">
                    {d.role === 'buyer' ? 'Покупка' : 'Продажа'}
                    {d.created_at ? ` · ${formatDate(d.created_at)}` : ''}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_COLOR[d.status] ?? 'var(--pd-muted)' }}>
                  {STATUS_LABEL[d.status] ?? d.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </ScreenChrome>
  );
}
