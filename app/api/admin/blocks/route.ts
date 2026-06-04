import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getBlocks, addBlock, deleteBlock, getAllBlocks, type AvailabilityBlock, type BlockSource } from '@/lib/availability';

async function guard(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  return null;
}

/** GET /api/admin/blocks?propertyId=risoul  (ou tous si omis) */
export async function GET(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const propertyId = req.nextUrl.searchParams.get('propertyId');
  const blocks = propertyId ? await getBlocks(propertyId) : await getAllBlocks();
  return NextResponse.json(blocks);
}

/** POST /api/admin/blocks — créer un bloc */
export async function POST(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const { propertyId, start, end, label, source } = await req.json();
  if (!propertyId || !start || !end) {
    return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
  }
  if (start > end) {
    return NextResponse.json({ error: 'La date de début doit être avant la fin.' }, { status: 400 });
  }
  const block: AvailabilityBlock = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    propertyId,
    start,
    end,
    label: label || '',
    source: (source as BlockSource) || 'blocked',
  };
  await addBlock(block);
  return NextResponse.json(block);
}

/** DELETE /api/admin/blocks?propertyId=risoul&blockId=xxx */
export async function DELETE(req: NextRequest) {
  const err = await guard(); if (err) return err;
  const propertyId = req.nextUrl.searchParams.get('propertyId');
  const blockId = req.nextUrl.searchParams.get('blockId');
  if (!propertyId || !blockId) {
    return NextResponse.json({ error: 'Paramètres manquants.' }, { status: 400 });
  }
  await deleteBlock(propertyId, blockId);
  return NextResponse.json({ success: true });
}
