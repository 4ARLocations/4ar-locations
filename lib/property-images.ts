import { redis } from '@/lib/redis';

export async function getPropertyImages(propertyId: string, defaultImages: string[]): Promise<string[]> {
  try {
    const stored = await redis.get(`property-photos:${propertyId}`);
    if (Array.isArray(stored) && stored.length > 0) return stored as string[];
  } catch { /* Redis indisponible */ }
  return defaultImages;
}

export async function getPhotoCategories(propertyId: string): Promise<Record<string, string>> {
  try {
    const stored = await redis.get(`property-photo-categories:${propertyId}`);
    if (stored && typeof stored === 'object') return stored as Record<string, string>;
  } catch { /* ignore */ }
  return {};
}

export async function savePhotoCategories(propertyId: string, categories: Record<string, string>): Promise<void> {
  await redis.set(`property-photo-categories:${propertyId}`, categories);
}
