'use client';
// Wired like button — mirrors canon's .pd-like-btn markup (PdHeart) but persists to
// the API optimistically (canon's PdLikeBtn toggles local state only). FR-015.
// Unauthenticated like → 401 → revert + go to /login.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdHeart } from '@/components/canon';
import { api, ApiError } from '@/lib/api';
import useMe from '@/lib/useMe';

const loginNext = () =>
  '/login?next=' + encodeURIComponent(window.location.pathname + window.location.search);

export default function LikeButton({
  listingId,
  liked: liked0,
  count: count0,
  big = false,
}: {
  listingId: string;
  liked: boolean;
  count: number;
  big?: boolean;
}) {
  const router = useRouter();
  const { authed } = useMe();
  const [liked, setLiked] = useState(liked0);
  const [count, setCount] = useState(count0);
  const [pop, setPop] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (busy) return;
    // Known guest → straight to login (no optimistic heart-fill flicker), and come back.
    if (authed === false) {
      router.push(loginNext());
      return;
    }
    const next = !liked;
    // optimistic
    setLiked(next);
    setCount((n) => n + (next ? 1 : -1));
    if (next) {
      setPop(true);
      setTimeout(() => setPop(false), 420);
    }
    setBusy(true);
    try {
      const res = await api[next ? 'post' : 'delete']<{ like_count: number; liked: boolean }>(
        `/listings/${listingId}/like`,
      );
      setLiked(res.liked);
      setCount(res.like_count);
    } catch (err) {
      // revert
      setLiked(!next);
      setCount((n) => n - (next ? 1 : -1));
      if (err instanceof ApiError && err.code === 'unauthorized') router.push(loginNext());
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className={`pd-like-btn${big ? ' pd-like-btn--big' : ''}${pop ? ' pd-pop' : ''}`}
      aria-pressed={liked}
      aria-label={liked ? 'Убрать лайк' : 'Лайк'}
      onClick={toggle}
    >
      <PdHeart filled={liked} className="pd-like-heart" />
      <span className="pd-like-n" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </span>
    </button>
  );
}
