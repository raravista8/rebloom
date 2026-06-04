'use client';
// Финансы — GET /api/admin/finance (FR-070). All figures derive from the append-only
// ledger. held = gmv − commission − payout − refund (reconciliation invariant).
import { useCallback, useEffect, useState } from 'react';
import { PdNotice } from '@/components/canon';
import { api } from '@/lib/api';
import { formatPriceKopecks } from '@/lib/format';

interface Finance {
  gmv_kopecks: number;
  commission_kopecks: number;
  payout_kopecks: number;
  refund_kopecks: number;
  held_kopecks: number;
  deals_by_status?: Record<string, number>;
}

function Card({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: 'var(--pd-surface)', border: '1px solid var(--pd-border)', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent ? 'var(--pd-primary)' : 'var(--pd-text)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}

export default function AdminFinance() {
  const [d, setD] = useState<Finance | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      setD(await api.get<Finance>('/admin/finance'));
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  if (phase === 'loading') return <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>;
  if (phase === 'error' || !d) {
    return <div style={{ maxWidth: 420 }}><PdNotice kind="danger">Не удалось загрузить финансы.</PdNotice><div style={{ marginTop: 12 }}><button className="pd-link" onClick={load}>Повторить</button></div></div>;
  }

  const reconciles = d.held_kopecks === d.gmv_kopecks - d.commission_kopecks - d.payout_kopecks - d.refund_kopecks;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>Финансы</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
        <Card label="Оборот (GMV)" value={formatPriceKopecks(d.gmv_kopecks)} />
        <Card label="Комиссия площадки" value={formatPriceKopecks(d.commission_kopecks)} accent />
        <Card label="Выплачено продавцам" value={formatPriceKopecks(d.payout_kopecks)} />
        <Card label="Возвраты" value={formatPriceKopecks(d.refund_kopecks)} />
        <Card label="В эскроу сейчас" value={formatPriceKopecks(d.held_kopecks)} />
      </div>
      <div style={{ marginTop: 18, maxWidth: 560 }}>
        <PdNotice kind={reconciles ? 'ok' : 'danger'}>
          {reconciles
            ? 'Сверка ledger сходится: held = GMV − комиссия − выплаты − возвраты.'
            : 'Расхождение в ledger! held ≠ GMV − комиссия − выплаты − возвраты. Заморозьте выплаты и проверьте (OPERATIONS §5).'}
        </PdNotice>
      </div>
      {d.deals_by_status && Object.keys(d.deals_by_status).length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 10px' }}>Сделки по статусам</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {Object.entries(d.deals_by_status).map(([s, n]) => (
              <div key={s} style={{ background: 'var(--pd-surface-2)', borderRadius: 10, padding: '8px 12px', fontSize: 13 }}>
                <b>{n}</b> <span style={{ color: 'var(--pd-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
