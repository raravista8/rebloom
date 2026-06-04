'use client';
// Выбор города — sets the city cookie and returns to the feed. Geo is scoped by
// city_id from day one (PRD §9).
import { useRouter } from 'next/navigation';
import { IconPin, IconCheck } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { CITIES } from '@/lib/cities';
import { getCityClient, setCityClient } from '@/lib/city-client';

export default function CityScreen() {
  const router = useRouter();
  const current = getCityClient();

  function pick(id: string) {
    setCityClient(id);
    router.push('/');
    router.refresh();
  }

  return (
    <ScreenChrome title="Город">
      <div className="pd-list">
        {CITIES.map((c) => (
          <button key={c.id} type="button" onClick={() => pick(c.id)} style={{ all: 'unset', display: 'block', width: '100%' }}>
            <div className="pd-row" style={{ cursor: 'pointer' }}>
              <span className="ring"><IconPin className="pd-i20" /></span>
              <div className="mid"><div className="ttl">{c.name}</div></div>
              {c.id === current && <IconCheck className="pd-i20" style={{ color: 'var(--pd-primary)' }} />}
            </div>
          </button>
        ))}
      </div>
    </ScreenChrome>
  );
}
