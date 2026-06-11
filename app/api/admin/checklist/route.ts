import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { redis } from '@/lib/redis';

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token && verifyToken(token);
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface PropertyChecklist {
  propertyId: string;
  items: ChecklistItem[];
  lastReset: string | null;
}

const DEFAULT_ITEMS = [
  'Changer les draps et taies d\'oreiller',
  'Changer les serviettes de bain',
  'Nettoyer la salle de bain',
  'Nettoyer la cuisine et les appareils',
  'Passer l\'aspirateur et le balai',
  'Vider les poubelles',
  'Nettoyer les vitres et miroirs',
  'Réapprovisionner les produits d\'accueil',
  'Vérifier l\'état de la literie',
  'Contrôler les équipements (TV, wifi, clim)',
  'Aérer le logement',
  'Déposer le guide d\'accueil',
];

// GET — checklist d'un logement
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');
  if (!propertyId) return NextResponse.json({ error: 'propertyId requis' }, { status: 400 });

  const raw = await redis.get(`checklist:${propertyId}`);
  if (!raw) {
    const items: ChecklistItem[] = DEFAULT_ITEMS.map((label, i) => ({
      id: String(i),
      label,
      done: false,
    }));
    return NextResponse.json({ propertyId, items, lastReset: null });
  }
  return NextResponse.json(typeof raw === 'string' ? JSON.parse(raw) : raw);
}

// PUT — mettre à jour la checklist
export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body: PropertyChecklist = await req.json();
  await redis.set(`checklist:${body.propertyId}`, JSON.stringify(body));
  return NextResponse.json({ success: true });
}

// POST — réinitialiser la checklist (tout décocher)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { propertyId } = await req.json();
  const raw = await redis.get(`checklist:${propertyId}`);
  const current: PropertyChecklist = raw
    ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
    : { propertyId, items: DEFAULT_ITEMS.map((label, i) => ({ id: String(i), label, done: false })), lastReset: null };

  const reset: PropertyChecklist = {
    ...current,
    items: current.items.map((item) => ({ ...item, done: false })),
    lastReset: new Date().toISOString(),
  };
  await redis.set(`checklist:${propertyId}`, JSON.stringify(reset));
  return NextResponse.json(reset);
}
