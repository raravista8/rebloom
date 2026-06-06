'use client';
// Сделка — no-escrow «оплата при встрече» (ADR-0013). GET /api/deals/{id}; status-driven
// UI + deal chat. agreed → meeting → done (+ problem, cancelled). Seller shares the
// pickup point (→ meeting); buyer confirms receipt (→ done); either party reports a
// problem or cancels. The platform processes no payment — people pay at the meeting.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdStepper, PdNotice, PdBtn, PdField } from '@/components/canon';
import { IconCheck, IconWalk, IconInfo, IconPin } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import DealChat from '@/components/deal/DealChat';
import { api, ApiError } from '@/lib/api';
import { reachGoal } from '@/lib/ym';
import { formatPriceKopecks } from '@/lib/format';
import type { DealView, DealStatus } from '@/lib/types';

const STATUS_LABEL: Record<DealStatus, string> = {
  agreed: 'договорились',
  meeting: 'встреча',
  done: 'завершено',
  problem: 'жалоба',
  cancelled: 'отменено',
};

function DealMini({ deal }: { deal: DealView }) {
  const cp = deal.counterparty;
  const meta = [
    `${deal.role === 'buyer' ? 'Продавец' : 'Покупатель'}${cp.display_name ? ` ${cp.display_name}` : ''}`,
    cp.seller_rating != null ? `${cp.seller_rating.toFixed(1)} ★` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--pd-border)', background: 'var(--pd-surface)' }}>
      {deal.listing.photo_thumb_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={deal.listing.photo_thumb_url} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--pd-surface-2)', flex: 'none' }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Букет</div>
        <div style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginTop: 2 }}>{meta}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {deal.listing.price_kopecks != null && (
          <div className="pd-price" style={{ fontSize: 16 }}>{formatPriceKopecks(deal.listing.price_kopecks)}</div>
        )}
        <div style={{ fontSize: 11, color: 'var(--pd-muted)' }}>{STATUS_LABEL[deal.status]}</div>
      </div>
    </div>
  );
}

// Revealed pickup address (after the seller shared the point → meeting, T-13).
function DeliveryCard({ dealId }: { dealId: string }) {
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    api
      .get<{ revealed: boolean; address: string | null }>(`/deals/${dealId}/delivery`)
      .then((d) => alive && setAddress(d.revealed ? d.address : null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [dealId]);
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--pd-border)', borderRadius: 13 }}>
        <IconWalk className="pd-i20" style={{ color: 'var(--pd-primary)', flex: 'none' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>Самовывоз</div>
          <div style={{ fontSize: 12, color: 'var(--pd-muted)' }}>
            {address ?? 'Точное место появится здесь, когда продавец им поделится.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Seller shares the pickup point (address) → meeting.
function SharePointForm({ dealId, onDone }: { dealId: string; onDone: (d: DealView) => void }) {
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const submit = useCallback(async () => {
    if (!address.trim()) {
      setErr('Укажите место встречи');
      return;
    }
    setBusy(true);
    setErr(undefined);
    try {
      onDone((await api.post<{ deal: DealView }>(`/deals/${dealId}/share-point`, { address: address.trim() })).deal);
    } catch {
      setErr('Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  }, [address, dealId, onDone]);
  return (
    <div style={{ padding: '4px 16px 12px' }}>
      <PdField label="Место встречи для самовывоза" error={err}>
        <div className="pd-input">
          <input
            value={address}
            maxLength={400}
            placeholder="Двор, подъезд или станция метро рядом"
            onChange={(e) => setAddress(e.target.value)}
            aria-label="Место встречи"
          />
        </div>
      </PdField>
      <div style={{ marginTop: 10 }}>
        <PdBtn variant="primary" icon={IconPin} block loading={busy} disabled={busy} onClick={submit}>
          Поделиться местом встречи
        </PdBtn>
      </div>
    </div>
  );
}

export default function DealScreen({ id }: { id: string }) {
  const [deal, setDeal] = useState<DealView | null>(null);
  const [phase, setPhase] = useState<'loading' | 'loaded' | 'not_found' | 'error'>('loading');
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      setDeal((await api.get<{ deal: DealView }>(`/deals/${id}`)).deal);
      setPhase('loaded');
    } catch (e) {
      setPhase(e instanceof ApiError && (e.code === 'not_found' || e.code === 'forbidden') ? 'not_found' : 'error');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmReceipt = useCallback(async () => {
    setActing(true);
    try {
      setDeal((await api.post<{ deal: DealView }>(`/deals/${id}/confirm-receipt`)).deal);
      reachGoal('deal_done');
    } catch {
      /* keep current state */
    } finally {
      setActing(false);
    }
  }, [id]);

  const cancelDeal = useCallback(async () => {
    setActing(true);
    try {
      setDeal((await api.post<{ deal: DealView }>(`/deals/${id}/cancel`, {})).deal);
    } catch {
      /* keep current state */
    } finally {
      setActing(false);
    }
  }, [id]);

  if (phase === 'loading') {
    return (
      <ScreenChrome title="Сделка">
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="pd-sk" style={{ height: 40 }} />
          <div className="pd-sk" style={{ height: 64 }} />
          <div className="pd-sk" style={{ height: 64 }} />
        </div>
      </ScreenChrome>
    );
  }
  if (phase === 'not_found' || !deal) {
    return (
      <ScreenChrome title="Сделка">
        <div style={{ padding: '48px 20px' }}>
          <PdNotice kind="info" icon={IconInfo}>Сделка не найдена или у вас нет к ней доступа.</PdNotice>
          <div style={{ marginTop: 16 }}>
            <Link href="/deals"><PdBtn variant="secondary" block>Мои сделки</PdBtn></Link>
          </div>
        </div>
      </ScreenChrome>
    );
  }
  if (phase === 'error') {
    return (
      <ScreenChrome title="Сделка">
        <div style={{ padding: '48px 20px', textAlign: 'center' }}>
          <PdNotice kind="danger">Не удалось загрузить сделку.</PdNotice>
          <div style={{ marginTop: 16 }}><PdBtn variant="primary" onClick={load}>Повторить</PdBtn></div>
        </div>
      </ScreenChrome>
    );
  }

  const { status } = deal;
  const isBuyer = deal.role === 'buyer';
  const open = status === 'agreed' || status === 'meeting';

  let footer: React.ReactNode = null;
  if (open && isBuyer) {
    footer = (
      <div className="pd-footerbar">
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/deal/${id}/dispute/new`} style={{ flex: 1 }}>
            <PdBtn variant="secondary" block>Проблема</PdBtn>
          </Link>
          <PdBtn variant="primary" icon={IconCheck} loading={acting} disabled={acting} onClick={confirmReceipt} style={{ flex: 1.5 }}>
            Подтвердить получение
          </PdBtn>
        </div>
      </div>
    );
  } else if (status === 'meeting' && !isBuyer) {
    footer = (
      <div className="pd-footerbar">
        <Link href={`/deal/${id}/dispute/new`}><PdBtn variant="secondary" block>Проблема со сделкой</PdBtn></Link>
      </div>
    );
  } else if (status === 'done') {
    footer = (
      <div className="pd-footerbar">
        <Link href={`/deal/${id}/review`}>
          <PdBtn variant="primary" block lg>Оценить {isBuyer ? 'продавца' : 'покупателя'}</PdBtn>
        </Link>
      </div>
    );
  } else if (status === 'cancelled') {
    footer = (
      <div className="pd-footerbar">
        <Link href="/"><PdBtn variant="secondary" block>Смотреть свежие букеты</PdBtn></Link>
      </div>
    );
  }

  const hasChat = open || status === 'problem';

  return (
    <ScreenChrome title={status === 'problem' ? 'Жалоба по сделке' : 'Сделка'} footer={footer}>
      {status !== 'cancelled' && (
        <div style={{ padding: '14px 16px 4px' }}><PdStepper status={status} /></div>
      )}
      <DealMini deal={deal} />

      <div style={{ padding: '14px 16px' }}>
        {status === 'agreed' && (
          <PdNotice kind="info" icon={IconInfo}>
            <b>Договоритесь о встрече в чате.</b> Оплата — при встрече, наличными или переводом. Площадка денег не удерживает.
          </PdNotice>
        )}
        {status === 'meeting' && (
          <PdNotice kind="ok" icon={IconWalk}>
            <b>Встреча назначена.</b> Заберите букет и оплатите продавцу при встрече. После — нажмите «Подтвердить получение».
          </PdNotice>
        )}
        {status === 'problem' && (
          <PdNotice kind="warn" icon={IconInfo}>
            <b>Жалоба на рассмотрении.</b> Поддержка ответит в течение 24 часов. Добавьте детали и фото в чат.
          </PdNotice>
        )}
        {status === 'done' && (
          <PdNotice kind="ok" icon={IconCheck}>
            <b>Готово!</b> Вы забрали букет. Спасибо! Оставьте отзыв {isBuyer ? 'продавцу' : 'покупателю'}.
          </PdNotice>
        )}
        {status === 'cancelled' && (
          <PdNotice kind="info" icon={IconInfo}>Сделка отменена, букет снова доступен другим покупателям.</PdNotice>
        )}
      </div>

      {status === 'agreed' && !isBuyer && <SharePointForm dealId={id} onDone={setDeal} />}
      {status === 'meeting' && deal.delivery_method === 'self_pickup' && <DeliveryCard dealId={id} />}

      {open && (
        <div style={{ padding: '0 16px 8px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={cancelDeal}
            disabled={acting}
            style={{ background: 'none', border: 'none', color: 'var(--pd-muted)', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}
          >
            Отменить сделку
          </button>
        </div>
      )}

      {hasChat && <DealChat dealId={id} />}
    </ScreenChrome>
  );
}
