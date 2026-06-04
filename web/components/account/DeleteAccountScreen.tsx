'use client';
// Удаление аккаунта (DSR, ФЗ-152, FLOW-9). POST /api/me/delete {confirm:true} →
// soft-disable now + scheduled anonymization. Ledger kept (legal). Button enabled
// by default; a confirm checkbox guards the destructive action.
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PdBtn, PdNotice } from '@/components/canon';
import { IconCheck, IconInfo } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { api, ApiError } from '@/lib/api';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    if (!agree) {
      setAgreeErr(true);
      return;
    }
    setBusy(true);
    setErr(undefined);
    try {
      await api.post('/me/delete', { confirm: true });
      setDone(true);
    } catch (e) {
      if (e instanceof ApiError && e.code === 'unauthorized') router.replace('/login');
      else setErr(e instanceof ApiError ? e.message : 'Не удалось выполнить запрос');
    } finally {
      setBusy(false);
    }
  }, [agree, router]);

  if (done) {
    return (
      <ScreenChrome title="Аккаунт" footer={<div className="pd-footerbar"><Link href="/login"><PdBtn variant="primary" block lg>Понятно</PdBtn></Link></div>}>
        <div className="pd-empty" style={{ height: 'auto', paddingTop: 54 }}>
          <div className="glyph" style={{ color: 'var(--pd-fresh)' }}><IconCheck className="pd-i28" /></div>
          <h3>Аккаунт отключён</h3>
          <p>Профиль скрыт прямо сейчас. Личные данные удалим в установленный срок; записи по платежам сохраняются по закону обезличенными.</p>
        </div>
      </ScreenChrome>
    );
  }

  const footer = (
    <div className="pd-footerbar">
      {err && <div style={{ marginBottom: 8 }}><PdNotice kind="danger">{err}</PdNotice></div>}
      <PdBtn variant="danger" block lg loading={busy} disabled={busy} onClick={submit}>
        Удалить аккаунт
      </PdBtn>
    </div>
  );

  return (
    <ScreenChrome title="Удалить аккаунт" footer={footer}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PdNotice kind="warn" icon={IconInfo}>
          Это действие нельзя отменить. Профиль и объявления будут скрыты сразу, личные данные — удалены в установленный срок.
        </PdNotice>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--pd-text)' }}>
          <p style={{ marginTop: 0 }}>Что произойдёт:</p>
          <ul style={{ paddingLeft: 18, margin: 0, color: 'var(--pd-muted)' }}>
            <li>профиль и активные объявления скрываются немедленно;</li>
            <li>имя, телефон и фото удаляются/обезличиваются по сроку хранения;</li>
            <li>записи о платежах сохраняются обезличенными — этого требует закон.</li>
          </ul>
        </div>
        <label className={`pd-check${agree ? ' on' : ''}`}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              if (e.target.checked) setAgreeErr(false);
            }}
            style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
          />
          <span className="box">{agree && <IconCheck className="pd-i16" />}</span>
          <span className="t">Понимаю последствия и хочу удалить аккаунт.</span>
        </label>
        {agreeErr && <p style={{ color: 'var(--pd-danger)', fontSize: 13, marginTop: -8 }}>Подтвердите согласие, чтобы продолжить.</p>}
      </div>
    </ScreenChrome>
  );
}
