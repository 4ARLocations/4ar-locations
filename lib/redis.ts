/**
 * Client Upstash Redis
 * Variables d'environnement requises :
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * À configurer dans : Vercel Dashboard → Project → Settings → Environment Variables
 * (après avoir créé une base Redis gratuite sur https://upstash.com)
 */
import { Redis } from '@upstash/redis';

// En développement local sans Redis configuré, on renvoie un client factice
// qui stocke en mémoire pour ne pas bloquer `npm run dev`
function makeDevFallback() {
  const store: Record<string, unknown> = {};
  return {
    lrange: async (key: string) => (store[key] as unknown[]) ?? [],
    lpush: async (key: string, ...vals: unknown[]) => {
      if (!store[key]) store[key] = [];
      (store[key] as unknown[]).unshift(...vals);
    },
    set: async (key: string, val: unknown) => { store[key] = val; },
    get: async (key: string) => store[key] ?? null,
    exists: async (key: string) => (key in store ? 1 : 0),
    del: async (...keys: string[]) => { keys.forEach((k) => delete store[k]); return keys.length; },
  };
}

let redis: ReturnType<typeof Redis.fromEnv> | ReturnType<typeof makeDevFallback>;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
} else {
  console.warn('[4AR] Upstash Redis non configuré — utilisation du stockage en mémoire (développement)');
  redis = makeDevFallback() as unknown as ReturnType<typeof Redis.fromEnv>;
}

export { redis };

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface Review {
  id: string;
  propertyId: string;
  propertyName: string;
  author: string;
  date: string;        // "2024-08"
  rating: number;
  comment: string;
  photos?: string[];   // URLs Vercel Blob (max 3)
  createdAt: string;   // ISO
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  checkin: string;     // "YYYY-MM-DD"
  checkout: string;    // "YYYY-MM-DD"
  guests: string;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Avis
// ─────────────────────────────────────────────

export async function getReviews(propertyId: string): Promise<Review[]> {
  const key = `reviews:${propertyId}`;
  const raw = await redis.lrange(key, 0, -1);
  return raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r)) as Review[];
}

export async function addReview(review: Review): Promise<void> {
  const key = `reviews:${review.propertyId}`;
  await redis.lpush(key, JSON.stringify(review));
}

// ─────────────────────────────────────────────
// Réservations
// ─────────────────────────────────────────────

export async function addBooking(booking: Booking): Promise<void> {
  await redis.lpush('bookings', JSON.stringify(booking));
}

export async function getAllBookings(): Promise<Booking[]> {
  const raw = await redis.lrange('bookings', 0, -1);
  return raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r)) as Booking[];
}

export async function isNotified(key: string): Promise<boolean> {
  const exists = await redis.exists(key);
  return exists === 1;
}

export async function markNotified(key: string): Promise<void> {
  await redis.set(key, '1');
}

// ─────────────────────────────────────────────
// Réponses propriétaire aux avis
// ─────────────────────────────────────────────

export interface OwnerReply {
  text: string;
  date: string; // ISO
}

export async function getOwnerReply(reviewId: string): Promise<OwnerReply | null> {
  const raw = await redis.get(`review-reply:${reviewId}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw as OwnerReply;
}

export async function setOwnerReply(reviewId: string, text: string): Promise<void> {
  const reply: OwnerReply = { text, date: new Date().toISOString() };
  await redis.set(`review-reply:${reviewId}`, JSON.stringify(reply));
}
