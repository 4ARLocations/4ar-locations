import { redis } from '@/lib/redis';

/**
 * Retourne les photos d'un bien, en privilégiant l'override Redis sur les défauts.
 */
export async function getPropertyImages(propertyId: string, defaultImages: string[]): Promise<string[]> {
  try {
    const stored = await redis.get(`property-photos:${propertyId}`);
    if (Array.isArray(stored) && stored.length > 0) {
      return stored as string[];
    }
  } catch {
    // Redis indisponible → on utilise les défauts
  }
  return defaultImages;
}
