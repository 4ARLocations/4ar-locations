import { redis } from '@/lib/redis';
import FloorPlanImageViewer from './FloorPlanImageViewer';
import { FLOOR_HOTSPOTS } from '@/lib/floor-plan-hotspots';

const FLOOR_PLAN_PROPERTIES = new Set(['lauris-meme', 'lauris-atelier']);

interface Props {
  propertyId: string;
}

export default async function FloorPlanSection({ propertyId }: Props) {
  if (!FLOOR_PLAN_PROPERTIES.has(propertyId)) return null;

  const floors = FLOOR_HOTSPOTS[propertyId];
  if (!floors) return null;

  // Positions personnalisées des hotspots (depuis Redis si admin les a déplacés)
  let hotspotPositions: Record<string, { x: number; y: number }> | undefined;
  // Photos par pièce (depuis Redis si admin les a assignées)
  let roomPhotos: Record<string, string[]> | undefined;

  try {
    const [posRaw, photoRaw] = await Promise.all([
      redis.get(`hotspot-positions:${propertyId}`),
      redis.get(`floorplan-rooms:${propertyId}`),
    ]);
    if (posRaw && typeof posRaw === 'object') hotspotPositions = posRaw as Record<string, { x: number; y: number }>;
    if (photoRaw && typeof photoRaw === 'object') roomPhotos = photoRaw as Record<string, string[]>;
  } catch {
    // Silently fall back to defaults
  }

  // Fusionner les positions Redis avec les données statiques
  const floorsWithPositions = hotspotPositions
    ? floors.map(f => ({
        ...f,
        hotspots: f.hotspots.map(h => ({
          ...h,
          ...(hotspotPositions![h.id] ?? {}),
        })),
      }))
    : floors;

  return (
    <FloorPlanImageViewer
      propertyId={propertyId}
      floors={floorsWithPositions}
      roomPhotos={roomPhotos}
    />
  );
}
