'use client';
// Очередь модерации — GET /api/admin/moderation/queue?type=listing|review +
// POST /api/admin/moderation/{id} {type, action, reason} (FR-060/061, audited).
import { useCallback, useEffect, useState } from 'react';
import { PdBtn, PdNotice } from '@/components/canon';
import { api } from '@/lib/api';
import { formatPriceKopecks } from '@/lib/format';
import { cityName } from '@/lib/cities';
import type { ModerationQueueItem } from '@/lib/types';

type Tab = 'listing' | 'review';

function ItemCard({ item, onResolve }: { item: ModerationQueueItem; onResolve: (action: 'approve' | 'reject', reason: string) => Promise<void> }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  async function act(action: 'approve' | 'reject') {
    if (action === 'reject' && !rejecting) {
      setRejecting(true);
      return;
    }
    setBusy(true);
    await onResolve(action, action === 'reject' ? reason.trim() || 'Нарушение правил' : 'OK');
    setBusy(false);
  }

  return (
    <div style={{ background: 'var(--pd-surface)', border: '1px solid var(--pd-border)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--pd-muted)', marginBottom: 8 }}>
        <span>{item.type === 'listing' ? 'Объявление' : 'Отзыв'} · {item.id.slice(0, 8)}</span>
        <span>{item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : ''}</span>
      </div>
      {item.type === 'listing' ? (
        <div style={{ fontSize: 14 }}>
          Размер {item.size ?? '—'} · свежесть {item.freshness ?? '—'} · {item.price_kopecks != null ? formatPriceKopecks(item.price_kopecks) : '—'}
          {item.city_id && <span style={{ color: 'var(--pd-muted)' }}> · {cityName(item.city_id)}</span>}
        </div>
      ) : (
        <div style={{ fontSize: 14 }}>
          {item.score != null && <span style={{ color: 'var(--pd-aging)' }}>{'★'.repeat(item.score)} </span>}
          «{item.text ?? ''}»
        </div>
      )}
      {rejecting && (
        <input
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Причина отклонения (в аудит)"
          style={{ width: '100%', marginTop: 10, padding: '8px 12px', border: '1px solid var(--pd-border-strong)', borderRadius: 10, fontSize: 13.5, background: 'var(--pd-bg)' }}
        />
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <PdBtn variant="primary" loading={busy && !rejecting} disabled={busy} onClick={() => act('approve')}>Одобрить</PdBtn>
        <PdBtn variant="danger" loading={busy && rejecting} disabled={busy} onClick={() => act('reject')}>{rejecting ? 'Подтвердить отклонение' : 'Отклонить'}</PdBtn>
      </div>
    </div>
  );
}

export default function AdminModeration() {
  const [tab, setTab] = useState<Tab>('listing');
  const [items, setItems] = useState<ModerationQueueItem[]>([]);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async (t: Tab) => {
    setPhase('loading');
    try {
      const res = await api.get<{ items: ModerationQueueItem[] }>(`/admin/moderation/queue?type=${t}`);
      setItems(res.items);
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  const resolve = useCallback(
    async (item: ModerationQueueItem, action: 'approve' | 'reject', reason: string) => {
      try {
        await api.post(`/admin/moderation/${item.id}`, { type: item.type, action, reason });
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } catch {
        /* leave in queue on failure */
      }
    },
    [],
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Модерация</h1>
      <div className="pd-seg" style={{ maxWidth: 320, marginBottom: 18 }}>
        <button className={tab === 'listing' ? 'on' : ''} onClick={() => setTab('listing')}>Объявления</button>
        <button className={tab === 'review' ? 'on' : ''} onClick={() => setTab('review')}>Отзывы</button>
      </div>

      {phase === 'loading' && <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>}
      {phase === 'error' && (
        <div style={{ maxWidth: 420 }}>
          <PdNotice kind="danger">Не удалось загрузить очередь.</PdNotice>
          <div style={{ marginTop: 12 }}><button className="pd-link" onClick={() => load(tab)}>Повторить</button></div>
        </div>
      )}
      {phase === 'ready' && items.length === 0 && (
        <PdNotice kind="ok">Очередь пуста — всё проверено. 🌿</PdNotice>
      )}
      {phase === 'ready' &&
        items.map((item) => (
          <ItemCard key={item.id} item={item} onResolve={(action, reason) => resolve(item, action, reason)} />
        ))}
    </div>
  );
}
