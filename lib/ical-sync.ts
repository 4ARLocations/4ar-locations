import { redis } from './redis';
import { addBlock, clearSyncedBlocks, type AvailabilityBlock } from './availability';
import ical, { type VEvent } from 'node-ical';

// ─── URLs iCal par logement ───────────────────────────────────────
export interface ICalUrls {
  airbnb?: string;
  abritel?: string;
}

export async function getICalUrls(propertyId: string): Promise<ICalUrls> {
  const raw = await redis.get(`ical-urls:${propertyId}`);
  if (!raw) return {};
  return typeof raw === 'string' ? JSON.parse(raw) : (raw as ICalUrls);
}

export async function setICalUrls(propertyId: string, urls: ICalUrls): Promise<void> {
  await redis.set(`ical-urls:${propertyId}`, JSON.stringify(urls));
}

// ─── Helpers date ─────────────────────────────────────────────────
// node-ical parse les dates "all-day" comme minuit en heure locale du processus.
// On utilise les méthodes locales pour rester cohérent.
function dateToStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ─── Parsing iCal (node-ical — gère TZID, DATE vs DATETIME, line folding) ──
async function fetchAndParseICal(
  url: string
): Promise<{ start: string; end: string; summary: string }[]> {
  const res = await fetch(url, {
    headers: { 'User-Agent': '4AR-Locations-Sync/1.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`iCal fetch failed: HTTP ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  if (!text.includes('BEGIN:VCALENDAR')) {
    throw new Error('Réponse invalide — URL iCal incorrecte ou expirée');
  }

  const parsed = ical.sync.parseICS(text);
  const results: { start: string; end: string; summary: string }[] = [];

  for (const component of Object.values(parsed)) {
    // Type guard: only process VEVENTs
    if (!component || (component as { type?: string }).type !== 'VEVENT') continue;
    const e = component as VEvent;

    if (!e.start || !e.end) continue;

    const start = dateToStr(new Date(e.start));

    // DTEND est toujours exclusif en iCal :
    // - all-day (DATE) : lendemain du dernier jour occupé
    // - horodaté (DATETIME) : heure de départ, toujours le matin après la dernière nuit
    // Dans les deux cas, soustraire 1 jour donne la dernière nuit bloquée.
    const endDt = new Date(e.end);
    endDt.setDate(endDt.getDate() - 1);
    const end = dateToStr(endDt);

    if (end < start) continue;

    results.push({ start, end, summary: String(e.summary || 'Réservé') });
  }

  return results;
}

// ─── Synchronisation d'un logement ───────────────────────────────
export interface SyncResult {
  propertyId: string;
  added: number;
  removed: number;
  errors: string[];
}

export async function syncProperty(propertyId: string): Promise<SyncResult> {
  const result: SyncResult = { propertyId, added: 0, removed: 0, errors: [] };
  const urls = await getICalUrls(propertyId);

  // Supprimer en bloc les anciens blocs issus de la synchro (O(N) au lieu de O(N²))
  result.removed = await clearSyncedBlocks(propertyId);

  // ── Airbnb ──────────────────────────────────────────────────────
  if (urls.airbnb) {
    try {
      const events = await fetchAndParseICal(urls.airbnb);
      for (const ev of events) {
        const isHostBlocked = /not available|blocked|unavailable|indisponible/i.test(
          ev.summary ?? ''
        );
        const block: AvailabilityBlock = {
          id: `airbnb-${propertyId}-${ev.start}-${ev.end}`,
          propertyId,
          start: ev.start,
          end: ev.end,
          label: isHostBlocked ? 'Bloqué hôte' : ev.summary || 'Airbnb',
          source: isHostBlocked ? 'airbnb-blocked' : 'airbnb',
        };
        await addBlock(block);
        result.added++;
      }
    } catch (e) {
      result.errors.push(`Airbnb: ${(e as Error).message}`);
    }
  }

  // ── Abritel ─────────────────────────────────────────────────────
  if (urls.abritel) {
    try {
      const events = await fetchAndParseICal(urls.abritel);
      for (const ev of events) {
        const block: AvailabilityBlock = {
          id: `abritel-${propertyId}-${ev.start}-${ev.end}`,
          propertyId,
          start: ev.start,
          end: ev.end,
          label: ev.summary || 'Abritel',
          source: 'abritel',
        };
        await addBlock(block);
        result.added++;
      }
    } catch (e) {
      result.errors.push(`Abritel: ${(e as Error).message}`);
    }
  }

  const now = new Date().toISOString();
  await redis.set(`ical-last-sync:${propertyId}`, now);
  await redis.set(`ical-last-sync-result:${propertyId}`, JSON.stringify({
    added: result.added,
    removed: result.removed,
    errors: result.errors,
    ts: now,
  }));
  return result;
}

export async function syncAllProperties(): Promise<SyncResult[]> {
  const { properties } = await import('./properties');
  return Promise.all(properties.map((p) => syncProperty(p.id)));
}

export async function getLastSync(propertyId: string): Promise<string | null> {
  const val = await redis.get(`ical-last-sync:${propertyId}`);
  return val ? String(val) : null;
}

export interface SyncResultStored {
  added: number;
  removed: number;
  errors: string[];
  ts: string;
}

export async function getLastSyncResult(propertyId: string): Promise<SyncResultStored | null> {
  const raw = await redis.get(`ical-last-sync-result:${propertyId}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : (raw as SyncResultStored);
}
