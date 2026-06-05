'use client';
// Shared ≥1024px breakpoint hook (matchMedia). SSR and the first client paint
// render the mobile tree (there is no viewport on the server); the effect corrects
// to desktop on mount. Because the first client render matches SSR (false), there is
// no hydration mismatch. One layout tree is mounted at a time.
import { useEffect, useState } from 'react';

export default function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return desktop;
}
