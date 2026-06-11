import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { redis } from '@/lib/redis';

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token && verifyToken(token);
}

export interface PricePeriod {
  id: string;
  label: string;         // "Haute saison été", "Noël"…
  start: string;         // "YYYY-MM-DD"
  end: string;
  pricePerNight: number;
  propertyId: string;
  color?: string;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  const key = propertyId ? `price-periods:${propertyId}` : 'price-periods:all';

  const raw = await redis.get(key);
  if (!raw) return NextResponse.json([]);
  return NextResponse.json(typeof raw === 'string' ? JSON.parse(raw) : raw);
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { propertyId, periods }: { propertyId: string; periods: PricePeriod[] } = await req.json();
  await redis.set(`price-periods:${propertyId}`, JSON.stringify(periods));
  return NextResponse.json({ success: true });
}
