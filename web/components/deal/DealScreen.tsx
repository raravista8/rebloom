'use client';
// Сделка — the escrow journey. GET /api/deals/{id}; status-driven UI + deal chat.
// Buyer confirms receipt (POST /confirm-receipt → released) or opens a dispute.
// Exact pickup address is revealed only after paid_held (T-13). Mirrors canon's
// Deal* screens. States loading/loaded/not_found/error.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdStepper, PdNotice, PdBtn } from '@/components/canon';
import { IconShield, IconCheck, IconWalk, IconInfo } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import DealChat from '@/components/deal/DealChat';
import { api, ApiError } from '@/lib/api';
import { formatPriceKopecks } from '@/lib/format';
import type { DealView, DealStatus } from '@/lib/types';

const STATUS_LABEL: Record<DealStatus, string> = {
  created: 'ожидает оплаты',
  paid_held: 'в эскроу',
  released: 'завершено',
  refunded: 'возврат',
  disputed: 'заморожено',
  cancelled: 'отменено',
};

function DealMini({ deal }: { deal: DealView }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--pd-border)', background: 'var(--pd-surface)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={deal.listing.photo_thumb_url} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Букет</div>
        <div style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginTop: 2 }}>
          {deal.role === 'buyer' ? 'Продавец' : 'Покупатель'} {deal.counterparty.display_name} · {deal.counterparty.seller_rating.toFixed(1)} ★
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="pd-price" style={{ fontSize: 16 }}>{formatPriceKopecks(deal.amount_kopecks)}</div>
        <div style={{ fontSize: 11, color: 'var(--pd-muted)' }}>{STATUS_LABEL[deal.status]}</div>
      </div>
    </div>
  );
}

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
            {address ?? 'Точный адрес появится в чате — его укажет продавец.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DealScreen({ id }: { id: string }) {
  const [deal, setDeal] = useState<DealView | null>(null);
  const [phase, setPhase] = useState<'loading' | 'loaded' | 'not_found' | 'error'>('loading');
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      setDeal(await api.get<DealView>(`/deals/${id}`));
      setPhase('loaded');
    } catch (e) {
      setPhase(e instanceof ApiError && (e.code === 'not_found' || e.code === 'forbidden') ? 'not_found' : 'error');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmReceipt = useCallback(async () => {
    setConfirming(true);
    try {
      setDeal(await api.post<DealView>(`/deals/${id}/confirm-receipt`));
    } catch {
      /* keep current state; money stays held (fail-secure) */
    } finally {
      setConfirming(false);
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
  const sellerAmount = deal.amount_kopecks - deal.commission_kopecks;

  let footer: React.ReactNode = null;
  if (status === 'paid_held' && isBuyer) {
    footer = (
      <div className="pd-footerbar">
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/deal/${id}/dispute/new`} style={{ flex: 1 }}>
            <PdBtn variant="secondary" block>Проблема</PdBtn>
          </Link>
          <PdBtn variant="primary" icon={IconCheck} loading={confirming} disabled={confirming} onClick={confirmReceipt} style={{ flex: 1.5 }}>
            Подтвердить получение
          </PdBtn>
        </div>
      </div>
    );
  } else if (status === 'released') {
    footer = (
      <div className="pd-footerbar">
        <Link href={`/deal/${id}/review`}>
          <PdBtn variant="primary" block lg>Оценить {isBuyer ? 'продавца' : 'покупателя'}</PdBtn>
        </Link>
      </div>
    );
  } else if (status === 'paid_held' && !isBuyer) {
    footer = (
      <div className="pd-footerbar">
        <Link href={`/deal/${id}/dispute/new`}><PdBtn variant="secondary" block>Открыть спор</PdBtn></Link>
      </div>
    );
  } else if (status === 'refunded' || status === 'cancelled') {
    footer = (
      <div className="pd-footerbar">
        <Link href="/"><PdBtn variant="secondary" block>Смотреть свежие букеты</PdBtn></Link>
      </div>
    );
  }

  const stepperStatus = status === 'refunded' || status === 'cancelled' ? 'disputed' : status;
  const hasChat = status === 'paid_held' || status === 'disputed';

  return (
    <ScreenChrome title={status === 'disputed' ? 'Спор по сделке' : 'Сделка'} footer={footer}>
      {status !== 'cancelled' && status !== 'refunded' && (
        <div style={{ padding: '14px 16px 4px' }}><PdStepper status={stepperStatus} /></div>
      )}
      <DealMini deal={deal} />

      <div style={{ padding: '14px 16px' }}>
        {status === 'paid_held' && (
          <PdNotice kind="ok" icon={IconShield}>
            <b>Деньги в безопасности.</b> {deal.counterparty.display_name} получит {formatPriceKopecks(sellerAmount)} после того, как
            покупатель подтвердит получение. Комиссия площадки {formatPriceKopecks(deal.commission_kopecks)}.
          </PdNotice>
        )}
        {status === 'disputed' && (
          <PdNotice kind="warn" icon={IconInfo}>
            <b>На рассмотрении.</b> Деньги заморожены. Поддержка ответит в течение 24 часов. Добавьте детали и фото в чат.
          </PdNotice>
        )}
        {status === 'released' && (
          <PdNotice kind="ok" icon={IconCheck}>
            <b>Готово!</b> Получение подтверждено. {formatPriceKopecks(sellerAmount)} отправлены {deal.counterparty.display_name}, чек придёт на e-mail.
          </PdNotice>
        )}
        {status === 'refunded' && <PdNotice kind="info" icon={IconInfo}><b>Возврат оформлен.</b> Деньги вернутся на вашу карту в срок банка.</PdNotice>}
        {status === 'cancelled' && <PdNotice kind="info" icon={IconInfo}>Сделка отменена, букет снова доступен другим покупателям.</PdNotice>}
        {status === 'created' && <PdNotice kind="info" icon={IconInfo}>Ожидаем оплату. Букет зарезервирован за вами 30 минут.</PdNotice>}
      </div>

      {status === 'paid_held' && deal.delivery_method === 'self_pickup' && <DeliveryCard dealId={id} />}

      {hasChat && <DealChat dealId={id} />}
    </ScreenChrome>
  );
}
