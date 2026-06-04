'use client';
// Photo carousel — mirrors canon's .pd-gallery markup but with REAL photo URLs
// (canon's PdGallery hardcodes the demo image path PD_IMG()). Swipe + tap zones +
// dots. 1–5 photos (FR-010).
import { useState } from 'react';
import type { ListingPhoto } from '@/lib/types';

export default function PhotoGallery({ photos }: { photos: ListingPhoto[] }) {
  const [idx, setIdx] = useState(0);
  const count = photos.length || 1;
  const clamp = (n: number) => Math.max(0, Math.min(count - 1, n));
  const photo = photos[idx];

  let startX = 0;
  return (
    <div className="pd-gallery" style={{ position: 'relative' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo?.full_url ?? photo?.card_url ?? ''}
        alt={`Букет, фото ${idx + 1}`}
        onTouchStart={(e) => {
          startX = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX;
          if (dx < -40) setIdx((i) => clamp(i + 1));
          else if (dx > 40) setIdx((i) => clamp(i - 1));
        }}
      />
      {count > 1 && (
        <>
          {/* tap zones for pointer users */}
          <button
            aria-label="Предыдущее фото"
            onClick={() => setIdx((i) => clamp(i - 1))}
            style={{ position: 'absolute', inset: '0 60% 0 0', background: 'none', border: 0, cursor: 'pointer' }}
          />
          <button
            aria-label="Следующее фото"
            onClick={() => setIdx((i) => clamp(i + 1))}
            style={{ position: 'absolute', inset: '0 0 0 60%', background: 'none', border: 0, cursor: 'pointer' }}
          />
          <span className="pd-gcount">
            {idx + 1} / {count}
          </span>
          <div className="pd-gdots">
            {photos.map((_, i) => (
              <i key={i} className={i === idx ? 'on' : ''} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
