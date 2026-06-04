/**
 * Vercel Cron — s'exécute chaque matin à 8h (Europe/Paris)
 * Configuré dans vercel.json : { "crons": [{ "path": "/api/cron/notifications", "schedule": "0 7 * * *" }] }
 *
 * Ce que ce cron fait :
 *  1. Réservations dont l'arrivée est dans 3 jours → email de rappel au locataire
 *  2. Réservations dont le départ était il y a 2 jours → email de demande d'avis
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAllBookings, isNotified, markNotified } from '@/lib/redis';

// Vercel injecte automatiquement CRON_SECRET pour sécuriser les crons
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET) {
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
  }
  return true; // pas de secret configuré → autorisé (dev local)
}

function diffDays(dateStr: string, today: Date): number {
  const d = new Date(dateStr + 'T12:00:00');
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function frDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: 'RESEND_API_KEY non configuré' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const bookings = await getAllBookings();
  const sent: string[] = [];

  for (const booking of bookings) {
    const arrival = diffDays(booking.checkin, today);
    const departure = diffDays(booking.checkout, today);

    // ── Rappel J-3 avant l'arrivée ──
    if (arrival === 3) {
      const key = `notif:arrival:${booking.id}`;
      const alreadySent = await isNotified(key);
      if (!alreadySent) {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: booking.guestEmail,
          subject: `🏡 Votre séjour à ${booking.propertyName} approche !`,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:auto;background:#FAF7F2;border-radius:12px;overflow:hidden">
              <div style="background:#2C2416;padding:24px 32px">
                <span style="color:#C8763A;font-weight:bold;font-size:22px">4AR</span>
                <span style="color:#8A9E5A;font-weight:bold;font-size:22px"> Locations</span>
              </div>
              <div style="padding:32px">
                <h2 style="color:#2C2416;margin-top:0">Bonjour ${booking.guestName} 👋</h2>
                <p style="color:#5C4F3A;line-height:1.6">
                  Votre séjour à <strong>${booking.propertyName}</strong> approche !<br/>
                  Vous arrivez dans <strong>3 jours</strong>, le <strong>${frDate(booking.checkin)}</strong>.
                </p>

                <div style="background:white;border-radius:10px;padding:20px;border:1px solid #E8DCC8;margin:20px 0">
                  <p style="margin:0 0 8px"><strong>Logement :</strong> ${booking.propertyName}</p>
                  <p style="margin:0 0 8px"><strong>Arrivée :</strong> ${frDate(booking.checkin)}</p>
                  <p style="margin:0 0 8px"><strong>Départ :</strong> ${frDate(booking.checkout)}</p>
                  <p style="margin:0"><strong>Voyageurs :</strong> ${booking.guests}</p>
                </div>

                <p style="color:#5C4F3A;line-height:1.6">
                  En cas de question ou pour confirmer les modalités d'arrivée,
                  n'hésitez pas à nous répondre directement à cet email.
                </p>

                <p style="color:#5C4F3A;line-height:1.6">
                  Nous vous souhaitons un excellent séjour en Provence ou dans les Alpes ! 🌿⛷
                </p>

                <p style="color:#9B8A74;font-size:13px;margin-top:24px">
                  L'équipe 4AR Locations<br/>
                  <a href="mailto:loc4ar@gmail.com" style="color:#C8763A">loc4ar@gmail.com</a>
                </p>
              </div>
            </div>
          `,
        });
        await markNotified(key);
        sent.push(`arrival-reminder:${booking.id}`);
      }
    }

    // ── Demande d'avis J+2 après le départ ──
    if (departure === -2) {
      const key = `notif:review:${booking.id}`;
      const alreadySent = await isNotified(key);
      if (!alreadySent) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://4ar-locations.vercel.app';
        // Construire un lien direct vers la fiche du logement
        const propertyUrl = `${siteUrl}/fr/biens/${booking.propertyId}`;

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: booking.guestEmail,
          subject: `💬 Comment s'est passé votre séjour à ${booking.propertyName} ?`,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:auto;background:#FAF7F2;border-radius:12px;overflow:hidden">
              <div style="background:#2C2416;padding:24px 32px">
                <span style="color:#C8763A;font-weight:bold;font-size:22px">4AR</span>
                <span style="color:#8A9E5A;font-weight:bold;font-size:22px"> Locations</span>
              </div>
              <div style="padding:32px">
                <h2 style="color:#2C2416;margin-top:0">Bonjour ${booking.guestName} 😊</h2>
                <p style="color:#5C4F3A;line-height:1.6">
                  Nous espérons que votre séjour à <strong>${booking.propertyName}</strong>
                  s'est bien passé et que vous avez profité au maximum de votre destination !
                </p>

                <p style="color:#5C4F3A;line-height:1.6">
                  Votre retour nous est très précieux — il aide d'autres voyageurs à découvrir
                  nos logements et nous permet de toujours nous améliorer.
                </p>

                <div style="text-align:center;margin:28px 0">
                  <a href="${propertyUrl}" style="background:#C8763A;color:white;text-decoration:none;font-weight:bold;padding:14px 32px;border-radius:12px;font-size:15px;display:inline-block">
                    ⭐ Laisser mon avis
                  </a>
                  <p style="font-size:12px;color:#9B8A74;margin-top:8px">
                    Cela prend moins de 2 minutes
                  </p>
                </div>

                <p style="color:#5C4F3A;line-height:1.6">
                  Merci encore pour votre confiance, et à bientôt peut-être en Provence ou dans les Alpes ! 🌿
                </p>

                <p style="color:#9B8A74;font-size:13px;margin-top:24px">
                  L'équipe 4AR Locations<br/>
                  <a href="mailto:loc4ar@gmail.com" style="color:#C8763A">loc4ar@gmail.com</a>
                </p>
              </div>
            </div>
          `,
        });
        await markNotified(key);
        sent.push(`review-request:${booking.id}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    date: today.toISOString().slice(0, 10),
    bookingsChecked: bookings.length,
    emailsSent: sent,
  });
}
