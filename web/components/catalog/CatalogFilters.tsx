'use client';
// Shared filter UI for /catalog and /search — re-composes canon's PdCatalog filter
// markup (`.pdc-side` sidebar, `.pdc-mbar` chip row, `.pdc-panel*` inline «Все фильтры»
// panel, `.pdc-sortdd` dropdown / `.pdc-sort` segmented, `.pdc-metrotag` tags) over the
// shared Filters state. MetroPicker (multi) emits backend station ids; FlowerPicker emits
// flower ids. «Показать N букетов» uses the live `total` from /api/search.
import { useEffect, useRef, useState } from 'react';
import { IconChev, IconPin, IconSliders, IconX } from '@/components/icons';
import MetroPicker from '@/components/forms/MetroPicker';
import { stationById, stationsForCity } from '@/lib/metro';
import { flowerLabel } from '@/lib/flowers';
import { FLOWERS } from '@/lib/flowers';
import {
  activeCount,
  FRESH_OPTS,
  PRICE_OPTS,
  SIZE_OPTS,
  SORT_OPTS,
  type Filters,
  type SortKey,
} from '@/components/catalog/filters';

type Set = <K extends keyof Filters>(k: K, v: Filters[K]) => void;

function Chip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" className={'pdc-fchip' + (on ? ' on' : '')} onClick={onClick}>
      {label}
    </button>
  );
}

// A group of single-select chips (toggle off when re-clicked).
function ChipGroup<T extends string>({
  opts,
  value,
  onPick,
}: {
  opts: [T, string][];
  value: T | null;
  onPick: (v: T | null) => void;
}) {
  return (
    <div className="pdc-fopts">
      {opts.map(([v, l]) => (
        <Chip key={v} on={value === v} label={l} onClick={() => onPick(value === v ? null : v)} />
      ))}
    </div>
  );
}

function MetroTags({ metro, onToggle }: { metro: string[]; onToggle: (id: string | null) => void }) {
  if (metro.length === 0) return null;
  return (
    <div className="pdc-metrotags">
      {metro.map((id) => (
        <button key={id} className="pdc-metrotag" onClick={() => onToggle(id)}>
          м. {stationById(id)?.name ?? id}
          <IconX className="pd-i12" />
        </button>
      ))}
    </div>
  );
}

function FlowerChips({ flowers, onToggle }: { flowers: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="pdc-fopts">
      {FLOWERS.map((f) => (
        <Chip key={f.id} on={flowers.includes(f.id)} label={f.label} onClick={() => onToggle(f.id)} />
      ))}
    </div>
  );
}

// Groups shared by the desktop sidebar + the mobile panel.
function Groups({
  cityId,
  f,
  set,
  toggleMetro,
  toggleFlower,
}: {
  cityId: string;
  f: Filters;
  set: Set;
  toggleMetro: (id: string | null) => void;
  toggleFlower: (id: string) => void;
}) {
  const hasMetro = stationsForCity(cityId).length > 0;
  return (
    <>
      {hasMetro && (
        <div className="pdc-fblock">
          <h4>Метро</h4>
          <MetroPicker cityId={cityId} multi values={f.metro} onToggle={toggleMetro} placeholder="Любые станции" />
          <MetroTags metro={f.metro} onToggle={toggleMetro} />
        </div>
      )}
      <div className="pdc-fblock">
        <h4>Цена</h4>
        <ChipGroup opts={PRICE_OPTS} value={f.price === 'any' ? null : f.price} onPick={(v) => set('price', (v ?? 'any') as Filters['price'])} />
      </div>
      <div className="pdc-fblock">
        <h4>Свежесть</h4>
        <ChipGroup opts={FRESH_OPTS} value={f.freshness} onPick={(v) => set('freshness', v)} />
      </div>
      <div className="pdc-fblock">
        <h4>Тип цветов</h4>
        <FlowerChips flowers={f.flowers} onToggle={toggleFlower} />
      </div>
      <div className="pdc-fblock">
        <h4>Размер букета</h4>
        <ChipGroup opts={SIZE_OPTS} value={f.size} onPick={(v) => set('size', v)} />
      </div>
    </>
  );
}

// Desktop sidebar.
export function FiltersSidebar(props: {
  cityId: string;
  f: Filters;
  set: Set;
  toggleMetro: (id: string | null) => void;
  toggleFlower: (id: string) => void;
  reset: () => void;
}) {
  return (
    <aside className="pdc-side">
      <Groups {...props} />
      <button className="pdc-reset" onClick={props.reset}>Сбросить фильтры</button>
    </aside>
  );
}

// Mobile chip bar + inline «Все фильтры» panel. `total` = live count for «Показать N».
export function FiltersBarMobile({
  cityId,
  f,
  set,
  toggleMetro,
  toggleFlower,
  reset,
  total,
}: {
  cityId: string;
  f: Filters;
  set: Set;
  toggleMetro: (id: string | null) => void;
  toggleFlower: (id: string) => void;
  reset: () => void;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const n = activeCount(f);
  return (
    <>
      <div className="pdc-mbar">
        <button className="pdc-mchip pdc-mchip--filters" onClick={() => setOpen(true)}>
          <IconSliders className="pd-i16" />
          Фильтры{n ? ` · ${n}` : ''}
        </button>
        <button className={'pdc-mchip' + (f.metro.length ? ' on' : '')} onClick={() => setOpen(true)}>
          <IconPin className="pd-i14" />
          {f.metro.length
            ? f.metro.length === 1
              ? `м. ${stationById(f.metro[0])?.name ?? ''}`
              : `Метро · ${f.metro.length}`
            : 'Метро'}
        </button>
        {PRICE_OPTS.map(([v, l]) => (
          <button key={v} className={'pdc-mchip' + (f.price === v ? ' on' : '')} onClick={() => set('price', f.price === v ? 'any' : v)}>
            {l}
          </button>
        ))}
        <button className={'pdc-mchip' + (f.freshness === 'today' ? ' on' : '')} onClick={() => set('freshness', f.freshness === 'today' ? null : 'today')}>
          Свежий
        </button>
        {['roses', 'peonies', 'tulips'].map((id) => (
          <button key={id} className={'pdc-mchip' + (f.flowers.includes(id) ? ' on' : '')} onClick={() => toggleFlower(id)}>
            {flowerLabel(id)}
          </button>
        ))}
      </div>

      {open && (
        <div className="pdc-panel">
          <div className="pdc-panel-head">
            <span>Все фильтры</span>
            <button className="pdc-panel-x" onClick={() => setOpen(false)} aria-label="Свернуть">
              <IconX className="pd-i18" />
            </button>
          </div>
          <Groups cityId={cityId} f={f} set={set} toggleMetro={toggleMetro} toggleFlower={toggleFlower} />
          <div className="pdc-panel-foot">
            <button className="pdc-sheet-reset" onClick={reset}>Сбросить{n ? ` (${n})` : ''}</button>
            <button className="pdc-sheet-apply" onClick={() => setOpen(false)}>Показать {total} букетов</button>
          </div>
        </div>
      )}
    </>
  );
}

// Sort: «Сортировка ▾» dropdown (mobile) + segmented (desktop).
export function SortControl({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const o = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', o);
    return () => document.removeEventListener('mousedown', o);
  }, [open]);
  const cur = SORT_OPTS.find(([v]) => v === sort);
  return (
    <>
      <div className={'pdc-sortdd' + (open ? ' open' : '')} ref={ref}>
        <button type="button" className="pdc-sortdd-btn" onClick={() => setOpen((o) => !o)}>
          <span className="l">Сортировка:</span>
          <span className="v">{cur ? cur[1] : ''}</span>
          <IconChev className="chev pd-i16" />
        </button>
        {open && (
          <div className="pdc-sortdd-menu">
            {SORT_OPTS.map(([v, l]) => (
              <button key={v} type="button" className={'pdc-sortdd-row' + (sort === v ? ' on' : '')} onClick={() => { setSort(v); setOpen(false); }}>
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pdc-sort pdc-sort--desk">
        <span className="l">Сортировка:</span>
        <div className="pdc-sortsel">
          {SORT_OPTS.map(([v, l]) => (
            <button key={v} className={'pdc-sortbtn' + (sort === v ? ' on' : '')} onClick={() => setSort(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
