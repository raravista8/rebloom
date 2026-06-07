// Typed adapter over @rebloom/canon primitives.
//
// canon's generated .d.ts types every prop as `any` AND required (no `?`), which
// makes the components unusable from strict TSX without passing every prop. We do
// NOT fork or restyle them — we only re-declare correct, optional prop types over
// the SAME runtime components (composition per CANON_PACKAGE_TZ §10). Add entries
// here as screens start using more primitives.
import type {
  FC,
  ReactNode,
  ButtonHTMLAttributes,
} from 'react';
import {
  PdBtn as PdBtnRaw,
  PdField as PdFieldRaw,
  PdNotice as PdNoticeRaw,
  PdFreshness as PdFreshnessRaw,
  PdAvatar as PdAvatarRaw,
  PdHeart as PdHeartRaw,
  PdSkelCard as PdSkelCardRaw,
  PdEmpty as PdEmptyRaw,
  PdStars as PdStarsRaw,
  PdStepper as PdStepperRaw,
  PdBubble as PdBubbleRaw,
  PdMetroPicker as PdMetroPickerRaw,
  PdFlowerPicker as PdFlowerPickerRaw,
  PdWebNav as PdWebNavRaw,
  PdCatalog as PdCatalogRaw,
} from '@rebloom/canon';
import type { Freshness } from '@/lib/types';

type IconFn = (p: { className?: string; fill?: string; stroke?: string }) => ReactNode;

export type PdBtnProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  block?: boolean;
  lg?: boolean;
  loading?: boolean;
  icon?: IconFn;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'icon'>;

export type PdFieldProps = {
  label?: ReactNode;
  opt?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  counter?: ReactNode;
  children?: ReactNode;
};

export type PdNoticeProps = {
  kind?: 'info' | 'ok' | 'warn' | 'danger';
  icon?: IconFn;
  children?: ReactNode;
};

export type PdFreshnessProps = { kind: Freshness };
export type PdAvatarProps = { seller: { n: string; av?: string; r?: number }; size?: number };
export type PdHeartProps = { filled?: boolean; className?: string };
export type PdEmptyProps = { glyph?: IconFn; title?: ReactNode; text?: ReactNode; children?: ReactNode };

export const PdBtn = PdBtnRaw as unknown as FC<PdBtnProps>;
export const PdField = PdFieldRaw as unknown as FC<PdFieldProps>;
export const PdNotice = PdNoticeRaw as unknown as FC<PdNoticeProps>;
export const PdFreshness = PdFreshnessRaw as unknown as FC<PdFreshnessProps>;
export const PdAvatar = PdAvatarRaw as unknown as FC<PdAvatarProps>;
export const PdHeart = PdHeartRaw as unknown as FC<PdHeartProps>;
export const PdSkelCard = PdSkelCardRaw as unknown as FC;
export const PdEmpty = PdEmptyRaw as unknown as FC<PdEmptyProps>;
export type PdStarsProps = { value?: number; input?: boolean };
export const PdStars = PdStarsRaw as unknown as FC<PdStarsProps>;
export type PdStepperProps = { status: string };
export const PdStepper = PdStepperRaw as unknown as FC<PdStepperProps>;
export type PdBubbleProps = { kind?: 'in' | 'out' | 'sys'; time?: string; children?: ReactNode };
export const PdBubble = PdBubbleRaw as unknown as FC<PdBubbleProps>;

// ── canon 0.9.0: pickers (./forms) + the unified web header / catalog (./catalog) ──
export type PdMetroPickerProps =
  | { cityKey?: string; value?: string; onChange?: (station: string) => void; placeholder?: string; multi?: false }
  | { cityKey?: string; multi: true; values: string[]; onToggle: (station: string | null) => void; placeholder?: string };
export const PdMetroPicker = PdMetroPickerRaw as unknown as FC<PdMetroPickerProps>;

export type PdFlowerPickerProps = { value?: string[]; onChange?: (next: string[]) => void; options?: string[] };
export const PdFlowerPicker = PdFlowerPickerRaw as unknown as FC<PdFlowerPickerProps>;

export type PdWebNavProps = {
  active?: string;
  authed?: boolean;
  city?: string;
  user?: { n: string; r?: number };
  links?: { label: string; sub?: string; href: string; Icon: IconFn }[];
  onPublish?: () => void;
};
export const PdWebNav = PdWebNavRaw as unknown as FC<PdWebNavProps>;

export type PdCatalogProps = { platform?: 'desktop' | 'web' };
export const PdCatalog = PdCatalogRaw as unknown as FC<PdCatalogProps>;
