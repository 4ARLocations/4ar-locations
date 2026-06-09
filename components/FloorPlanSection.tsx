import { redis } from '@/lib/redis';
import FloorPlanDraw from './FloorPlanDraw';
import { FLOOR_PLAN_DATA } from '@/lib/floor-plan-data';

const FLOOR_PLAN_PROPERTIES = new Set(['lauris-meme', 'lauris-atelier']);

interface Props {
  propertyId: string;
}

export default async function FloorPlanSection({ propertyId }: Props) {
  if (!FLOOR_PLAN_PROPERTIES.has(propertyId)) return null;
  if (!FLOOR_PLAN_DATA[propertyId]) return null;

  let roomPhotos: Record<string, string[]> | undefined;
  try {
    const raw = await redis.get(`floorplan-rooms:${propertyId}`);
    if (raw && typeof raw === 'object') {
      roomPhotos = raw as Record<string, string[]>;
    }
  } catch {
    // Silently fall back to defaults
  }

  return <FloorPlanDraw propertyId={propertyId} roomPhotos={roomPhotos} />;
}
