import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getBlocks, AvailabilityBlock } from '@/lib/availability';
import { properties } from '@/lib/properties';

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token && verifyToken(token);
}

const PROPERTY_NAMES: Record<string, string> = {
  risoul: 'Risoul 1850',
  avignon: 'Avignon',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': "L'Atelier",
  'lauris-alain': "Maison d'Alain",
};

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  const year = searchParams.get('year');

  const allBlocks = await Promise.all(
    properties.map((p) => getBlocks(p.id))
  );
  let blocks: AvailabilityBlock[] = allBlocks.flat();

  if (propertyId) blocks = blocks.filter((b) => b.propertyId === propertyId);
  if (year) blocks = blocks.filter((b) => b.start.startsWith(year));

  blocks.sort((a, b) => a.start.localeCompare(b.start));

  const SOURCE_LABELS: Record<string, string> = {
    airbnb: 'Airbnb', abritel: 'Abritel', direct: 'Direct', family: 'Famille', blocked: 'Bloqué',
  };

  const countNights = (start: string, end: string) =>
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);

  const header = ['Logement', 'Plateforme', 'Arrivée', 'Départ', 'Nuits', 'Label'];
  const rows = blocks.map((b): (string | number)[] => [
    PROPERTY_NAMES[b.propertyId] ?? b.propertyId,
    SOURCE_LABELS[b.source] ?? b.source,
    b.start,
    b.end,
    countNights(b.start, b.end),
    b.label ?? '',
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const filename = `reservations${propertyId ? `-${propertyId}` : ''}${year ? `-${year}` : ''}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
