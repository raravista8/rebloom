// Icon set mirroring canon's stroke glyphs (packages/canon primitives/kit `PdI`
// and feed `Ic`) so composed web/ screens match canon visually. Sized via canon's
// .pd-i* classes (canon.css). These are intentionally identical path data to canon
// — canon doesn't export its internal icon maps, and re-composing canon-classed
// markup in web/ is the documented pattern (CANON_PACKAGE_TZ §10).
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function svg(className: string | undefined, children: React.ReactNode, rest: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconBack({ className = 'pd-i22', ...p }: IconProps) {
  return svg(className, <path d="m15 5-7 7 7 7" />, p);
}
export function IconCheck({ className = 'pd-i16', ...p }: IconProps) {
  return svg(className, <path d="m5 12.5 4.5 4.5L19 7" />, p);
}
export function IconLock({ className = 'pd-i16', ...p }: IconProps) {
  return svg(
    className,
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>,
    p,
  );
}
export function IconHome({ className = 'pd-i24', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </>,
    p,
  );
}
export function IconSearch({ className = 'pd-i24', ...p }: IconProps) {
  return svg(
    className,
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>,
    p,
  );
}
export function IconPlus({ className = 'pd-i24', ...p }: IconProps) {
  return svg(className, <path d="M12 5v14M5 12h14" />, p);
}
export function IconDeals({ className = 'pd-i24', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M4 7h16v12H4z" />
      <path d="M9 7V5h6v2" />
      <path d="M4 12h16" />
    </>,
    p,
  );
}
export function IconUser({ className = 'pd-i24', ...p }: IconProps) {
  return svg(
    className,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </>,
    p,
  );
}
export function IconPin({ className = 'pd-i16', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    p,
  );
}
export function IconChev({ className = 'pd-i14', ...p }: IconProps) {
  return svg(className, <path d="m6 9 6 6 6-6" />, p);
}
export function IconX({ className = 'pd-i14', ...p }: IconProps) {
  return svg(className, <path d="M6 6l12 12M18 6 6 18" />, p);
}
export function IconCamera({ className = 'pd-i24', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M3 8h3l1.5-2.5h9L18 8h3v12H3z" />
      <circle cx="12" cy="13.5" r="3.6" />
    </>,
    p,
  );
}
export function IconBell({ className = 'pd-i20', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>,
    p,
  );
}
export function IconHeartLine({ className = 'pd-i20', ...p }: IconProps) {
  return svg(className, <path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.6 5.9 4.6c2 0 3.3 1.2 4.1 2.4.8-1.2 2.1-2.4 4.1-2.4 3.3 0 4.6 3.4 3.1 6.4C19 15.4 12 20 12 20Z" />, p);
}
export function IconLogout({ className = 'pd-i20', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M10 12h9M16 9l3 3-3 3" />
    </>,
    p,
  );
}
export function IconTrash({ className = 'pd-i20', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </>,
    p,
  );
}
export function IconFwd({ className = 'pd-i18', ...p }: IconProps) {
  return svg(className, <path d="m9 5 7 7-7 7" />, p);
}
export function IconSend({ className = 'pd-i20', ...p }: IconProps) {
  return svg(className, <path d="M4 12 20 5l-6 15-3-6-7-2Z" />, p);
}
export function IconFlag({ className = 'pd-i20', ...p }: IconProps) {
  return svg(className, <path d="M5 21V4m0 1h12l-2.5 4L17 13H5" />, p);
}
export function IconShield({ className = 'pd-i18', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>,
    p,
  );
}
export function IconInfo({ className = 'pd-i18', ...p }: IconProps) {
  return svg(
    className,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.5" />
    </>,
    p,
  );
}
export function IconCart({ className = 'pd-i18', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M3 4h2l2.2 11h10L20 7H6.5" />
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
    </>,
    p,
  );
}
export function IconWalk({ className = 'pd-i16', ...p }: IconProps) {
  return svg(
    className,
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 8v6m0 0-3 6m3-6 3 6M8 11h8" />
    </>,
    p,
  );
}
export function IconTruck({ className = 'pd-i16', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M2 7h11v8H2zM13 10h4l3 3v2h-7z" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </>,
    p,
  );
}

// Star is FILLED (color comes from .pd-star), unlike the stroke icons above.
export function IconStar({ className = 'pd-i13 pd-star', ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...p}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" />
    </svg>
  );
}
export function IconSliders({ className = 'pd-i20', ...p }: IconProps) {
  return svg(
    className,
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17" r="2.2" fill="currentColor" stroke="none" />
    </>,
    p,
  );
}
