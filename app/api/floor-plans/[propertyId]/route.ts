import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { defaultFloorPlans, PropertyFloorPlan } from '@/lib/floor-plans';

function redisKey(propertyId: string) {
  return `floorplan:${propertyId}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  try {
    const stored = await redis.get<PropertyFloorPlan>(redisKey(propertyId));
    if (stored) return NextResponse.json(stored);
    // Retourner la config par défaut si pas encore sauvegardée
    const def = defaultFloorPlans[propertyId];
    if (!def) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(def);
  } catch {
    return NextResponse.json({ error: 'Redis error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  // Vérification admin cookie
  const cookie = req.cookies.get('admin_auth');
  if (!cookie?.value) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  try {
    const body: PropertyFloorPlan = await req.json();
    await redis.set(redisKey(propertyId), body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
