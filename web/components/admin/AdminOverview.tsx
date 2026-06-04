'use client';
// Admin dashboard — KPIs from /api/admin/overview (FR-070): online/DAU/MAU, users,
// GMV + commission (from the append-only ledger), deals-by-status. Role+2FA gated.
import { useCallback, useEffect, useState } from 'react';
import { PdNotice } from '@/components/canon';
import { api } from '@/lib/api';
import { formatPriceKopecks } from '@/lib/format';
import { cityName } from '@/lib/cities';
import type { AdminOverview as Overview } from '@/lib/types';

function Kpi({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: 'var(--pd-surface)', border: '1px solid var(--pd-border)', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--pd-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const num = (n: number | undefined) => (n ?? 0).toLocaleString('ru-RU').replace(/,/g, ' ');

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      setData(await api.get<Overview>('/admin/overview'));
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (phase === 'loading') return <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>;
  if (phase === 'error' || !data) {
    return (
      <div style={{ maxWidth: 420 }}>
        <PdNotice kind="danger">Не удалось загрузить метрики.</PdNotice>
        <div style={{ marginTop: 12 }}><button className="pd-link" onClick={load}>Повторить</button></div>
      </div>
    );
  }

  const byStatus = data.deals_by_status ?? {};
  const byCity = data.users_by_city ?? {};
  const byPlatform = data.users_by_platform ?? {};

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>Обзор</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
        <Kpi label="Сейчас онлайн" value={num(data.online)} />
        <Kpi label="DAU" value={num(data.dau)} />
        <Kpi label="MAU" value={num(data.mau)} sub={data.mau ? `stickiness ${Math.round((data.dau / data.mau) * 100)}%` : undefined} />
        <Kpi label="Всего пользователей" value={num(data.users_total)} />
        <Kpi label="Оборот (GMV)" value={formatPriceKopecks(data.gmv_kopecks)} />
        <Kpi label="Комиссия" value={formatPriceKopecks(data.commission_kopecks)} />
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '26px 0 12px' }}>Сделки по статусам</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {Object.entries(byStatus).length === 0 && <span style={{ color: 'var(--pd-muted)', fontSize: 13 }}>Пока нет сделок.</span>}
        {Object.entries(byStatus).map(([s, n]) => (
          <div key={s} style={{ background: 'var(--pd-surface-2)', borderRadius: 10, padding: '8px 12px', fontSize: 13 }}>
            <b style={{ fontVariantNumeric: 'tabular-nums' }}>{num(n as number)}</b> <span style={{ color: 'var(--pd-muted)' }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginTop: 26 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Пользователи по городам</h2>
          {Object.entries(byCity).length === 0 ? (
            <span style={{ color: 'var(--pd-muted)', fontSize: 13 }}>—</span>
          ) : (
            Object.entries(byCity)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([c, n]) => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--pd-border)', fontSize: 13.5 }}>
                  <span>{cityName(c)}</span>
                  <b style={{ fontVariantNumeric: 'tabular-nums' }}>{num(n as number)}</b>
                </div>
              ))
          )}
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>По платформам</h2>
          {Object.entries(byPlatform).length === 0 ? (
            <span style={{ color: 'var(--pd-muted)', fontSize: 13 }}>—</span>
          ) : (
            Object.entries(byPlatform).map(([p, n]) => (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--pd-border)', fontSize: 13.5 }}>
                <span>{p}</span>
                <b style={{ fontVariantNumeric: 'tabular-nums' }}>{num(n as number)}</b>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
