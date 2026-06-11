import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getReviews, setOwnerReply } from '@/lib/redis';
import { properties } from '@/lib/properties';

function auth(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return token && verifyToken(token);
}

// GET — tous les avis de tous les logements
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const allReviews = await Promise.all(
    properties.map(async (p) => {
      const reviews = await getReviews(p.id);
      return reviews;
    })
  );

  return NextResponse.json(allReviews.flat());
}

// POST — enregistrer une réponse à un avis
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { reviewId, text } = await req.json();
  if (!reviewId || !text?.trim()) {
    return NextResponse.json({ error: 'reviewId et text requis' }, { status: 400 });
  }

  await setOwnerReply(reviewId, text.trim());
  return NextResponse.json({ success: true });
}
