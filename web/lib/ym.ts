// Yandex Metrica — typed `reachGoal` + SPA `hit` helpers. Fully inert (no-op) until
// NEXT_PUBLIC_YM_COUNTER_ID is set, so dev/CI send nothing. See
// docs/runbooks/yandex-metrica.md for the counter setup + the 5 goals.
type YmFn = (id: number, action: string, ...args: unknown[]) => void;
declare global {
  interface Window {
    ym?: YmFn;
  }
}

export const YM_ID = process.env.NEXT_PUBLIC_YM_COUNTER_ID ? Number(process.env.NEXT_PUBLIC_YM_COUNTER_ID) : 0;

// The five funnel goals (must match the JS-event IDs configured in Metrica).
export type Goal = 'registration' | 'listing_published' | 'deal_started' | 'deal_done' | 'review_left';

export function reachGoal(goal: Goal, params?: Record<string, unknown>): void {
  if (!YM_ID || typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(YM_ID, 'reachGoal', goal, params);
  } catch {
    /* analytics must never break the app */
  }
}

export function ymHit(url: string): void {
  if (!YM_ID || typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(YM_ID, 'hit', url);
  } catch {
    /* ignore */
  }
}
