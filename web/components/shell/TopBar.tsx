// Home top app bar — mirrors canon's .pd-topbar (canon's TopBar hardcodes «Москва»
// and has no handlers). Brand + city switcher + search entry, wired to routes.
import Link from 'next/link';
import { IconPin, IconChev, IconSearch, IconSliders } from '@/components/icons';
import { cityName, cityPrepositional } from '@/lib/cities';

export default function TopBar({ cityId }: { cityId: string }) {
  return (
    <header className="pd-topbar" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
      <div className="pd-topbar-row">
        <span className="pd-brand">Передарим</span>
        <Link href="/city" className="pd-city">
          <IconPin className="pd-i16" />
          {cityName(cityId)}
          <IconChev className="pd-i14" />
        </Link>
      </div>
      <div className="pd-searchrow">
        <Link href="/search" className="pd-search" style={{ textDecoration: 'none' }}>
          <IconSearch className="pd-i18" />
          <span className="pd-search-ph">Поиск букетов в {cityPrepositional(cityId)}</span>
        </Link>
        <Link href="/search" className="pd-filter" aria-label="Фильтры">
          <IconSliders className="pd-i20" />
        </Link>
      </div>
    </header>
  );
}
