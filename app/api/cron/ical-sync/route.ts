import { NextRequest, NextResponse } from 'next/server';
import { syncAllProperties } from '@/lib/ical-sync';

// Appelé automatiquement par Vercel Cron (voir vercel.json)
// Sécurisé par CRON_SECRET
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization');
  if (process.env.CRON_SECRET && secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const results = await syncAllProperties();
  const totalAdded = results.reduce((n, r) => n + r.added, 0);
  const errors = results.flatMap((r) => r.errors);

  console.log(`[iCal Cron] Sync terminée — ${totalAdded} blocs importés, ${errors.length} erreurs`);

  return NextResponse.json({ ok: true, totalAdded, errors, results });
}
