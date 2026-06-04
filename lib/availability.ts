/**
 * Gestion des disponibilités — périodes bloquées par logement
 * Stockées dans Redis : clé `availability:{propertyId}` → liste JSON
 */
import { redis } from './redis';

export type BlockSource = 'airbnb' | 'booking' | 'direct' | 'blocked' | 'family';

export interface AvailabilityBlock {
  id: string;
  propertyId: string;
  start: string;   // "YYYY-MM-DD"
  end: string;     // "YYYY-MM-DD"
  label: string;   // Texte libre : "Famille", "Réservé Airbnb"…
  source: BlockSource;
}

const key = (propertyId: string) => `availability:${propertyId}`;

export async function getBlocks(propertyId: string): Promise<AvailabilityBlock[]> {
  const raw = await redis.lrange(key(propertyId), 0, -1);
  return raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r)) as AvailabilityBlock[];
}

export async function getAllBlocks(): Promise<AvailabilityBlock[]> {
  const { properties } = await import('./properties');
  const all = await Promise.all(properties.map((p) => getBlocks(p.id)));
  return all.flat();
}

export async function addBlock(block: AvailabilityBlock): Promise<void> {
  await redis.lpush(key(block.propertyId), JSON.stringify(block));
}

export async function deleteBlock(propertyId: string, blockId: string): Promise<void> {
  // Redis LREM : on re-charge la liste, filtre, et réécrit
  const blocks = await getBlocks(propertyId);
  const filtered = blocks.filter((b) => b.id !== blockId);
  // Supprimer l'ancienne liste et réécrire
  await redis.del(key(propertyId));
  for (const b of filtered.reverse()) {
    await redis.lpush(key(propertyId), JSON.stringify(b));
  }
}

/** Vérifier si une date (YYYY-MM-DD) est dans un bloc bloqué */
export function isDateBlocked(date: string, blocks: AvailabilityBlock[]): boolean {
  return blocks.some((b) => date >= b.start && date <= b.end);
}

/** Couleur selon la source */
export const SOURCE_COLORS: Record<BlockSource, string> = {
  airbnb:  '#FF5A5F',
  booking: '#003580',
  direct:  '#C8763A',
  blocked: '#6B6B6B',
  family:  '#6B7C45',
};

export const SOURCE_LABELS: Record<BlockSource, string> = {
  airbnb:  'Airbnb',
  booking: 'Booking.com',
  direct:  'Réservation directe',
  blocked: 'Bloqué',
  family:  'Famille / Personnel',
};
