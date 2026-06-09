import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { properties } from '@/lib/properties';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

function redisKey(propertyId: string) {
  return `property-photos:${propertyId}`;
}

// GET : renvoyer les photos actuelles (Redis > défaut)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const property = properties.find(p => p.id === propertyId);
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const stored = await redis.get(redisKey(propertyId));
    if (Array.isArray(stored) && stored.length > 0) {
      return NextResponse.json({ images: stored });
    }
  } catch { /* fall through */ }

  return NextResponse.json({ images: property.images });
}

// PUT : sauvegarder l'ordre des photos
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const property = properties.find(p => p.id === propertyId);
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const { images } = await req.json();
    if (!Array.isArray(images)) return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    await redis.set(redisKey(propertyId), images);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur Redis' }, { status: 500 });
  }
}

// DELETE : réinitialiser aux photos par défaut
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    await redis.del(`property-photos:${propertyId}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur Redis' }, { status: 500 });
  }
}
