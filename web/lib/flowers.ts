// Flower-type catalog — MIRRORS backend/app/core/listings/flowers.py (the authoritative
// fixed list). Stable ascii id ↔ RU label («Передарим» copy). The form/filter shows
// labels but submits/filters by id; the listing card/detail map ids → labels for display.
// Order is meaningful (form/filter display order, API_CONTRACT §1).

export const FLOWERS: readonly { id: string; label: string }[] = [
  { id: 'roses', label: 'Розы' },
  { id: 'peony_roses', label: 'Пионовидные розы' },
  { id: 'peonies', label: 'Пионы' },
  { id: 'tulips', label: 'Тюльпаны' },
  { id: 'hydrangea', label: 'Гортензия' },
  { id: 'chrysanthemums', label: 'Хризантемы' },
  { id: 'eustoma', label: 'Эустома' },
  { id: 'ranunculus', label: 'Ранункулюсы' },
  { id: 'alstroemeria', label: 'Альстромерия' },
  { id: 'lilies', label: 'Лилии' },
  { id: 'wildflowers', label: 'Полевые' },
];

const LABEL = new Map(FLOWERS.map((f) => [f.id, f.label]));

/** id → RU label; falls back to the raw id if unknown (forward-compatible). */
export function flowerLabel(id: string): string {
  return LABEL.get(id) ?? id;
}

/** Map a listing's flower_types (ids) to display labels, dropping unknowns. */
export function flowerLabels(ids: string[]): string[] {
  return ids.map(flowerLabel);
}
