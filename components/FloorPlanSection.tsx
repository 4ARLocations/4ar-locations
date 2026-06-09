import { redis } from '@/lib/redis';
import FloorPlanInteractive from './FloorPlanInteractive';
import { FLOOR_PLAN_ROOMS } from '@/lib/floor-plan-rooms';

// Plans disponibles UNIQUEMENT pour ces deux logements
const FLOOR_PLAN_PROPERTIES = new Set(['lauris-meme', 'lauris-atelier']);

interface Props {
  propertyId: string;
}

export default async function FloorPlanSection({ propertyId }: Props) {
  // Afficher seulement pour Mémé et Atelier
  if (!FLOOR_PLAN_PROPERTIES.has(propertyId)) return null;
  if (!FLOOR_PLAN_ROOMS[propertyId]) return null;

  // Charger les associations pièce → photos depuis Redis (override admin)
  let roomPhotos: Record<string, string[]> | undefined;
  try {
    const raw = await redis.get(`floorplan-rooms:${propertyId}`);
    if (raw && typeof raw === 'object') {
      roomPhotos = raw as Record<string, string[]>;
    }
  } catch {
    // Silently fall back to defaults in floor-plan-rooms.ts
  }

  return <FloorPlanInteractive propertyId={propertyId} roomPhotos={roomPhotos} />;
}
