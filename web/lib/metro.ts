'use client';
// Metro station catalog — FETCHED from GET /api/geo/metro?city_id= (the backend's
// authoritative ~87-station list from core/geo/metro.py), not mirrored here. The
// picker shows the station name but EMITS the backend id, so the form + search
// filter always send backend-valid `metro_station_id`s.
//
// Module-cached per city (same pattern as lib/useMe.ts): one fetch per city, shared
// across screens; navigating between sell/catalog/search re-uses the loaded list.
// The list arrives ASYNC — `useCityStations` returns [] until it resolves; consumers
// render an empty/loading station list while pending (the picker opens to a search
// box regardless).
//
// `MetroLabel` displays a LISTING's own `metro` (already carried on the listing API
// with colours), so it does NOT depend on this catalog fetch.
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface MetroLine {
  name: string;
  color: string;
}
export interface MetroStation {
  id: string;
  name: string;
  lines: MetroLine[];
}

// Which launch cities have a metro — stable fact (msk/spb). Lets `hasMetro` stay
// synchronous (it gates whether the metro section renders at all), while the station
// LIST loads async. No-metro cities → the район text fallback.
export const CITY_HAS_METRO: Record<string, true> = { msk: true, spb: true };

/** True when the city has a metro at all (synchronous — no fetch needed). */
export function cityHasMetro(cityId: string): boolean {
  return CITY_HAS_METRO[cityId] === true;
}

// Per-city cache + inflight promise (module-scoped → shared across components).
const cache = new Map<string, MetroStation[]>();
const inflight = new Map<string, Promise<MetroStation[]>>();
// Station-by-id index, populated as cities load (for label/tag lookups of selected ids).
const byId = new Map<string, MetroStation>();

function load(cityId: string): Promise<MetroStation[]> {
  const cached = cache.get(cityId);
  if (cached) return Promise.resolve(cached);
  let pending = inflight.get(cityId);
  if (!pending) {
    pending = api
      .get<{ stations: MetroStation[] }>(`/geo/metro?city_id=${encodeURIComponent(cityId)}`)
      .then(
        (data) => {
          const stations = data.stations ?? [];
          cache.set(cityId, stations);
          for (const s of stations) byId.set(s.id, s);
          return stations;
        },
        () => {
          // offline / error → empty list (picker shows «станций нет»); not cached so a
          // later mount can retry.
          return [];
        },
      )
      .finally(() => inflight.delete(cityId));
    inflight.set(cityId, pending);
  }
  return pending;
}

/** Stations for a city, fetched + module-cached. Returns [] while loading or for a
 *  no-metro city. */
export function useCityStations(cityId: string): MetroStation[] {
  const [stations, setStations] = useState<MetroStation[]>(() => cache.get(cityId) ?? []);
  useEffect(() => {
    if (!cityHasMetro(cityId)) {
      setStations([]);
      return;
    }
    const ready = cache.get(cityId);
    if (ready) {
      setStations(ready);
      return;
    }
    let alive = true;
    void load(cityId).then((s) => {
      if (alive) setStations(s);
    });
    return () => {
      alive = false;
    };
  }, [cityId]);
  return stations;
}

/** Look up a station by backend id among the cities loaded so far (the selected ids
 *  always come from the current city's loaded list). `undefined` if not yet loaded. */
export function stationById(id: string): MetroStation | undefined {
  return byId.get(id);
}
