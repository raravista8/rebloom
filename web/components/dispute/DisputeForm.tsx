'use client';
// Открыть спор (FLOW-1 steps 1–2). Reason + details + evidence photos →
// POST /api/deals/{id}/dispute {reason, photo_ids[]}. Funds freeze (handled
// server-side). Reason is a single free string (combined category + details).
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdField, PdBtn, PdNotice } from '@/components/canon';
import { IconInfo } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import PhotoUploader from '@/components/sell/PhotoUploader';
import { api, ApiError } from '@/lib/api';

const REASONS: [string, string][] = [
  ['not_received', 'Не получил(а) букет'],
  ['mismatch', 'Не соответствует — несвежий, вялый или не тот'],
  ['damaged', 'Повреждён'],
  ['no_contact', 'Продавец не выходит на связь'],
  ['other', 'Другое'],
];

export default function DisputeForm({ id }: { id: string }) {
  const router = useRouter();
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [reasonErr, setReasonErr] = useState<string | undefined>();
  const [err, setErr] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    setReasonErr(undefined);
    setErr(undefined);
    if (!reason) {
      setReasonErr('Выберите причину');
      return;
    }
    const label = REASONS.find(([k]) => k === reason)?.[1] ?? reason;
    const composed = details.trim() ? `${label} — ${details.trim()}` : label;
    setSubmitting(true);
    try {
      await api.post(`/deals/${id}/dispute`, { reason: composed, photo_ids: photoIds });
      router.replace(`/deal/${id}`);
    } catch (e) {
      if (e instanceof ApiError && e.code === 'content_blocked') setErr('В описании есть запрещённые слова или контакты. Поправьте, пожалуйста.');
      else if (e instanceof ApiError && e.code === 'unauthorized') router.replace('/login');
      else setErr(e instanceof ApiError ? e.message : 'Не удалось открыть спор');
    } finally {
      setSubmitting(false);
    }
  }, [id, reason, details, photoIds, router]);

  const footer = (
    <div className="pd-footerbar">
      {err && <div style={{ marginBottom: 8 }}><PdNotice kind="danger">{err}</PdNotice></div>}
      <PdBtn variant="primary" block lg loading={submitting} disabled={submitting} onClick={submit}>
        Открыть спор
      </PdBtn>
    </div>
  );

  return (
    <ScreenChrome title="Открыть спор" footer={footer}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PdNotice kind="info" icon={IconInfo}>
          Пока идёт спор, деньги заморожены и в безопасности. Поддержка разберётся в течение 24 часов.
        </PdNotice>

        <PdField label="Что случилось?" error={reasonErr}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REASONS.map(([k, label]) => (
              <label key={k} className={`pd-check${reason === k ? ' on' : ''}`} style={{ alignItems: 'flex-start' }}>
                <input
                  type="radio"
                  name="reason"
                  checked={reason === k}
                  onChange={() => {
                    setReason(k);
                    setReasonErr(undefined);
                  }}
                  style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                />
                <span className="box" style={{ borderRadius: '50%' }}>{reason === k && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pd-primary)', display: 'block', margin: 'auto' }} />}</span>
                <span className="t">{label}</span>
              </label>
            ))}
          </div>
        </PdField>

        <PdField label="Подробности" opt="необязательно" hint="Опишите, что не так. Не указывайте телефон или мессенджеры.">
          <div className="pd-input">
            <textarea
              rows={3}
              placeholder="Например: букет завял к вечеру, лепестки осыпались"
              value={details}
              maxLength={2000}
              onChange={(e) => setDetails(e.target.value)}
              aria-label="Подробности"
            />
          </div>
        </PdField>

        <PdField label="Фото-доказательства" opt="необязательно" hint="1–5 фото помогут поддержке быстрее принять решение.">
          <PhotoUploader onPhotoIds={setPhotoIds} />
        </PdField>
      </div>
    </ScreenChrome>
  );
}
