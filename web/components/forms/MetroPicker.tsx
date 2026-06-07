'use client';
// Metro-station picker — replicates canon's PdMetroPicker (.pd-mpick* markup, kit.jsx)
// over the BACKEND station catalog (lib/metro.ts) so it emits valid `metro_station_id`s.
// canon's own PdMetroPicker is hardwired to its smaller name-keyed PD_METRO and emits
// station NAMES, which the backend (validating/filtering by id) can't accept — so we
// compose the same canon CSS instead (CANON_PACKAGE_TZ §10). Two modes:
//  • single (publish form): value=id, onChange(id)
//  • multi  (filters):      values=id[], onToggle(id|null) — null = clear all
import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconChev, IconSearch } from '@/components/icons';
import { useCityStations, stationById, type MetroStation } from '@/lib/metro';

function Dots({ station, size = 9 }: { station?: MetroStation; size?: number }) {
  const lines = station?.lines.length ? station.lines : [{ name: '', color: '#A1A2A3' }];
  return (
    <span className="pd-mdots" aria-hidden="true">
      {lines.slice(0, 3).map((l, i) => (
        <i key={i} style={{ background: l.color || '#A1A2A3', width: size, height: size }} />
      ))}
    </span>
  );
}

type Single = { cityId: string; value?: string; onChange: (id: string) => void; placeholder?: string; multi?: false };
type Multi = { cityId: string; multi: true; values: string[]; onToggle: (id: string | null) => void; placeholder?: string };

export default function MetroPicker(props: Single | Multi) {
  const { cityId, placeholder = 'Выберите станцию метро' } = props;
  const multi = props.multi === true;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const list = useCityStations(cityId);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const ql = q.trim().toLowerCase();
  const filtered = ql ? list.filter((s) => s.name.toLowerCase().includes(ql)) : list;

  const selected = (id: string) => (multi ? (props as Multi).values.includes(id) : (props as Single).value === id);
  const selStations = multi ? (props as Multi).values.map(stationById).filter((s): s is MetroStation => !!s) : [];
  const singleStation = !multi && (props as Single).value ? stationById((props as Single).value!) : undefined;

  // button label
  const label = multi
    ? selStations.length === 0
      ? null
      : selStations.length === 1
        ? selStations[0].name
        : `${selStations.length} станц.`
    : singleStation?.name ?? null;
  const labelStation = multi ? (selStations.length === 1 ? selStations[0] : undefined) : singleStation;

  return (
    <div className={'pd-mpick' + (open ? ' open' : '')} ref={wrapRef}>
      <button type="button" className={'pd-mpick-btn' + (open ? ' open' : '') + (label ? ' has' : '')} onClick={() => setOpen((o) => !o)}>
        <span className="pd-mglyph">М</span>
        {label ? (
          <span className="val">
            {(!multi || selStations.length === 1) && <Dots station={labelStation} size={9} />}
            {multi && selStations.length > 1 ? label : 'м. ' + label}
          </span>
        ) : (
          <span className="ph">{placeholder}</span>
        )}
        <IconChev className="chev pd-i18" />
      </button>
      {open && (
        <div className="pd-mpick-panel">
          <div className="pd-mpick-search">
            <IconSearch className="pd-i16" />
            <input autoFocus value={q} placeholder="Поиск станции" onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="pd-mpick-list">
            {filtered.length === 0 ? (
              <div className="pd-mpick-empty">{list.length === 0 ? 'Загрузка станций…' : 'Станция не найдена'}</div>
            ) : (
              filtered.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={'pd-mpick-row' + (selected(s.id) ? ' on' : '')}
                  onClick={() => {
                    if (multi) (props as Multi).onToggle(s.id);
                    else {
                      (props as Single).onChange(s.id);
                      setOpen(false);
                      setQ('');
                    }
                  }}
                >
                  {multi && (
                    <span className={'pd-mpick-cb' + (selected(s.id) ? ' on' : '')}>
                      {selected(s.id) && <IconCheck className="pd-i14" />}
                    </span>
                  )}
                  <Dots station={s} size={9} />
                  <span className="n">{s.name}</span>
                  {!multi && selected(s.id) && <IconCheck className="pd-i16 ck" />}
                </button>
              ))
            )}
          </div>
          {multi && selStations.length > 0 && (
            <div className="pd-mpick-foot">
              <button type="button" className="clr" onClick={() => (props as Multi).onToggle(null)}>
                Сбросить ({selStations.length})
              </button>
              <button type="button" className="done" onClick={() => setOpen(false)}>
                Готово
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
