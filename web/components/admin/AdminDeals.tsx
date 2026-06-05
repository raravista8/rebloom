'use client';
// Сделки — GET /api/admin/deals (status filter) + report resolution
// (done/cancelled → POST /api/admin/deals/{id}/resolve, reason → audit). No-escrow
// (ADR-0013): no money moves, no 4-eyes. FLOW-1 step 4.
import { useCallback, useEffect, useState } from 'react';
import { PdNotice } from '@/components/canon';
import { api } from '@/lib/api';
import { formatPriceKopecks, formatDate } from '@/lib/format';
import type { DealView, DealStatus } from '@/lib/types';

const STATUSES: (DealStatus | 'all')[] = ['all', 'agreed', 'meeting', 'problem', 'done', 'cancelled'];
const LABEL: Record<string, string> = {
  all: 'Все', agreed: 'договорились', meeting: 'встреча', done: 'завершена', problem: 'жалоба', cancelled: 'отменена',
};
const COLOR: Record<string, string> = {
  meeting: 'var(--pd-primary)', done: 'var(--pd-fresh)', problem: 'var(--pd-warn)', cancelled: 'var(--pd-muted)', agreed: 'var(--pd-muted)',
};

function ResolveRow({ deal, onResolved }: { deal: DealView; onResolved: (d: DealView) => void }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'done' | 'cancelled'>('done');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | undefined>();

  async function submit() {
    if (!reason.trim()) {
      setErr('Укажите причину');
      return;
    }
    setBusy(true);
    setErr(undefined);
    try {
      const res = await api.post<{ deal: DealView }>(`/admin/deals/${deal.id}/resolve`, { action, reason: reason.trim() });
      onResolved(res.deal);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} style={{ color: 'var(--pd-primary)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}>Разрешить</button>;
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      <select value={action} onChange={(e) => setAction(e.target.value as typeof action)} style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid var(--pd-border-strong)', fontSize: 12.5 }}>
        <option value="done">Завершить (в пользу продавца)</option>
        <option value="cancelled">Отменить (в пользу покупателя)</option>
      </select>
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="причина" style={{ width: 140, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--pd-border-strong)', fontSize: 12.5 }} />
      <button onClick={submit} disabled={busy} style={{ color: 'var(--pd-on-primary)', background: 'var(--pd-primary)', border: 0, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>OK</button>
      {err && <span style={{ color: 'var(--pd-danger)', fontSize: 12 }}>{err}</span>}
    </div>
  );
}

export default function AdminDeals() {
  const [filter, setFilter] = useState<DealStatus | 'all'>('all');
  const [rows, setRows] = useState<DealView[]>([]);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async (f: DealStatus | 'all') => {
    setPhase('loading');
    try {
      const res = await api.get<{ items: DealView[] }>(`/admin/deals${f === 'all' ? '' : `?status=${f}`}`);
      setRows(res.items);
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Сделки</h1>
      <div className="pd-chiprow" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        {STATUSES.map((s) => (
          <button key={s} type="button" className={`pd-chip${filter === s ? ' pd-chip--on' : ''}`} onClick={() => setFilter(s)}>{LABEL[s]}</button>
        ))}
      </div>
      {phase === 'loading' && <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>}
      {phase === 'error' && <PdNotice kind="danger">Не удалось загрузить сделки.</PdNotice>}
      {phase === 'ready' && rows.length === 0 && <PdNotice kind="info">Сделок не найдено.</PdNotice>}
      {phase === 'ready' && rows.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid var(--pd-border)', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--pd-muted)', fontSize: 12 }}>
                {['Сделка', 'Статус', 'Цена', 'Дата', 'Действие'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', borderBottom: '1px solid var(--pd-border)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--pd-border)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>{d.id.slice(0, 8)}</td>
                  <td style={{ padding: '10px 12px', color: COLOR[d.status] ?? 'var(--pd-text)', fontWeight: 600 }}>{LABEL[d.status] ?? d.status}</td>
                  <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums' }}>{d.listing.price_kopecks != null ? formatPriceKopecks(d.listing.price_kopecks) : '—'}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--pd-muted)' }}>{d.created_at ? formatDate(d.created_at) : '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    {d.status === 'problem' ? <ResolveRow deal={d} onResolved={(nd) => setRows((p) => p.map((r) => (r.id === nd.id ? nd : r)))} /> : <span style={{ color: 'var(--pd-faint)' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
