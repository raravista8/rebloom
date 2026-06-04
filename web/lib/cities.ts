// 10 launch cities (PRD §9). city_id = slug; scope feeds by it.
export const CITIES: { id: string; name: string; prepositional: string }[] = [
  { id: 'msk', name: 'Москва', prepositional: 'Москве' },
  { id: 'spb', name: 'Санкт-Петербург', prepositional: 'Санкт-Петербурге' },
  { id: 'nsk', name: 'Новосибирск', prepositional: 'Новосибирске' },
  { id: 'ekb', name: 'Екатеринбург', prepositional: 'Екатеринбурге' },
  { id: 'kzn', name: 'Казань', prepositional: 'Казани' },
  { id: 'krsk', name: 'Красноярск', prepositional: 'Красноярске' },
  { id: 'nnv', name: 'Нижний Новгород', prepositional: 'Нижнем Новгороде' },
  { id: 'chel', name: 'Челябинск', prepositional: 'Челябинске' },
  { id: 'ufa', name: 'Уфа', prepositional: 'Уфе' },
  { id: 'smr', name: 'Самара', prepositional: 'Самаре' },
];

export const DEFAULT_CITY = 'msk';

const BY_ID = new Map(CITIES.map((c) => [c.id, c]));

export function cityName(id: string): string {
  return BY_ID.get(id)?.name ?? 'Москва';
}
export function cityPrepositional(id: string): string {
  return BY_ID.get(id)?.prepositional ?? 'Москве';
}
