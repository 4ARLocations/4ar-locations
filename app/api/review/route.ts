import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { propertyName, author, date, rating, comment, email } = await req.json();

    if (!propertyName || !author || !rating || !comment) {
      return NextResponse.json({ error: 'Champs manquants.' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Note invalide.' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const stars = '⭐'.repeat(rating);
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#FAF7F2;padding:32px;border-radius:12px">
        <h2 style="color:#C8763A;font-size:22px;margin-bottom:4px">⭐ Nouvel avis — ${propertyName}</h2>
        <p style="color:#9B8A74;font-size:13px;margin-bottom:24px">Reçu depuis le site 4AR Locations</p>

        <div style="background:white;border-radius:10px;padding:20px;border:1px solid #E8DCC8;margin-bottom:16px">
          <p style="margin:0 0 8px"><strong style="color:#2C2416">Logement :</strong> ${propertyName}</p>
          <p style="margin:0 0 8px"><strong style="color:#2C2416">Auteur :</strong> ${author}</p>
          ${email ? `<p style="margin:0 0 8px"><strong style="color:#2C2416">Email :</strong> ${email}</p>` : ''}
          <p style="margin:0 0 8px"><strong style="color:#2C2416">Période de séjour :</strong> ${date || 'Non précisée'}</p>
          <p style="margin:0 0 8px"><strong style="color:#2C2416">Note :</strong> ${stars} (${rating}/5)</p>
        </div>

        <div style="background:white;border-radius:10px;padding:20px;border:1px solid #E8DCC8">
          <p style="margin:0 0 8px;font-weight:bold;color:#2C2416">Commentaire :</p>
          <p style="margin:0;color:#5C4F3A;line-height:1.6;font-style:italic">"${comment}"</p>
        </div>

        <div style="margin-top:20px;padding:16px;background:#6B7C45/10;border-left:3px solid #6B7C45;border-radius:0 8px 8px 0">
          <p style="margin:0;font-size:12px;color:#5C4F3A">
            💡 Pour publier cet avis sur le site, ajoutez-le dans le fichier <code>data/reviews.json</code> avec <code>"approved": true</code>.
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'loc4ar@gmail.com',
      replyTo: email || undefined,
      subject: `⭐ Nouvel avis (${rating}/5) — ${propertyName}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review error:', err);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
