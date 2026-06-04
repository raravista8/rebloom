'use client';
// Жалобы — GET /api/admin/reports (FR-064). User reports on listings/users.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdNotice } from '@/components/canon';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';

interface Report {
  id?: string;
  target_type: string;
  target_id?: string;
  reason: string;
  status: string;
  created_at?: string;
}

export default function AdminReports() {
  const [items, setItems] = useState<Report[]>([]);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const res = await api.get<{ items: Report[] }>('/admin/reports');
      setItems(res.items);
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Жалобы</h1>
      {phase === 'loading' && <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>}
      {phase === 'error' && <PdNotice kind="danger">Не удалось загрузить жалобы.</PdNotice>}
      {phase === 'ready' && items.length === 0 && <PdNotice kind="ok">Новых жалоб нет. 🌿</PdNotice>}
      {phase === 'ready' &&
        items.map((r, i) => {
          const href = r.target_id ? (r.target_type === 'listing' ? `/l/${r.target_id}` : `/u/${r.target_id}`) : null;
          return (
            <div key={r.id ?? i} style={{ background: 'var(--pd-surface)', border: '1px solid var(--pd-border)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--pd-muted)', marginBottom: 6 }}>
                <span>{r.target_type === 'listing' ? 'Объявление' : 'Пользователь'} · {r.status}</span>
                <span>{r.created_at ? formatDate(r.created_at) : ''}</span>
              </div>
              <div style={{ fontSize: 14 }}>{r.reason}</div>
              {href && (
                <div style={{ marginTop: 8 }}>
                  <Link href={href} className="pd-link">Открыть {r.target_type === 'listing' ? 'объявление' : 'профиль'} →</Link>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
