import { redis } from '@/lib/redis';
import { defaultFloorPlans, PropertyFloorPlan } from '@/lib/floor-plans';
import FloorPlanViewer from './FloorPlanViewer';

interface Props {
  propertyId: string;
  propertyName: string;
}

export default async function FloorPlanSection({ propertyId, propertyName }: Props) {
  // Vérifier si ce logement a un plan configuré
  const hasDefault = Boolean(defaultFloorPlans[propertyId]);
  if (!hasDefault) return null;

  // Charger depuis Redis (ou utiliser le défaut)
  let floorPlan: PropertyFloorPlan;
  try {
    const raw = await redis.get(`floorplan:${propertyId}`);
    const stored = raw as PropertyFloorPlan | null;
    floorPlan = stored?.propertyId ? stored : defaultFloorPlans[propertyId];
  } catch {
    floorPlan = defaultFloorPlans[propertyId];
  }

  // Ne pas afficher si aucun étage n'a d'image
  if (!floorPlan.floors?.length) return null;

  return (
    <FloorPlanViewer
      floors={floorPlan.floors}
      propertyName={propertyName}
    />
  );
}
