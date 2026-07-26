import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getICalUrls, setICalUrls, syncProperty, syncAllProperties, getLastSync, getLastSyncResult } from '@/lib/ical-sync';
import { properties } from '@/lib/properties';

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token && verifyToken(token);
}

// GET — récupérer les URLs et la date de dernière sync pour tous les logements
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const data = await Promise.all(
    properties.map(async (p) => ({
      propertyId: p.id,
      name: ({ risoul: 'Appartement Risoul 1850', avignon: 'Appartement Avignon', 'lauris-meme': 'Maison de Mémé', 'lauris-atelier': "L'Atelier", 'lauris-alain': "Maison d'Alain" } as Record<string,string>)[p.id] ?? p.id,
      urls: await getICalUrls(p.id),
      lastSync: await getLastSync(p.id),
      lastResult: await getLastSyncResult(p.id),
    }))
  );

  return NextResponse.json(data);
}

// PUT — sauvegarder les URLs iCal d'un logement
export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { propertyId, airbnb, abritel } = await req.json();
  if (!propertyId) return NextResponse.json({ error: 'propertyId manquant' }, { status: 400 });

  await setICalUrls(propertyId, { airbnb: airbnb || undefined, abritel: abritel || undefined });
  return NextResponse.json({ success: true });
}

// POST — déclencher une synchronisation
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { propertyId } = body;

  if (propertyId) {
    const result = await syncProperty(propertyId);
    return NextResponse.json(result);
  }

  const results = await syncAllProperties();
  return NextResponse.json(results);
}
