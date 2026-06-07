'use client';
// Flower-type multiselect — canon's `.pd-flowerpick`/`.pd-fbchip` markup (kit.jsx) over
// the backend flower catalog (lib/flowers.ts). Shows RU labels, EMITS ids — canon's own
// PdFlowerPicker works in RU labels, which the backend (keyed by id) can't accept, so we
// compose the same canon CSS (CANON_PACKAGE_TZ §10). Optional, multiselect, OR semantics.
import { IconCheck } from '@/components/icons';
import { FLOWERS } from '@/lib/flowers';

export default function FlowerPicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div className="pd-flowerpick">
      {FLOWERS.map((f) => {
        const on = value.includes(f.id);
        return (
          <button
            type="button"
            key={f.id}
            className={'pd-fbchip' + (on ? ' on' : '')}
            onClick={() => toggle(f.id)}
            aria-pressed={on}
          >
            {on && <IconCheck className="pd-i14" />}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
