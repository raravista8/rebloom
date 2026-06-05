'use client';
// Shared DESKTOP top nav (canon .pdw-nav): brand + city + search + actions + CTA.
// Used by the home витрина AND by ScreenChrome's desktop layout, so every screen
// shares one global header instead of a mobile app-bar with a bottom tab strip.
// City comes from the prop when known (home/search), otherwise from the cookie.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconPin, IconChev, IconSearch, IconBell, IconDeals, IconPlus, IconUser } from '@/components/icons';
import { getCityClient } from '@/lib/city-client';
import { cityName, cityPrepositional, DEFAULT_CITY } from '@/lib/cities';

export default function WebChrome({ cityId }: { cityId?: string }) {
  const [city, setCity] = useState(cityId ?? DEFAULT_CITY);
  useEffect(() => {
    if (!cityId) setCity(getCityClient());
  }, [cityId]);

  return (
    <header className="pdw-nav">
      <div className="pdw-nav-in">
        <Link href="/" className="pd-brand pdw-brand" style={{ textDecoration: 'none' }}>
          Передарим
        </Link>
        <div className="pdw-navmid">
          <Link href="/city" className="pd-city pdw-city" style={{ textDecoration: 'none' }}>
            <IconPin className="pd-i16" />
            {cityName(city)}
            <IconChev className="pd-i14" />
          </Link>
          <Link href="/search" className="pd-search pdw-search" style={{ textDecoration: 'none' }}>
            <IconSearch className="pd-i18" />
            <span className="pd-search-ph">Поиск свежих букетов в {cityPrepositional(city)}</span>
          </Link>
        </div>
        <nav className="pdw-navright">
          <Link href="/notifications" className="pdw-iconbtn" aria-label="Уведомления">
            <IconBell className="pd-i20" />
          </Link>
          <Link href="/deals" className="pdw-iconbtn" aria-label="Сделки">
            <IconDeals className="pd-i20" />
          </Link>
          <Link
            href="/me"
            className="pdw-avatar"
            aria-label="Профиль"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconUser className="pd-i18" />
          </Link>
          <Link href="/sell" className="pdw-cta" style={{ textDecoration: 'none' }}>
            <IconPlus className="pd-i18" />
            Продать букет
          </Link>
        </nav>
      </div>
    </header>
  );
}
