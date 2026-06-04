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
} from '@rebloom/canon';

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

export const PdBtn = PdBtnRaw as unknown as FC<PdBtnProps>;
export const PdField = PdFieldRaw as unknown as FC<PdFieldProps>;
export const PdNotice = PdNoticeRaw as unknown as FC<PdNoticeProps>;
