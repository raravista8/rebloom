'use client';
// Пожаловаться (FLOW-10, FR-064). POST /api/reports {target_type, target_id, reason}.
// → moderation/abuse queue. Reason = category + optional comment (single string).
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PdField, PdBtn, PdNotice } from '@/components/canon';
import { IconCheck, IconInfo } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { api, ApiError } from '@/lib/api';

const REASONS: Record<'listing' | 'user', [string, string][]> = {
  listing: [
    ['scam', 'Обман или мошенничество'],
    ['not_fresh', 'Несвежие цветы / фото не соответствует'],
    ['stolen_photo', 'Чужие фотографии'],
    ['contacts', 'Контакты / увод из безопасной сделки'],
    ['prohibited', 'Запрещённый товар'],
    ['other', 'Другое'],
  ],
  user: [
    ['scam', 'Мошенничество'],
    ['rude', 'Грубость или оскорбления'],
    ['spam', 'Спам'],
    ['other', 'Другое'],
  ],
};

export default function ReportScreen({
  targetType,
  targetId,
  backHref,
}: {
  targetType: 'listing' | 'user';
  targetId: string;
  backHref: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [reasonErr, setReasonErr] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    if (!reason) {
      setReasonErr(true);
      return;
    }
    const label = REASONS[targetType].find(([k]) => k === reason)?.[1] ?? reason;
    const composed = comment.trim() ? `${label} — ${comment.trim()}` : label;
    setBusy(true);
    setErr(undefined);
    try {
      await api.post('/reports', { target_type: targetType, target_id: targetId, reason: composed });
      setDone(true);
    } catch (e) {
      if (e instanceof ApiError && e.code === 'unauthorized') router.replace('/login');
      else setErr(e instanceof ApiError ? e.message : 'Не удалось отправить жалобу');
    } finally {
      setBusy(false);
    }
  }, [reason, comment, targetType, targetId, router]);

  if (done) {
    return (
      <ScreenChrome title="Жалоба" footer={<div className="pd-footerbar"><Link href={backHref}><PdBtn variant="primary" block lg>Готово</PdBtn></Link></div>}>
        <div className="pd-empty" style={{ height: 'auto', paddingTop: 54 }}>
          <div className="glyph" style={{ color: 'var(--pd-fresh)' }}><IconCheck className="pd-i28" /></div>
          <h3>Спасибо, мы проверим</h3>
          <p>Жалоба передана модераторам. Если нарушение подтвердится, мы примем меры. Спасибо, что помогаете площадке быть безопаснее.</p>
        </div>
      </ScreenChrome>
    );
  }

  const footer = (
    <div className="pd-footerbar">
      {err && <div style={{ marginBottom: 8 }}><PdNotice kind="danger">{err}</PdNotice></div>}
      <PdBtn variant="primary" block lg loading={busy} disabled={busy} onClick={submit}>
        Отправить жалобу
      </PdBtn>
    </div>
  );

  return (
    <ScreenChrome title="Пожаловаться" footer={footer}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PdNotice kind="info" icon={IconInfo}>
          Расскажите, что не так. Жалобы анонимны для {targetType === 'listing' ? 'продавца' : 'пользователя'} и помогают модерации.
        </PdNotice>
        <PdField label="Причина" error={reasonErr ? 'Выберите причину' : undefined}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REASONS[targetType].map(([k, label]) => (
              <label key={k} className={`pd-check${reason === k ? ' on' : ''}`} style={{ alignItems: 'flex-start' }}>
                <input
                  type="radio"
                  name="reason"
                  checked={reason === k}
                  onChange={() => {
                    setReason(k);
                    setReasonErr(false);
                  }}
                  style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                />
                <span className="box" style={{ borderRadius: '50%' }}>{reason === k && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pd-primary)', display: 'block', margin: 'auto' }} />}</span>
                <span className="t">{label}</span>
              </label>
            ))}
          </div>
        </PdField>
        <PdField label="Комментарий" opt="необязательно">
          <div className="pd-input">
            <textarea rows={3} placeholder="Подробности (без телефонов и ссылок)" value={comment} maxLength={2000} onChange={(e) => setComment(e.target.value)} aria-label="Комментарий" />
          </div>
        </PdField>
      </div>
    </ScreenChrome>
  );
}
