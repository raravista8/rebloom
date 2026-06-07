'use client';
// Продать букет — publish flow (FR-010). Photos → size → freshness → price → район →
// POST /api/listings. Mirrors canon's SellForm with controlled inputs (canon's
// PdSizeSel/PdSeg/PdInput are display-only). Buttons enabled by default; validation
// inline on press (INTERACTION_STATES §1). Success → active or moderation_pending.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PdField, PdBtn, PdNotice } from '@/components/canon';
import { IconPin, IconInfo, IconCheck } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import PhotoUploader from '@/components/sell/PhotoUploader';
import MetroPicker from '@/components/forms/MetroPicker';
import FlowerPicker from '@/components/forms/FlowerPicker';
import { api, ApiError } from '@/lib/api';
import { reachGoal } from '@/lib/ym';
import { cityName, DEFAULT_CITY } from '@/lib/cities';
import { cityHasMetro } from '@/lib/metro';
import type { Size, Freshness, ListingDetail } from '@/lib/types';

const SIZES: [Size, string][] = [['S', 'до 7'], ['M', '7–15'], ['L', '15–25'], ['XL', '25+']];
const FRESH: [Freshness, string][] = [['today', 'Сегодня'], ['d1_2', '1–2 дня'], ['d3_plus', '3+ дня']];

type Phase = 'checking' | 'form' | 'success' | 'pending';

export default function SellForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('checking');
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [size, setSize] = useState<Size>('M');
  const [freshness, setFreshness] = useState<Freshness>('today');
  const [priceRub, setPriceRub] = useState('');
  const [metroId, setMetroId] = useState<string | undefined>();
  const [flowerTypes, setFlowerTypes] = useState<string[]>([]);
  const [geo, setGeo] = useState('');
  const cityId = DEFAULT_CITY;
  const hasMetro = cityHasMetro(cityId);

  const [photoErr, setPhotoErr] = useState<string | undefined>();
  const [priceErr, setPriceErr] = useState<string | undefined>();
  const [submitErr, setSubmitErr] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<ListingDetail | null>(null);

  // sell requires auth — gate early rather than after filling the form
  useEffect(() => {
    let alive = true;
    api
      .get('/me')
      .then(() => alive && setPhase('form'))
      .catch((e) => {
        if (!alive) return;
        if (e instanceof ApiError && e.code === 'unauthorized') router.replace('/login?next=%2Fsell');
        else setPhase('form');
      });
    return () => {
      alive = false;
    };
  }, [router]);

  const priceKopecks = Math.round(Number(priceRub.replace(/\s/g, '')) * 100);

  const publish = useCallback(async () => {
    setPhotoErr(undefined);
    setPriceErr(undefined);
    setSubmitErr(undefined);
    let bad = false;
    if (photoIds.length < 1) {
      setPhotoErr('Добавьте хотя бы одно фото букета');
      bad = true;
    }
    if (!Number.isFinite(priceKopecks) || priceKopecks <= 0) {
      setPriceErr('Укажите цену');
      bad = true;
    }
    if (bad) return;

    setSubmitting(true);
    try {
      const listing = await api.post<ListingDetail>('/listings', {
        size,
        freshness,
        price_kopecks: priceKopecks,
        city_id: cityId,
        ...(metroId ? { metro_station_id: metroId } : {}),
        ...(geo.trim() ? { geo: geo.trim() } : {}),
        ...(flowerTypes.length ? { flower_types: flowerTypes } : {}),
        photo_ids: photoIds,
      });
      setCreated(listing);
      setPhase(listing.status === 'pending_review' ? 'pending' : 'success');
      reachGoal('listing_published');
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === 'unauthorized') router.replace('/login?next=%2Fsell');
        else if (e.code === 'moderation_pending') setPhase('pending');
        else setSubmitErr(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  }, [photoIds, priceKopecks, size, freshness, cityId, metroId, flowerTypes, geo, router]);

  if (phase === 'checking') {
    return (
      <ScreenChrome title="Продать букет">
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="pd-sk" style={{ height: 96 }} />
          <div className="pd-sk" style={{ height: 44 }} />
          <div className="pd-sk" style={{ height: 44 }} />
        </div>
      </ScreenChrome>
    );
  }

  if (phase === 'success' || phase === 'pending') {
    const pending = phase === 'pending';
    const footer = (
      <div className="pd-footerbar" style={{ display: 'flex', gap: 10 }}>
        <Link href="/me" style={{ flex: 1 }}>
          <PdBtn variant="secondary" block>В мои объявления</PdBtn>
        </Link>
        {created && !pending && (
          <Link href={`/l/${created.id}`} style={{ flex: 1 }}>
            <PdBtn variant="primary" block>К букету</PdBtn>
          </Link>
        )}
      </div>
    );
    return (
      <ScreenChrome title="Готово" footer={footer}>
        <div className="pd-empty" style={{ height: 'auto', paddingTop: 48 }}>
          <div className="glyph" style={{ color: pending ? 'var(--pd-warn)' : 'var(--pd-fresh)' }}>
            {pending ? <IconInfo className="pd-i28" /> : <IconCheck className="pd-i28" />}
          </div>
          <h3>{pending ? 'Букет на проверке' : 'Букет опубликован'}</h3>
          <p>
            {pending
              ? 'Обычно проверка занимает несколько минут. Как только всё хорошо, объявление появится в ленте города.'
              : 'Уже в ленте города — покупатели рядом видят его прямо сейчас. Свежесть тает со временем, поэтому честная цена помогает продать быстрее.'}
          </p>
        </div>
      </ScreenChrome>
    );
  }

  const footer = (
    <div className="pd-footerbar">
      {submitErr && <div style={{ marginBottom: 8 }}><PdNotice kind="danger">{submitErr}</PdNotice></div>}
      <PdBtn variant="primary" block lg loading={submitting} disabled={submitting} onClick={publish}>
        Опубликовать букет
      </PdBtn>
    </div>
  );

  return (
    <ScreenChrome title="Продать букет" footer={footer}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <PdField label="Фото букета" hint="1–5 фото. Уберём метаданные и геоданные перед загрузкой." error={photoErr}>
          <PhotoUploader onPhotoIds={setPhotoIds} />
        </PdField>

        <PdField label="Размер">
          <div className="pd-sizes">
            {SIZES.map(([s, l]) => (
              <button key={s} type="button" className={`pd-sizebtn${size === s ? ' on' : ''}`} onClick={() => setSize(s)}>
                <span className="s">{s}</span>
                <span className="l">{l} шт.</span>
              </button>
            ))}
          </div>
        </PdField>

        <PdField label="Когда букет подарили" hint="Срок свежести отсчитываем от этого дня.">
          <div className="pd-seg" role="group" aria-label="Когда букет подарили">
            {FRESH.map(([k, l]) => (
              <button key={k} type="button" className={freshness === k ? 'on' : ''} onClick={() => setFreshness(k)}>
                {l}
              </button>
            ))}
          </div>
        </PdField>

        <PdField label="Цена" error={priceErr}>
          <div className={`pd-input${priceErr ? ' pd-input--invalid' : ''}`}>
            <span className="pre">₽</span>
            <input
              inputMode="numeric"
              placeholder="990"
              value={priceRub}
              onChange={(e) => {
                setPriceRub(e.target.value.replace(/[^\d]/g, '').slice(0, 7));
                if (priceErr) setPriceErr(undefined);
              }}
              aria-label="Цена в рублях"
            />
          </div>
        </PdField>

        {/* Metro station (cities with a metro) — primary самовывоз ориентир. No-metro
            cities keep a район text fallback. Точное место — only after the chat agrees. */}
        {hasMetro ? (
          <PdField label="Станция метро" opt="необязательно" hint="Самовывоз будет привязан к станции. Точное место покупатель увидит после договорённости.">
            <MetroPicker cityId={cityId} value={metroId} onChange={setMetroId} placeholder="Выберите станцию рядом" />
          </PdField>
        ) : (
          <PdField label="Район" opt="необязательно" hint="Точное место покупатель увидит только после договорённости.">
            <div className="pd-input">
              <IconPin className="pd-i18" style={{ color: 'var(--pd-muted)', flex: 'none' }} />
              <input
                placeholder={`${cityName(cityId)} · район`}
                value={geo}
                onChange={(e) => setGeo(e.target.value.slice(0, 128))}
                aria-label="Район"
              />
            </div>
          </PdField>
        )}

        <PdField label="Какие цветы" opt="необязательно" hint="Помогает покупателю найти ваш букет по составу.">
          <FlowerPicker value={flowerTypes} onChange={setFlowerTypes} />
        </PdField>
      </div>
    </ScreenChrome>
  );
}
