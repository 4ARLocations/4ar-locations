import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { FLOOR_HOTSPOTS } from '@/lib/floor-plan-hotspots';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  if (!FLOOR_HOTSPOTS[propertyId]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const stored = await redis.get(`hotspot-positions:${propertyId}`);
    return NextResponse.json(stored ?? {});
  } catch {
    return NextResponse.json({ error: 'Redis error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const cookie = req.cookies.get('admin_auth');
  if (!cookie?.value) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  if (!FLOOR_HOTSPOTS[propertyId]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const body = await req.json();
    await redis.set(`hotspot-positions:${propertyId}`, body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur Redis' }, { status: 500 });
  }
}
