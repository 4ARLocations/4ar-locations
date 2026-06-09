import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { FLOOR_HOTSPOTS } from '@/lib/floor-plan-hotspots';
import { properties } from '@/lib/properties';
import HotspotPositionEditor from '@/components/admin/HotspotPositionEditor';

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
  if (!ALLOWED.has(propertyId) || !FLOOR_HOTSPOTS[propertyId]) redirect('/admin/floor-plans');

  const property = properties.find(p => p.id === propertyId);
  if (!property) redirect('/admin/floor-plans');

  let initialPositions: Record<string, { x: number; y: number }> = {};
  try {
    const raw = await redis.get(`hotspot-positions:${propertyId}`);
    if (raw && typeof raw === 'object') initialPositions = raw as Record<string, { x: number; y: number }>;
  } catch { /* use defaults */ }

  return <HotspotPositionEditor propertyId={propertyId} initialPositions={initialPositions} />;
}
