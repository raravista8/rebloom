// Bouquet card — mirrors canon's .pd-card markup (canon's own Card hardcodes a demo
// image path PD_IMG(), so we re-compose the same canon-classed DOM with a real
// photo_thumb_url + live listing data). Reuses canon PdFreshness/PdAvatar + the
// wired LikeButton. Links to the listing detail.
import Link from 'next/link';
import { PdFreshness, PdAvatar } from '@/components/canon';
import { IconPin, IconStar } from '@/components/icons';
import LikeButton from '@/components/feed/LikeButton';
import { formatPriceKopecks } from '@/lib/format';
import { cityName } from '@/lib/cities';
import type { ListingCard } from '@/lib/types';

export default function BouquetCard({
  listing,
  variant,
}: {
  listing: ListingCard;
  variant: 'rail' | 'grid';
}) {
  const ar = variant === 'rail' ? '3 / 4' : '1 / 1';
  return (
    <Link href={`/l/${listing.id}`} className="pd-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className={`pd-card pd-card--${variant}`}>
        <div className="pd-photo-wrap" style={{ aspectRatio: ar }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pd-photo" src={listing.photo_thumb_url} alt="Букет" loading="lazy" />
          <div className="pd-photo-top">
            <PdFreshness kind={listing.freshness} />
            <LikeButton listingId={listing.id} liked={listing.liked} count={listing.like_count} />
          </div>
        </div>
        <div className="pd-card-body">
          <div className="pd-price-row">
            <span className="pd-price">{formatPriceKopecks(listing.price_kopecks)}</span>
            <span className="pd-size">{listing.size}</span>
          </div>
          <div className="pd-meta">
            <IconPin className="pd-i14" />
            <span className="pd-district">{cityName(listing.city_id)}</span>
          </div>
          <div className="pd-seller">
            <PdAvatar seller={{ n: listing.seller.display_name || 'Продавец' }} size={21} />
            <span className="pd-seller-n">{listing.seller.display_name || 'Продавец'}</span>
            <span className="pd-rating">
              {listing.seller.seller_rating != null ? (
                <><IconStar className="pd-i13 pd-star" /> {listing.seller.seller_rating.toFixed(1)}</>
              ) : (
                'Новый'
              )}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
