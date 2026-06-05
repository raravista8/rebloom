'use client';
// Карточка букета — GET /api/listings/{id}. «Написать продавцу» → POST /api/deals
// (deal:agreed, opens chat). No-escrow «оплата при встрече» (ADR-0013).
// Mirrors canon's Listing screen (ListingBody) composed with live data. States:
// loading / loaded / sold-unavailable / not-found / error (INTERACTION_STATES §5).
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PdBtn, PdNotice, PdAvatar, PdStars, PdFreshness } from '@/components/canon';
import { IconShield, IconInfo, IconCart, IconWalk, IconTruck, IconPin, IconSend, IconFlag, IconBack } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import PhotoGallery from '@/components/feed/PhotoGallery';
import LikeButton from '@/components/feed/LikeButton';
import { api, ApiError } from '@/lib/api';
import { formatPriceKopecks } from '@/lib/format';
import { cityName } from '@/lib/cities';
import type { ListingDetail as Listing, Deal } from '@/lib/types';

const SIZE_COUNT: Record<string, string> = { S: 'до 7', M: '7–15', L: '15–25', XL: '25+' };

type Status = 'loading' | 'loaded' | 'not_found' | 'error';

function HeaderActions({ listingId }: { listingId: string }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <button className="pd-iconbtn" aria-label="Поделиться" onClick={() => navigator.share?.({ url: `/l/${listingId}` }).catch(() => {})}>
        <IconSend className="pd-i20" />
      </button>
      <Link href={`/l/${listingId}/report`} className="pd-iconbtn" aria-label="Пожаловаться">
        <IconFlag className="pd-i20" />
      </Link>
    </div>
  );
}

export default function ListingDetail({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [listing, setListing] = useState<Listing | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyErr, setBuyErr] = useState<string | undefined>();
  const [photoIdx, setPhotoIdx] = useState(0); // desktop gallery selection

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const l = await api.get<Listing>(`/listings/${id}`);
      setListing(l);
      setStatus('loaded');
    } catch (e) {
      setStatus(e instanceof ApiError && e.code === 'not_found' ? 'not_found' : 'error');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  // No-escrow (ADR-0013): «Написать продавцу» creates deal:agreed + opens the chat.
  // No payment — people pay at the meeting.
  const buy = useCallback(async () => {
    setBuyErr(undefined);
    setBuying(true);
    try {
      const res = await api.post<{ deal: Deal }>('/deals', {
        listing_id: id,
        delivery_method: 'self_pickup',
      });
      router.push(`/deal/${res.deal.id}`);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === 'unauthorized') router.push(`/login?next=${encodeURIComponent(`/l/${id}`)}`);
        else if (e.code === 'listing_unavailable') setListing((l) => (l ? { ...l, status: 'sold' } : l));
        else setBuyErr(e.message);
      }
    } finally {
      setBuying(false);
    }
  }, [id, router]);

  if (status === 'loading') {
    return (
      <ScreenChrome title="Букет">
        <div className="pd-sk" style={{ height: 320, borderRadius: 0 }} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="pd-sk" style={{ height: 30, width: '50%' }} />
          <div className="pd-sk" style={{ height: 18, width: '70%' }} />
          <div className="pd-sk" style={{ height: 64 }} />
          <div className="pd-sk" style={{ height: 48 }} />
        </div>
      </ScreenChrome>
    );
  }

  if (status === 'not_found') {
    return (
      <ScreenChrome title="Букет">
        <div style={{ padding: '48px 20px' }}>
          <PdNotice kind="info" icon={IconInfo}>Этого букета больше нет. Возможно, его уже купили или сняли с публикации.</PdNotice>
          <div style={{ marginTop: 16 }}>
            <Link href="/">
              <PdBtn variant="secondary" block>На главную</PdBtn>
            </Link>
          </div>
        </div>
      </ScreenChrome>
    );
  }

  if (status === 'error' || !listing) {
    return (
      <ScreenChrome title="Букет">
        <div style={{ padding: '48px 20px', textAlign: 'center' }}>
          <PdNotice kind="danger">Не удалось загрузить букет.</PdNotice>
          <div style={{ marginTop: 16 }}>
            <PdBtn variant="primary" onClick={load}>Повторить</PdBtn>
          </div>
        </div>
      </ScreenChrome>
    );
  }

  const sold = listing.status === 'sold' || listing.status === 'reserved' || listing.status === 'archived';
  const footer = sold ? (
    <div className="pd-footerbar">
      <Link href="/">
        <PdBtn variant="secondary" block>Смотреть свежие букеты</PdBtn>
      </Link>
    </div>
  ) : (
    <div className="pd-footerbar">
      {buyErr && <div style={{ marginBottom: 8 }}><PdNotice kind="danger">{buyErr}</PdNotice></div>}
      <PdBtn variant="primary" icon={IconCart} block lg loading={buying} disabled={buying} onClick={buy}>
        Написать продавцу · {formatPriceKopecks(listing.price_kopecks)}
      </PdBtn>
    </div>
  );

  // ─────────── DESKTOP (≥1024px): canon two-column detail (gallery + sticky buy) ───────────
  const photos = listing.photos;
  const hero = photos[Math.min(photoIdx, photos.length - 1)] ?? photos[0];
  const desktop = (
    <div className="pdw-detailwrap">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <button className="pdw-back" onClick={() => router.back()}>
          <IconBack className="pd-i18" /> Назад к ленте
        </button>
        <HeaderActions listingId={id} />
      </div>
      <div className="pdw-2col">
        <div className="pdw-gallery">
          <div className="hero" style={{ position: 'relative' }}>
            {hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.full_url || hero.card_url} alt="Букет" />
            )}
            {sold && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(35,32,27,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ background: '#fff', color: 'var(--pd-text)', fontWeight: 700, fontSize: 15, padding: '10px 18px', borderRadius: 999 }}>Уже продано</span>
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className="pdw-thumbs">
              {photos.map((p, i) => (
                <button key={i} type="button" className={`t${i === photoIdx ? ' on' : ''}`} onClick={() => setPhotoIdx(i)} aria-label={`Фото ${i + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.card_url || p.full_url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside>
          <div className="pdw-buy">
            <div className="pd-price-row" style={{ marginBottom: 12 }}>
              <span className="price">{formatPriceKopecks(listing.price_kopecks)}</span>
              <LikeButton listingId={listing.id} liked={listing.liked} count={listing.like_count} big />
            </div>
            <div className="pd-chiprow" style={{ marginBottom: 14 }}>
              <PdFreshness kind={listing.freshness} />
              <span className="pd-chip" style={{ pointerEvents: 'none' }}>Размер {listing.size} · {SIZE_COUNT[listing.size]} шт.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--pd-muted)', fontSize: 13.5, marginBottom: 14 }}>
              <IconPin className="pd-i16" />
              {cityName(listing.city_id)}
            </div>

            {sold ? (
              <PdNotice kind="info" icon={IconInfo}>Этот букет уже купили. Посмотрите другие свежие букеты рядом — их добавляют каждый день.</PdNotice>
            ) : (
              <PdNotice kind="ok" icon={IconShield}>
                <b>Оплата при встрече.</b> Никакой предоплаты — договоритесь в чате и заберите букет, оплатив продавцу на месте.
              </PdNotice>
            )}

            {sold ? (
              <div style={{ marginTop: 16 }}>
                <Link href="/"><PdBtn variant="secondary" block>Смотреть свежие букеты</PdBtn></Link>
              </div>
            ) : (
              <>
                {buyErr && <div style={{ margin: '12px 0' }}><PdNotice kind="danger">{buyErr}</PdNotice></div>}
                <div style={{ marginTop: 16 }}>
                  <PdBtn variant="primary" icon={IconCart} block lg loading={buying} disabled={buying} onClick={buy}>
                    Написать продавцу · {formatPriceKopecks(listing.price_kopecks)}
                  </PdBtn>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginTop: 12 }}>
                  Самовывоз. Точное место появится в чате после договорённости — двор или станцию выбирает продавец.
                </p>
              </>
            )}
          </div>

          <Link
            href={`/u/${listing.seller.id}`}
            className="pdw-card"
            style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 16, textDecoration: 'none', color: 'inherit' }}
          >
            <PdAvatar seller={{ n: listing.seller.display_name }} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{listing.seller.display_name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--pd-muted)', fontSize: 12.5, marginTop: 2 }}>
                <PdStars value={Math.round(listing.seller.seller_rating)} /> {listing.seller.seller_rating.toFixed(1)}
                {listing.seller.deals_count != null && ` · ${listing.seller.deals_count} сделок`}
              </div>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );

  return (
    <ScreenChrome title="Букет" action={<HeaderActions listingId={id} />} footer={footer} desktop={desktop}>
      <div style={{ position: 'relative' }}>
        <PhotoGallery photos={listing.photos} />
        {sold && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(35,32,27,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: '#fff', color: 'var(--pd-text)', fontWeight: 700, fontSize: 15, padding: '10px 18px', borderRadius: 999 }}>Уже продано</span>
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <div className="pd-price-row" style={{ marginBottom: 10 }}>
          <span className="pd-price" style={{ fontSize: 26 }}>{formatPriceKopecks(listing.price_kopecks)}</span>
          <LikeButton listingId={listing.id} liked={listing.liked} count={listing.like_count} big />
        </div>

        <div className="pd-chiprow" style={{ marginBottom: 14 }}>
          <PdFreshness kind={listing.freshness} />
          <span className="pd-chip" style={{ pointerEvents: 'none' }}>
            Размер {listing.size} · {SIZE_COUNT[listing.size]} шт.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--pd-muted)', fontSize: 13.5, marginBottom: 16 }}>
          <IconPin className="pd-i16" />
          {cityName(listing.city_id)}
        </div>

        {sold ? (
          <PdNotice kind="info" icon={IconInfo}>Этот букет уже купили. Посмотрите другие свежие букеты рядом — их добавляют каждый день.</PdNotice>
        ) : (
          <PdNotice kind="ok" icon={IconShield}>
            <b>Оплата при встрече.</b> Без предоплаты — договоритесь в чате и заберите букет, оплатив продавцу на месте.
          </PdNotice>
        )}

        <Link
          href={`/u/${listing.seller.id}`}
          style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 0', marginTop: 6, borderTop: '1px solid var(--pd-border)', borderBottom: '1px solid var(--pd-border)', textDecoration: 'none', color: 'inherit' }}
        >
          <PdAvatar seller={{ n: listing.seller.display_name }} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{listing.seller.display_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--pd-muted)', fontSize: 12.5, marginTop: 2 }}>
              <PdStars value={Math.round(listing.seller.seller_rating)} /> {listing.seller.seller_rating.toFixed(1)}
              {listing.seller.deals_count != null && ` · ${listing.seller.deals_count} сделок`}
            </div>
          </div>
        </Link>

        {!sold && (
          <div style={{ marginTop: 16 }}>
            <div className="pd-label" style={{ marginBottom: 8 }}>Как забрать</div>
            <div className="pd-seg" role="group" aria-label="Способ получения">
              <button className="on" type="button">
                <IconWalk className="pd-i16" style={{ marginRight: 5, verticalAlign: '-3px' }} />
                Самовывоз
              </button>
              <button type="button" disabled title="Скоро">
                <IconTruck className="pd-i16" style={{ marginRight: 5, verticalAlign: '-3px' }} />
                Курьер
              </button>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--pd-muted)', marginTop: 8 }}>
              Точное место появится в чате после договорённости. Двор или станцию выбирает продавец.
            </p>
          </div>
        )}
      </div>
    </ScreenChrome>
  );
}
