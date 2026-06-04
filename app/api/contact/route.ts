import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { addBooking, type Booking } from '@/lib/redis';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, phone, property, checkin, checkout, guests, message } = body;

    // Validation serveur des dates
    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      return NextResponse.json(
        { error: 'La date de départ doit être après la date d\'arrivée.' },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: 'Formulaire 4AR Locations <onboarding@resend.dev>',
      to: ['loc4ar@gmail.com'],
      replyTo: email,
      subject: `[4AR Locations] Demande de réservation — ${property}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border-radius: 12px; overflow: hidden;">
          <div style="background: #2C2416; padding: 24px 32px;">
            <h1 style="color: #C8763A; margin: 0; font-size: 22px;">4AR Locations</h1>
            <p style="color: #E8DCC8; margin: 4px 0 0; font-size: 14px;">Nouvelle demande de réservation</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9B8A74; font-size: 13px; width: 140px;">Logement</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #2C2416;">${property}</td></tr>
              <tr style="background: #f5f0e8;"><td style="padding: 8px 6px; color: #9B8A74; font-size: 13px;">Nom</td>
                  <td style="padding: 8px 6px; color: #2C2416;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #9B8A74; font-size: 13px;">Email</td>
                  <td style="padding: 8px 0; color: #2C2416;"><a href="mailto:${email}" style="color: #C8763A;">${email}</a></td></tr>
              ${phone ? `<tr style="background: #f5f0e8;"><td style="padding: 8px 6px; color: #9B8A74; font-size: 13px;">Téléphone</td>
                  <td style="padding: 8px 6px; color: #2C2416;">${phone}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; color: #9B8A74; font-size: 13px;">Arrivée</td>
                  <td style="padding: 8px 0; color: #2C2416;">${checkin ? new Date(checkin).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td></tr>
              <tr style="background: #f5f0e8;"><td style="padding: 8px 6px; color: #9B8A74; font-size: 13px;">Départ</td>
                  <td style="padding: 8px 6px; color: #2C2416;">${checkout ? new Date(checkout).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #9B8A74; font-size: 13px;">Voyageurs</td>
                  <td style="padding: 8px 0; color: #2C2416;">${guests}</td></tr>
            </table>
            ${message ? `
            <div style="margin-top: 20px; padding: 16px; background: white; border-left: 3px solid #C8763A; border-radius: 4px;">
              <p style="color: #9B8A74; font-size: 12px; margin: 0 0 8px;">Message</p>
              <p style="color: #2C2416; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
            </div>` : ''}
            <div style="margin-top: 24px; padding: 16px; background: #6B7C45; border-radius: 8px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 13px;">Répondre directement à cet email pour contacter <strong>${name}</strong></p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── Enregistrer la réservation pour les notifications automatiques ──
    // (seulement si les dates sont fournies et l'email aussi)
    if (checkin && checkout && email) {
      const booking: Booking = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        propertyId: property?.toLowerCase().replace(/\s+/g, '-') ?? 'unknown',
        propertyName: property ?? '',
        guestName: name,
        guestEmail: email,
        checkin,
        checkout,
        guests: guests ?? '',
        createdAt: new Date().toISOString(),
      };
      await addBooking(booking).catch((e) => console.error('addBooking failed:', e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
