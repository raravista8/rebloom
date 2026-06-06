'use client';
// Отзыв — mutual review after a released deal (FR-040). POST /api/deals/{id}/review
// {score, text}. Backend requires text (min 1 char) — so it's required here despite
// canon's «необязательно». Score via a controlled star input; text moderated
// server-side (content_blocked → inline). Mirrors canon's ReviewForm.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdField, PdBtn, PdNotice, PdAvatar } from '@/components/canon';
import { IconStar, IconInfo, IconCheck } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { api, ApiError } from '@/lib/api';
import { reachGoal } from '@/lib/ym';
import type { DealView } from '@/lib/types';

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" aria-label={`Оценка ${n}`} aria-pressed={n <= value} onClick={() => onChange(n)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 2, lineHeight: 0 }}>
          <IconStar className="pd-i28" style={{ color: n <= value ? 'var(--pd-aging)' : 'var(--pd-border-strong)' }} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ id }: { id: string }) {
  const router = useRouter();
  const [counterparty, setCounterparty] = useState<string>('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [score, setScore] = useState(5);
  const [text, setText] = useState('');
  const [scoreErr, setScoreErr] = useState<string | undefined>();
  const [textErr, setTextErr] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<'sent' | 'held' | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .get<{ deal: DealView }>(`/deals/${id}`)
      .then(({ deal: d }) => {
        if (!alive) return;
        setCounterparty(d.counterparty.display_name ?? '');
        setRole(d.role);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  const submit = useCallback(async () => {
    setScoreErr(undefined);
    setTextErr(undefined);
    let bad = false;
    if (score < 1 || score > 5) {
      setScoreErr('Поставьте оценку');
      bad = true;
    }
    if (!text.trim()) {
      setTextErr('Напишите пару слов об опыте');
      bad = true;
    }
    if (bad) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ moderation_status?: string }>(`/deals/${id}/review`, { score, text: text.trim() });
      setDone(res.moderation_status === 'held' ? 'held' : 'sent');
      reachGoal('review_left');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'content_blocked') setTextErr('В тексте есть запрещённые слова или контакты. Поправьте, пожалуйста.');
      else if (e instanceof ApiError && e.code === 'unauthorized') router.replace('/login');
      else setTextErr(e instanceof ApiError ? e.message : 'Не удалось отправить');
    } finally {
      setSubmitting(false);
    }
  }, [id, score, text, router]);

  if (done) {
    return (
      <ScreenChrome title="Отзыв" footer={<div className="pd-footerbar"><PdBtn variant="primary" block lg onClick={() => router.replace(`/deal/${id}`)}>Готово</PdBtn></div>}>
        <div className="pd-empty" style={{ height: 'auto', paddingTop: 54 }}>
          <div className="glyph" style={{ color: done === 'held' ? 'var(--pd-warn)' : 'var(--pd-fresh)' }}>
            {done === 'held' ? <IconInfo className="pd-i28" /> : <IconCheck className="pd-i28" />}
          </div>
          <h3>{done === 'held' ? 'Отзыв на проверке' : 'Спасибо за отзыв!'}</h3>
          <p>{done === 'held' ? 'Мы проверим текст и опубликуем его, если всё в порядке.' : 'Он помогает другим покупателям и поднимает честных продавцов в ленте.'}</p>
        </div>
      </ScreenChrome>
    );
  }

  const footer = (
    <div className="pd-footerbar">
      <PdBtn variant="primary" block lg loading={submitting} disabled={submitting} onClick={submit}>
        Отправить отзыв
      </PdBtn>
    </div>
  );

  return (
    <ScreenChrome title="Отзыв" footer={footer}>
      <div style={{ padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ textAlign: 'center' }}>
          <PdAvatar seller={{ n: counterparty || '—' }} size={56} />
          <div style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>
            Оцените {counterparty || (role === 'buyer' ? 'продавца' : 'покупателя')}
          </div>
          <div style={{ marginTop: 12 }}>
            <StarRating value={score} onChange={setScore} />
          </div>
          {scoreErr && <p style={{ color: 'var(--pd-danger)', fontSize: 13, marginTop: 8 }}>{scoreErr}</p>}
        </div>
        <PdField label="Отзыв" error={textErr}>
          <div className={`pd-input${textErr ? ' pd-input--invalid' : ''}`}>
            <textarea
              rows={4}
              placeholder="Свежий ли был букет? Как прошла встреча?"
              value={text}
              maxLength={2000}
              onChange={(e) => {
                setText(e.target.value);
                if (textErr) setTextErr(undefined);
              }}
              aria-label="Текст отзыва"
            />
          </div>
        </PdField>
        <PdNotice kind="info" icon={IconInfo}>Контакты и грубые слова в отзыве не пропустим — это публичный текст.</PdNotice>
      </div>
    </ScreenChrome>
  );
}
