'use client';
// Pre-purchase chat — buyer ↔ seller about a listing before a deal (FR-030, T6.3).
// «Предложить цену» from the listing card lands here. GET/POST
// /api/listings/{id}/messages (buyer omits buyer_id — own thread). Hard contact
// filter is enforced server-side. Mirrors canon's chat surface.
import { useEffect, useState } from 'react';
import { PdNotice } from '@/components/canon';
import { IconShield } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import ChatPanel from '@/components/chat/ChatPanel';
import { api } from '@/lib/api';
import { formatPriceKopecks } from '@/lib/format';
import type { ListingDetail } from '@/lib/types';

export default function ListingChat({ id }: { id: string }) {
  const [listing, setListing] = useState<ListingDetail | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .get<ListingDetail>(`/listings/${id}`)
      .then((l) => alive && setListing(l))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <ScreenChrome title="Чат с продавцом">
      {listing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderBottom: '1px solid var(--pd-border)', background: 'var(--pd-surface)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={listing.photos[0]?.card_url ?? ''} alt="" style={{ width: 44, height: 44, borderRadius: 11, objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Букет</div>
            <div style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginTop: 2 }}>Размер {listing.size}</div>
          </div>
          <div className="pd-price" style={{ fontSize: 16 }}>{formatPriceKopecks(listing.price_kopecks)}</div>
        </div>
      )}
      <div style={{ padding: '12px 16px' }}>
        <PdNotice kind="ok" icon={IconShield}>
          Договоритесь о цене и встрече. Оплата — при встрече, наличными или переводом; точное место продавец пришлёт в сделке.
        </PdNotice>
      </div>
      <ChatPanel
        loadPath={`/listings/${id}/messages`}
        sendPath={`/listings/${id}/messages`}
        emptyText="Напишите продавцу — спросите про свежесть или предложите свою цену."
      />
    </ScreenChrome>
  );
}
