'use client';
// Антифрод — GET /api/admin/fraud (FR-073). Signals with risk score + evidence.
import { useCallback, useEffect, useState } from 'react';
import { PdNotice } from '@/components/canon';
import { api } from '@/lib/api';

interface Signal {
  id?: string;
  type: string;
  score: number;
  status: string;
  user_id?: string;
  evidence?: unknown;
  created_at?: string;
}

const TYPE_LABEL: Record<string, string> = {
  multi_account: 'Мульти-аккаунт по IP/устройству',
  self_dealing: 'Накрутка отзывов / self-dealing',
  velocity: 'Аномальная активность (velocity)',
  price_anomaly: 'Ценовая аномалия',
  photo_reuse: 'Переиспользование фото',
  payout_concentration: 'Концентрация выплат',
  dispute_spike: 'Всплеск споров',
  geo_mismatch: 'Гео-несоответствие',
};

export default function AdminFraud() {
  const [items, setItems] = useState<Signal[]>([]);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const res = await api.get<{ items: Signal[] }>('/admin/fraud');
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
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Антифрод</h1>
      {phase === 'loading' && <div style={{ color: 'var(--pd-muted)' }}>Загрузка…</div>}
      {phase === 'error' && <PdNotice kind="danger">Не удалось загрузить сигналы.</PdNotice>}
      {phase === 'ready' && items.length === 0 && <PdNotice kind="ok">Подозрительной активности не обнаружено. 🌿</PdNotice>}
      {phase === 'ready' &&
        items.map((s, i) => (
          <div key={s.id ?? i} style={{ background: 'var(--pd-surface)', border: '1px solid var(--pd-border)', borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ minWidth: 56, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.score >= 70 ? 'var(--pd-danger)' : s.score >= 40 ? 'var(--pd-warn)' : 'var(--pd-muted)' }}>{s.score}</div>
              <div style={{ fontSize: 10.5, color: 'var(--pd-muted)' }}>риск</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{TYPE_LABEL[s.type] ?? s.type}</div>
              <div style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginTop: 2 }}>
                {s.user_id ? `Пользователь ${s.user_id.slice(0, 8)} · ` : ''}статус: {s.status}
                {s.evidence ? ` · ${typeof s.evidence === 'string' ? s.evidence : JSON.stringify(s.evidence)}` : ''}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
