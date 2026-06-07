// Metro label — canon's `.pd-metro` / `.pd-mdots` markup (feed.jsx) fed with LIVE data.
// canon's own PdMetroLabel/PdMetroDots look colours up by line-id in PD_METRO_LINES; our
// backend ships the line colours explicitly on the MetroRef (per API_CONTRACT §3), so we
// re-compose the same canon-classed DOM with those colours — same CSS, real data (the
// same composition pattern BouquetCard uses for the card photo).
import type { MetroRef } from '@/lib/types';

export default function MetroLabel({ metro, dotSize = 8 }: { metro: MetroRef; dotSize?: number }) {
  const lines = metro.lines.length ? metro.lines : [{ name: '', color: '#A1A2A3' }];
  return (
    <span className="pd-metro">
      <span className="pd-mdots" aria-hidden="true">
        {lines.slice(0, 3).map((l, i) => (
          <i key={i} style={{ background: l.color || '#A1A2A3', width: dotSize, height: dotSize }} />
        ))}
      </span>
      <span className="pd-metro-n">м.&nbsp;{metro.name}</span>
    </span>
  );
}
