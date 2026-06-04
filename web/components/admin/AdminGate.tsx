'use client';
// Admin access gate. /admin requires admin/moderator role + TOTP 2FA (OPERATIONS §6).
// whoami succeeds only when both hold; otherwise we check /me to decide between a
// 2FA prompt (staff) and access-denied (regular user) or login (anonymous).
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdBtn, PdNotice } from '@/components/canon';
import AdminShell from '@/components/admin/AdminShell';
import { api, ApiError } from '@/lib/api';
import type { User } from '@/lib/types';

const STAFF = ['admin', 'moderator', 'support', 'analyst'];

function Admin2FA({ onVerified }: { onVerified: () => void }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const ref = useRef<HTMLInputElement>(null);

  async function verify() {
    if (code.length < 6 || busy) return;
    setBusy(true);
    setErr(undefined);
    try {
      await api.post('/admin/2fa/verify', { code });
      onVerified();
    } catch (e) {
      setErr(e instanceof ApiError && e.code === 'validation_error' ? 'Неверный код. Попробуйте ещё раз.' : 'Не удалось подтвердить.');
      setCode('');
      ref.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '12vh auto', padding: 24, textAlign: 'center' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Передарим · админка</h1>
      <p style={{ color: 'var(--pd-muted)', marginBottom: 22 }}>Введите код из приложения-аутентификатора.</p>
      <input
        ref={ref}
        autoFocus
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => e.key === 'Enter' && verify()}
        aria-label="Код 2FA"
        style={{ width: '100%', textAlign: 'center', letterSpacing: 8, fontSize: 24, padding: '12px 0', border: '1px solid var(--pd-border-strong)', borderRadius: 12, background: 'var(--pd-surface)', marginBottom: 14 }}
      />
      {err && <div style={{ marginBottom: 12 }}><PdNotice kind="danger">{err}</PdNotice></div>}
      <PdBtn variant="primary" block lg loading={busy} disabled={busy} onClick={verify}>Войти</PdBtn>
    </div>
  );
}

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<'checking' | 'need_2fa' | 'denied' | 'ok'>('checking');

  const check = useCallback(async () => {
    try {
      await api.get('/admin/whoami');
      setPhase('ok');
      return;
    } catch {
      /* fall through to role check */
    }
    try {
      const me = await api.get<User>('/me');
      setPhase(me.roles.some((r) => STAFF.includes(r)) ? 'need_2fa' : 'denied');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'unauthorized') router.replace('/login?next=%2Fadmin');
      else setPhase('denied');
    }
  }, [router]);

  useEffect(() => {
    void check();
  }, [check]);

  if (phase === 'checking') {
    return <div style={{ padding: 64, textAlign: 'center', color: 'var(--pd-muted)' }}>Загрузка…</div>;
  }
  if (phase === 'denied') {
    return (
      <div style={{ maxWidth: 380, margin: '14vh auto', padding: 24, textAlign: 'center' }}>
        <PdNotice kind="danger">Доступ к админке только для модераторов и администраторов.</PdNotice>
      </div>
    );
  }
  if (phase === 'need_2fa') return <Admin2FA onVerified={check} />;
  return <AdminShell>{children}</AdminShell>;
}
