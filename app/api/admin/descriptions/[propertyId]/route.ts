import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getAllCustomDescriptions, saveCustomDescriptions } from '@/lib/property-descriptions';
import { properties } from '@/lib/properties';

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token && verifyToken(token);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { propertyId } = await params;
  if (!properties.find(p => p.id === propertyId)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const descriptions = await getAllCustomDescriptions(propertyId);
  return NextResponse.json(descriptions);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { propertyId } = await params;
  if (!properties.find(p => p.id === propertyId)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  await saveCustomDescriptions(propertyId, body);
  return NextResponse.json({ ok: true });
}
