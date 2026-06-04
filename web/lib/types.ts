// Shared domain enums + shapes — mirror API_CONTRACT.md §1 exactly (the single
// source of truth). Frontend must never invent statuses.

export type Size = 'S' | 'M' | 'L' | 'XL';
export type Freshness = 'today' | 'd1_2' | 'd3_plus';
export type DealStatus = 'created' | 'paid_held' | 'released' | 'refunded' | 'disputed' | 'cancelled';
export type DeliveryMethod = 'self_pickup' | 'courier';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'reserved' | 'sold' | 'archived';
export type FeedSection = 'fresh' | 'liked';

export interface User {
  id: string;
  display_name: string;
  phone_masked: string;
  city_id: string;
  roles: string[];
  seller_rating: number;
  deals_count: number;
}

export interface ListingCardSeller {
  id: string;
  display_name: string;
  seller_rating: number;
}

export interface ListingCard {
  id: string;
  photo_thumb_url: string;
  size: Size;
  freshness: Freshness;
  price_kopecks: number;
  city_id: string;
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
  amount_kopecks: number;
  commission_kopecks: number;
  delivery_method: DeliveryMethod;
  delivery?: { tracking_status?: string };
  created_at?: string;
  released_at?: string;
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
  display_name: string;
  city_id?: string;
  seller_rating: number;
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
  applied?: { city_id?: string | null; q?: string | null; filters?: unknown };
  suggestions?: { type: string; label: string; href: string }[];
}
