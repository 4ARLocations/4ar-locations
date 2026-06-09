import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { FLOOR_PLAN_ROOMS } from '@/lib/floor-plan-rooms';

function redisKey(propertyId: string) {
  return `floorplan-rooms:${propertyId}`;
}

// GET : renvoyer les associations pièce → photos sauvegardées
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  if (!FLOOR_PLAN_ROOMS[propertyId]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const stored = await redis.get(redisKey(propertyId));
    return NextResponse.json(stored ?? {});
  } catch {
    return NextResponse.json({ error: 'Redis error' }, { status: 500 });
  }
}

// PUT : sauvegarder les associations pièce → photos
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;

  // Auth admin cookie
  const cookie = req.cookies.get('admin_auth');
  if (!cookie?.value) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!FLOOR_PLAN_ROOMS[propertyId]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    const body = await req.json();
    await redis.set(redisKey(propertyId), body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur Redis' }, { status: 500 });
  }
}
