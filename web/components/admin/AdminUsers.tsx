'use client';
// Пользователи — GET /api/admin/users?q= search + block/unblock (reason → audit,
// T-16). FR-071/072. ПДн-доступ is logged server-side.
import { useCallback, useEffect, useState } from 'react';
import { PdNotice } from '@/components/canon';
import { api } from '@/lib/api';
import { cityName } from '@/lib/cities';

interface AdminUserRow {
  id: string;
  display_name: string;
  phone_masked?: string;
  city_id?: string;
  status: string;
  seller_rating?: number;
  listings_count?: number;
  last_ip?: string;
  multi_account_flag?: boolean;
}

const STATUS_COLOR: Record<string, string> = { active: 'var(--pd-fresh)', limited: 'var(--pd-warn)', blocked: 'var(--pd-danger)', deleted: 'var(--pd-muted)' };

export default function AdminUsers() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [acting, setActing] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const load = useCallback(async (query: string) => {
    setPhase('loading');
    try {
      const res = await api.get<{ items: AdminUserRow[] }>(`/admin/users${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
      setRows(res.items);
      setPhase('ready');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(q), 300);
    return () => clearTimeout(t);
  }, [q, load]);

  async function toggleBlock(u: AdminUserRow) {
    const blocking = u.status !== 'blocked';
    if (blocking && acting !== u.id) {
      setActing(u.id);
      setReason('');
      return;
    }
    try {
      await api.post(`/admin/users/${u.id}/${blocking ? 'block' : 'unblock'}`, { reason: reason.trim() || 'Нарушение правил' });
      setRows((prev) => prev.map((r) => (r.id === u.id ? { ...r, status: blocking ? 'blocked' : 'active' } : r)));
    } catch {
      /* ignore */
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Пользователи</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по имени, телефону или id"
        style={{ width: '100%', maxWidth: 440, padding: '10px 14px', border: '1px solid var(--pd-border-strong)', borderRadius: 12, fontSize: 14, background: 'var(--pd-surface)', marginBottom: 16 }}
      />
      {phase === 'loading' && <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>}
      {phase === 'error' && <PdNotice kind="danger">Не удалось загрузить пользователей.</PdNotice>}
      {phase === 'ready' && rows.length === 0 && <PdNotice kind="info">Никого не найдено.</PdNotice>}
      {phase === 'ready' && rows.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid var(--pd-border)', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--pd-muted)', fontSize: 12 }}>
                {['Имя', 'Город', 'Статус', 'Рейтинг', 'Объявл.', 'IP', ''].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', borderBottom: '1px solid var(--pd-border)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--pd-border)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.display_name}{u.multi_account_flag && <span title="Несколько аккаунтов с этим IP" style={{ marginLeft: 6, color: 'var(--pd-warn)' }}>⚑</span>}</td>
                  <td style={{ padding: '10px 12px' }}>{u.city_id ? cityName(u.city_id) : '—'}</td>
                  <td style={{ padding: '10px 12px', color: STATUS_COLOR[u.status] ?? 'var(--pd-text)', fontWeight: 600 }}>{u.status}</td>
                  <td style={{ padding: '10px 12px' }}>{u.seller_rating != null ? u.seller_rating.toFixed(1) : '—'}</td>
                  <td style={{ padding: '10px 12px' }}>{u.listings_count ?? 0}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--pd-muted)' }}>{u.last_ip ?? '—'}</td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    {acting === u.id ? (
                      <span style={{ display: 'inline-flex', gap: 6 }}>
                        <input autoFocus value={reason} onChange={(e) => setReason(e.target.value)} placeholder="причина" style={{ padding: '4px 8px', border: '1px solid var(--pd-border-strong)', borderRadius: 8, fontSize: 12.5, width: 130 }} />
                        <button onClick={() => toggleBlock(u)} style={{ color: 'var(--pd-danger)', fontWeight: 700, background: 'none', border: 0, cursor: 'pointer' }}>OK</button>
                      </span>
                    ) : (
                      <button onClick={() => toggleBlock(u)} style={{ color: u.status === 'blocked' ? 'var(--pd-fresh)' : 'var(--pd-danger)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}>
                        {u.status === 'blocked' ? 'Разблокировать' : 'Блокировать'}
                      </button>
                    )}
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
