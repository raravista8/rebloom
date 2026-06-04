// Minimal icon set mirroring canon's stroke glyphs (packages/canon primitives/kit
// PdI) so composed web/ screens match canon visually. Sized via canon's .pd-i*
// classes (canon.css). Stroke styling matches canon usage (currentColor, no fill).
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const base = (className?: string): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className,
});

export function IconBack({ className = 'pd-i22', ...p }: IconProps) {
  return (
    <svg {...base(className)} {...p}>
      <path d="m15 5-7 7 7 7" />
    </svg>
  );
}

export function IconCheck({ className = 'pd-i16', ...p }: IconProps) {
  return (
    <svg {...base(className)} {...p}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconLock({ className = 'pd-i16', ...p }: IconProps) {
  return (
    <svg {...base(className)} {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2.2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
