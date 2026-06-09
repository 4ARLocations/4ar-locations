import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { properties } from '@/lib/properties';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  const cookie = req.cookies.get('admin_auth');
  if (!cookie?.value) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const property = properties.find(p => p.id === propertyId);
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Upload non configuré. Ajoutez BLOB_READ_WRITE_TOKEN dans les variables d\'environnement Vercel.' },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Seules les images sont acceptées' }, { status: 400 });
    }
    // Limite 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 MB)' }, { status: 400 });
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `properties/${propertyId}/${Date.now()}.${extension}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
