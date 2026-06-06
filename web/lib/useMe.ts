'use client';
// Client-side auth state for the app chrome (WebChrome header / BottomNav). The session
// is an HttpOnly cookie, so the client can't read it directly — it asks GET /api/me once.
// Module-cached so navigating between app screens doesn't re-fetch or re-flash the chrome.
//
// `authed === null` = not yet known (SSR / first client paint). Callers MUST render the
// GUEST chrome for null, so a guest never flashes the logged-in toolbar (the bug this
// fixes). SSR and the first client render both see null → guest → no hydration mismatch;
// the effect corrects to the logged-in chrome on mount if /api/me succeeds.
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

function load(): Promise<boolean> {
  if (!inflight) {
    inflight = api.get('/me').then(
      () => (cached = true),
      () => (cached = false), // 401/unauthorized (or offline) → treat as guest
    );
  }
  return inflight;
}

export default function useMe(): { authed: boolean | null } {
  const [authed, setAuthed] = useState<boolean | null>(cached);
  useEffect(() => {
    if (cached !== null) {
      setAuthed(cached);
      return;
    }
    let alive = true;
    void load().then((v) => {
      if (alive) setAuthed(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return { authed };
}
