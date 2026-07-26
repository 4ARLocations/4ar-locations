import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { properties } from '@/lib/properties';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

// GET : renvoyer les photos actuelles + catégories (Redis > défaut)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const property = properties.find(p => p.id === propertyId);
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const [storedImages, storedCats] = await Promise.all([
      redis.get(`property-photos:${propertyId}`),
      redis.get(`property-photo-categories:${propertyId}`),
    ]);
    const images = Array.isArray(storedImages) && storedImages.length > 0 ? storedImages : property.images;
    const categories = storedCats && typeof storedCats === 'object' ? storedCats : {};
    return NextResponse.json({ images, categories });
  } catch { /* fall through */ }

  return NextResponse.json({ images: property.images, categories: {} });
}

// PUT : sauvegarder photos + catégories
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
    const { images, categories } = await req.json();
    if (!Array.isArray(images)) return NextResponse.json({ error: 'Format invalide' }, { status: 400 });
    await Promise.all([
      redis.set(`property-photos:${propertyId}`, images),
      redis.set(`property-photo-categories:${propertyId}`, categories ?? {}),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur Redis' }, { status: 500 });
  }
}

// DELETE : réinitialiser aux photos par défaut (supprime aussi les catégories)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    await redis.del(`property-photos:${propertyId}`, `property-photo-categories:${propertyId}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur Redis' }, { status: 500 });
  }
}
