import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { addReview, type Review } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const { propertyId, propertyName, author, date, rating, comment, email, photos } = await req.json();

    if (!propertyId || !propertyName || !author || !rating || !comment) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Note invalide.' }, { status: 400 });
    }

    // ── Sauvegarder l'avis dans Redis (publication immédiate) ──
    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      propertyId,
      propertyName,
      author,
      date: date || '',
      rating,
      comment,
      photos: Array.isArray(photos) ? photos.slice(0, 3) : [],
      createdAt: new Date().toISOString(),
    };
    await addReview(review);

    // ── Notification email à 4AR Locations ──
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const stars = '⭐'.repeat(rating);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'loc4ar@gmail.com',
        replyTo: email || undefined,
        subject: `⭐ Nouvel avis (${rating}/5) — ${propertyName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#FAF7F2;padding:32px;border-radius:12px">
            <h2 style="color:#C8763A;font-size:22px;margin-bottom:4px">⭐ Nouvel avis — ${propertyName}</h2>
            <p style="color:#9B8A74;font-size:13px;margin-bottom:24px">Publié automatiquement sur le site 4AR Locations</p>
            <div style="background:white;border-radius:10px;padding:20px;border:1px solid #E8DCC8;margin-bottom:16px">
              <p style="margin:0 0 8px"><strong style="color:#2C2416">Logement :</strong> ${propertyName}</p>
              <p style="margin:0 0 8px"><strong style="color:#2C2416">Auteur :</strong> ${author}</p>
              ${email ? `<p style="margin:0 0 8px"><strong style="color:#2C2416">Email :</strong> ${email}</p>` : ''}
              <p style="margin:0 0 8px"><strong style="color:#2C2416">Période :</strong> ${date || 'Non précisée'}</p>
              <p style="margin:0 0 8px"><strong style="color:#2C2416">Note :</strong> ${stars} (${rating}/5)</p>
            </div>
            <div style="background:white;border-radius:10px;padding:20px;border:1px solid #E8DCC8">
              <p style="margin:0 0 8px;font-weight:bold;color:#2C2416">Commentaire :</p>
              <p style="margin:0;color:#5C4F3A;line-height:1.6;font-style:italic">"${comment}"</p>
            </div>
            <p style="margin-top:20px;font-size:12px;color:#9B8A74">
              Cet avis est maintenant visible sur la fiche logement du site.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review error:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
