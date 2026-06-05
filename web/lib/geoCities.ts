// Geo SEO city dataset (canon 0.4.0 `PD_GEO_CITIES`). Declensions + districts are
// DATA authored in Claude Design (never computed) — we consume them verbatim and only
// add the backend `city_id` mapping (URL slug ≠ backend short slug) for live wiring.
// CLAUDE_CODE_HANDOFF §8.2 / docs/seo/peredarim-seo-yadro.md §6.
import { PD_GEO_CITIES } from '@rebloom/canon/marketing';

export type GeoDistrict = [name: string, count: number];
export type GeoCity = {
  id: string; // URL slug (SEO-friendly): moskva, spb, novosibirsk…
  nom: string;
  loc: string;
  gen: string;
  count: number;
  metro: boolean;
  districts: GeoDistrict[];
};

export const GEO_CITIES = PD_GEO_CITIES as GeoCity[];

// URL slug (canon) → backend city_id (T4.3 seed: msk/spb/nsk/ekb/kzn/krsk/nnv/chel/ufa/smr).
// Used for live per-city queries (catalog/count) once inventory exists.
export const SLUG_TO_CITY_ID: Record<string, string> = {
  moskva: 'msk',
  spb: 'spb',
  novosibirsk: 'nsk',
  ekb: 'ekb',
  kazan: 'kzn',
  nn: 'nnv',
  chelyabinsk: 'chel',
  krasnoyarsk: 'krsk',
  samara: 'smr',
  ufa: 'ufa',
};

export const GEO_SLUGS = GEO_CITIES.map((c) => c.id);

export function geoCityBySlug(slug: string): GeoCity | undefined {
  return GEO_CITIES.find((c) => c.id === slug);
}
