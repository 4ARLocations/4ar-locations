import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { defaultFloorPlans, PropertyFloorPlan } from '@/lib/floor-plans';
import { properties } from '@/lib/properties';
import FloorPlanEditor from '@/components/admin/FloorPlanEditor';

export const dynamic = 'force-dynamic';

export default async function FloorPlanEditorPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  const { propertyId } = await params;

  const property = properties.find((p) => p.id === propertyId);
  if (!property || !defaultFloorPlans[propertyId]) {
    redirect('/admin/floor-plans');
  }

  // Charger depuis Redis ou utiliser le défaut
  const raw = await redis.get(`floorplan:${propertyId}`);
  const stored = raw as PropertyFloorPlan | null;
  const floorPlan = stored?.propertyId ? stored : defaultFloorPlans[propertyId];

  return (
    <FloorPlanEditor
      propertyId={propertyId}
      initialFloorPlan={floorPlan}
      propertyImages={property.images}
    />
  );
}
