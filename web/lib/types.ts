// Shared domain enums + shapes — mirror API_CONTRACT.md §1 exactly (the single
// source of truth). Frontend must never invent statuses.

export type Size = 'S' | 'M' | 'L' | 'XL';
export type Freshness = 'today' | 'd1_2' | 'd3_plus';
// No-escrow «оплата при встрече» (ADR-0013): agreed → meeting → done (+ problem, cancelled).
export type DealStatus = 'agreed' | 'meeting' | 'done' | 'problem' | 'cancelled';
export type DeliveryMethod = 'self_pickup' | 'courier';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'reserved' | 'sold' | 'archived';
export type FeedSection = 'fresh' | 'liked';

export interface User {
  id: string;
  display_name: string | null;
  phone_masked: string;
  city_id: string;
  roles: string[];
  seller_rating: number | null;
  deals_count: number;
}

export interface ListingCardSeller {
  id: string;
  display_name: string | null;
  seller_rating: number | null;
}

// metro (API_CONTRACT §3): one entry per line; transfer hubs carry several (multi-colour
// dots). `null` for no-metro cities → the card/detail falls back to city/район.
export interface MetroRef {
  id: string;
  name: string;
  lines: { name: string; color: string }[];
}

export interface ListingCard {
  id: string;
  photo_thumb_url: string;
  size: Size;
  freshness: Freshness;
  price_kopecks: number;
  city_id: string;
  metro: MetroRef | null;
  flower_types: string[];
  like_count: number;
  liked: boolean;
  seller: ListingCardSeller;
}

export interface ListingPhoto {
  card_url: string;
  full_url: string;
}

// GET /api/listings/{id} (detail) — listing_card fields + these.
export interface ListingDetail {
  id: string;
  photos: ListingPhoto[];
  size: Size;
  freshness: Freshness;
  price_kopecks: number;
  city_id: string;
  metro: MetroRef | null;
  flower_types: string[];
  status: ListingStatus;
  like_count: number;
  liked: boolean;
  freshness_score?: number;
  expires_at?: string;
  geo_coarse?: unknown;
  seller: ListingCardSeller & { deals_count?: number };
}

export interface Deal {
  id: string;
  status: DealStatus;
}

// GET /api/deals/{id} (API_CONTRACT §4)
export interface DealView {
  id: string;
  status: DealStatus;
  // listing/counterparty display fields are enriched server-side over time; treat
  // photo/price/name/rating as optional and fall back gracefully.
  listing: { id: string; photo_thumb_url?: string; price_kopecks?: number };
  role: 'buyer' | 'seller';
  counterparty: { id: string; display_name?: string; seller_rating?: number };
  // No-escrow (ADR-0013): the platform processes no payment. price is the listing's
  // reference price (in `listing.price_kopecks`); `done_at` is set on completion.
  delivery_method: DeliveryMethod;
  created_at?: string;
  done_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  body: string;
  held: boolean;
  mine: boolean;
  created_at: string;
}

// GET /api/users/{id} (API_CONTRACT §5)
export interface PublicUser {
  id: string;
  display_name: string | null;
  city_id?: string;
  seller_rating: number | null;
  deals_count: number;
}
export interface ReviewItem {
  id: string;
  author_id: string;
  score: number;
  text: string;
  created_at: string;
}
export interface ProfileResponse {
  user: PublicUser;
  reviews: ReviewItem[];
  active_listings: ListingCard[];
}

export interface AppNotification {
  id: string;
  kind: string;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  deals: boolean;
  messages: boolean;
  marketing: boolean;
}

// Admin (ADMIN_BACKEND_TZ). Loosely typed — operator-facing, fields may extend.
export interface AdminOverview {
  online: number;
  dau: number;
  mau: number;
  users_total: number;
  users_by_city?: Record<string, number>;
  users_by_platform?: Record<string, number>;
  gmv_kopecks: number;
  commission_kopecks: number;
  deals_by_status?: Record<string, number>;
  growth_series?: unknown;
}
export interface ModerationQueueItem {
  id: string;
  type: 'listing' | 'review';
  created_at: string | null;
  text?: string;
  size?: string;
  freshness?: string;
  price_kopecks?: number;
  city_id?: string;
  score?: number;
  [k: string]: unknown;
}

export interface Paginated<T> {
  items: T[];
  next_cursor: string | null;
  // /api/search returns `total` = count of ALL active listings matching the filters in
  // the city (not just the page) — feeds «Показать N букетов» (API_CONTRACT §3).
  total?: number;
  applied?: { city_id?: string | null; q?: string | null; filters?: unknown };
  suggestions?: { type: string; label: string; href: string }[];
}

// /api/search params (API_CONTRACT §3). `metro` and `flower` are repeatable (OR within a
// group, AND across groups). Passed as one `metro=`/`flower=` per value.
export interface SearchParams {
  city_id: string;
  q?: string;
  size?: Size;
  freshness?: Freshness;
  price_min?: number;
  price_max?: number;
  metro?: string[];
  flower?: string[];
  cursor?: string;
  limit?: number;
}
