'use client';
// Карточка букета — GET /api/listings/{id}. «Написать продавцу» → POST /api/deals
// (deal:agreed, opens chat). No-escrow «оплата при встрече» (ADR-0013). canon 0.9.0:
// city + metro («Самовывоз у м. …»); «Продавец» block (Продаёт {name} · «рейтинг
// продавца» · deals as a separate stat); flowers as plain text «·»; quiet share
// icon-button (.pd-sharebtn); NO price on the CTA; title «Букет M». Mirrors canon's
// discovery ListingBody + desktop.jsx two-column. States: loading / loaded /
// sold-unavailable / not-found / error (INTERACTION_STATES §5).
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PdBtn, PdNotice, PdAvatar, PdStars, PdFreshness } from '@/components/canon';
import { IconShield, IconInfo, IconSend, IconFlag, IconBack, IconFwd, IconShare, IconPin } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import PhotoGallery from '@/components/feed/PhotoGallery';
import LikeButton from '@/components/feed/LikeButton';
import MetroLabel from '@/components/feed/MetroLabel';
import { api, ApiError } from '@/lib/api';
import { reachGoal } from '@/lib/ym';
import { formatPriceKopecks } from '@/lib/format';
import { cityName } from '@/lib/cities';
import { flowerLabels } from '@/lib/flowers';
import type { ListingDetail as Listing, Deal } from '@/lib/types';

const SIZE_COUNT: Record<string, string> = { S: 'до 7', M: '7–15', L: '15–25', XL: '25+' };

type Status = 'loading' | 'loaded' | 'not_found' | 'error';

// Quiet share icon-button (.pd-sharebtn) + report flag — canon's ListingActions.
function HeaderActions({ listingId }: { listingId: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <button
        className="pd-sharebtn"
        aria-label="Поделиться"
        onClick={() => navigator.share?.({ url: `/l/${listingId}` }).catch(() => {})}
      >
        <IconShare className="pd-i18" />
      </button>
      <Link href={`/l/${listingId}/report`} className="pd-iconbtn" aria-label="Пожаловаться">
        <IconFlag className="pd-i20" />
      </Link>
    </div>
  );
}

// «Продавец» card — «Продаёт {name}», «рейтинг продавца», deals as a separate stat.
function SellerCard({ listing }: { listing: Listing }) {
  const s = listing.seller;
  const name = s.display_name || 'Продавец';
  return (
    <Link href={`/u/${s.id}`} className="pd-sellercard" style={{ textDecoration: 'none', color: 'inherit' }}>
      <PdAvatar seller={{ n: name }} size={46} />
      <div className="pd-seller-main">
        <div className="pd-seller-name">Продаёт {name}</div>
        <div className="pd-seller-rating">
          {s.seller_rating != null ? (
            <>
              <PdStars value={Math.round(s.seller_rating)} />
              <b>{s.seller_rating.toFixed(1).replace('.', ',')}</b>
              <span className="lbl">рейтинг продавца</span>
            </>
          ) : (
            <span className="lbl">новый продавец</span>
          )}
        </div>
      </div>
      {s.deals_count != null && (
        <div className="pd-seller-deals">
          <b>{s.deals_count}</b>
          <span>сделок</span>
        </div>
      )}
      <IconFwd className="pd-i18 pd-seller-chev" />
    </Link>
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
      reachGoal('deal_started');
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
  // metro/flower_types are 0.9.0 fields; guard against responses that omit them.
  const flowers = flowerLabels(listing.flower_types ?? []);
  const title = `Букет ${listing.size}`;
  // «Написать продавцу» — no price on the CTA (canon 0.9.0).
  const footer = sold ? (
    <div className="pd-footerbar">
      <Link href="/">
        <PdBtn variant="secondary" block>Смотреть свежие букеты</PdBtn>
      </Link>
    </div>
  ) : (
    <div className="pd-footerbar">
      {buyErr && <div style={{ marginBottom: 8 }}><PdNotice kind="danger">{buyErr}</PdNotice></div>}
      <PdBtn variant="primary" icon={IconSend} block lg loading={buying} disabled={buying} onClick={buy}>
        Написать продавцу
      </PdBtn>
    </div>
  );

  // location row: «📍 Город» + metro label («Самовывоз у м. …» appears in the pickup block)
  const locationRow = (
    <div className="pd-buy-loc">
      <span className="loc-city">
        <IconPin className="pd-i16" />
        {cityName(listing.city_id)}
      </span>
      {listing.metro && <MetroLabel metro={listing.metro} />}
    </div>
  );

  const pickupBlock = !sold && (
    <div style={{ marginTop: 18 }}>
      <div className="pd-label" style={{ marginBottom: 8 }}>Как забрать</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', border: '1px solid var(--pd-border)', borderRadius: 14 }}>
        <span className="pd-mglyph" style={{ width: 24, height: 24, fontSize: 14 }}>М</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            {listing.metro ? `Самовывоз у м. ${listing.metro.name}` : 'Самовывоз рядом'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--pd-muted)', marginTop: 1 }}>
            {listing.metro ? 'Заберёте букет рядом со станцией' : 'Точное место появится в чате после договорённости'}
          </div>
        </div>
      </div>
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
            <h1 className="pdw-h1" style={{ fontSize: 22, marginBottom: 10 }}>{title}</h1>
            <div className="pd-price-row" style={{ marginBottom: 12 }}>
              <span className="price">{formatPriceKopecks(listing.price_kopecks)}</span>
              <LikeButton listingId={listing.id} liked={listing.liked} count={listing.like_count} big />
            </div>
            <div className="pd-buy-meta">
              <PdFreshness kind={listing.freshness} />
              <div className="pd-buy-spec"><b>Размер {listing.size}</b> · {SIZE_COUNT[listing.size]} стеблей</div>
              {locationRow}
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
                  <PdBtn variant="primary" icon={IconSend} block lg loading={buying} disabled={buying} onClick={buy}>
                    Написать продавцу
                  </PdBtn>
                </div>
              </>
            )}
          </div>

          <div className="pd-label" style={{ marginTop: 18, marginBottom: 8 }}>Продавец</div>
          <SellerCard listing={listing} />

          {flowers.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div className="pd-label" style={{ marginBottom: 8 }}>Цветы в букете</div>
              <div className="pd-flowerlist">{flowers.join(' · ')}</div>
            </div>
          )}
          {pickupBlock}
        </aside>
      </div>
    </div>
  );

  return (
    <ScreenChrome title={title} action={<HeaderActions listingId={id} />} footer={footer} desktop={desktop}>
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

        <div className="pd-buy-meta">
          <PdFreshness kind={listing.freshness} />
          <div className="pd-buy-spec"><b>Размер {listing.size}</b> · {SIZE_COUNT[listing.size]} стеблей</div>
          {locationRow}
        </div>

        {sold ? (
          <PdNotice kind="info" icon={IconInfo}>Этот букет уже купили. Посмотрите другие свежие букеты рядом — их добавляют каждый день.</PdNotice>
        ) : (
          <PdNotice kind="ok" icon={IconShield}>
            <b>Оплата при встрече.</b> Без предоплаты — договоритесь в чате и заберите букет, оплатив продавцу на месте.
          </PdNotice>
        )}

        <div className="pd-label" style={{ marginTop: 18, marginBottom: 8 }}>Продавец</div>
        <SellerCard listing={listing} />

        {flowers.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div className="pd-label" style={{ marginBottom: 8 }}>Цветы в букете</div>
            <div className="pd-flowerlist">{flowers.join(' · ')}</div>
          </div>
        )}
        {pickupBlock}
      </div>
    </ScreenChrome>
  );
}
