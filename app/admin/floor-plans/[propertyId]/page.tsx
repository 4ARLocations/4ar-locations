import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { FLOOR_PLAN_ROOMS } from '@/lib/floor-plan-rooms';
import { properties } from '@/lib/properties';
import RoomPhotoEditor from '@/components/admin/RoomPhotoEditor';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['lauris-meme', 'lauris-atelier']);

export default async function FloorPlanEditorPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  const { propertyId } = await params;

  if (!ALLOWED.has(propertyId) || !FLOOR_PLAN_ROOMS[propertyId]) {
    redirect('/admin/floor-plans');
  }

  const property = properties.find((p) => p.id === propertyId);
  if (!property) redirect('/admin/floor-plans');

  // Charger les associations pièce → photos depuis Redis
  let initialRoomPhotos: Record<string, string[]> = {};
  try {
    const raw = await redis.get(`floorplan-rooms:${propertyId}`);
    if (raw && typeof raw === 'object') {
      initialRoomPhotos = raw as Record<string, string[]>;
    }
  } catch {
    // Défaut : vide (utilise les defaultPhotos de floor-plan-rooms.ts)
  }

  return (
    <RoomPhotoEditor
      propertyId={propertyId}
      propertyImages={property.images}
      initialRoomPhotos={initialRoomPhotos}
    />
  );
}
