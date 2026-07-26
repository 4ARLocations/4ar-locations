import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { setICalUrls, getICalUrls } from '@/lib/ical-sync';

// URLs Airbnb fournies par le propriétaire
const AIRBNB_URLS: Record<string, string> = {
  'risoul':         'https://www.airbnb.fr/calendar/ical/28044230.ics?t=afcd92ed9c8646f6a4095c1b5223b79f',
  'lauris-alain':   'https://www.airbnb.fr/calendar/ical/1336390142884366353.ics?t=49f67a9c4e6040e2becb96bc7e7d7646',
  'lauris-atelier': 'https://www.airbnb.fr/calendar/ical/1175460558277880811.ics?t=3cd5dd9fa7704b04aa2463fd7b4bfc41',
  'lauris-meme':    'https://www.airbnb.fr/calendar/ical/1175438485297975130.ics?t=7977565f0a594f10808768a9f8756fe2',
  'avignon':        'https://www.airbnb.fr/calendar/ical/1439243184509708331.ics?t=b7d9533b1af843b6a5fb8c2237822b4b',
};

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  for (const [propertyId, airbnb] of Object.entries(AIRBNB_URLS)) {
    const existing = await getICalUrls(propertyId);
    await setICalUrls(propertyId, {
      airbnb,
      abritel: existing.abritel,
    });
  }

  return NextResponse.json({ success: true, seeded: Object.keys(AIRBNB_URLS) });
}
