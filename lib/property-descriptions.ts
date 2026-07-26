import { redis } from '@/lib/redis';

const key = (propertyId: string, locale: string) => `property-desc:${propertyId}:${locale}`;

export async function getCustomDescription(propertyId: string, locale: string): Promise<string | null> {
  try {
    const val = await redis.get(key(propertyId, locale));
    return typeof val === 'string' ? val : null;
  } catch {
    return null;
  }
}

export async function getAllCustomDescriptions(propertyId: string): Promise<Record<string, string | null>> {
  const [fr, en, de] = await Promise.all([
    getCustomDescription(propertyId, 'fr'),
    getCustomDescription(propertyId, 'en'),
    getCustomDescription(propertyId, 'de'),
  ]);
  return { fr, en, de };
}

export async function saveCustomDescriptions(
  propertyId: string,
  descriptions: { fr?: string; en?: string; de?: string }
): Promise<void> {
  const ops: Promise<unknown>[] = [];
  for (const [locale, text] of Object.entries(descriptions)) {
    if (text !== undefined) ops.push(redis.set(key(propertyId, locale), text));
  }
  await Promise.all(ops);
}
