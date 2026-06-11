import { redis } from './redis';
import { addBlock, getBlocks, deleteBlock, type AvailabilityBlock } from './availability';

// ─── URLs iCal par logement ───────────────────────────────────────
// Stockées dans Redis : clé `ical-urls:{propertyId}` → JSON { airbnb?, abritel? }
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

// ─── Parsing iCal ────────────────────────────────────────────────
function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function fetchAndParseICal(url: string): Promise<{ start: string; end: string; summary: string }[]> {
  const res = await fetch(url, {
    headers: { 'User-Agent': '4AR-Locations-Sync/1.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`iCal fetch failed: ${res.status}`);
  const text = await res.text();

  // Parser iCal manuellement (évite dépendances lourdes)
  const events: { start: string; end: string; summary: string }[] = [];
  const lines = text.replace(/\r\n /g, '').replace(/\r\n\t/g, '').split(/\r?\n/);

  let inEvent = false;
  let current: Partial<{ start: string; end: string; summary: string }> = {};

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      current = {};
    } else if (line === 'END:VEVENT') {
      if (current.start && current.end) {
        events.push({
          start: current.start,
          end: current.end,
          summary: current.summary ?? 'Réservé',
        });
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const val = line.split(':')[1]?.replace(/\D/g, '');
        if (val && val.length >= 8) {
          const y = val.slice(0, 4), m = val.slice(4, 6), d = val.slice(6, 8);
          current.start = `${y}-${m}-${d}`;
        }
      } else if (line.startsWith('DTEND')) {
        const val = line.split(':')[1]?.replace(/\D/g, '');
        if (val && val.length >= 8) {
          const y = val.slice(0, 4), m = val.slice(4, 6), d = val.slice(6, 8);
          // iCal DTEND est exclusif — on recule d'un jour
          const dt = new Date(`${y}-${m}-${d}`);
          dt.setDate(dt.getDate() - 1);
          current.end = toDateStr(dt);
        }
      } else if (line.startsWith('SUMMARY')) {
        current.summary = line.split(':').slice(1).join(':').trim();
      }
    }
  }

  return events;
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

  // Supprimer les anciens blocs issus de la synchro automatique
  const existingBlocks = await getBlocks(propertyId);
  const toDelete = existingBlocks.filter((b) => b.source === 'airbnb' || b.source === 'abritel');
  for (const b of toDelete) {
    await deleteBlock(propertyId, b.id);
    result.removed++;
  }

  // Importer depuis Airbnb
  if (urls.airbnb) {
    try {
      const events = await fetchAndParseICal(urls.airbnb);
      for (const ev of events) {
        if (!ev.start || !ev.end || ev.end < ev.start) continue;
        const block: AvailabilityBlock = {
          id: `airbnb-${propertyId}-${ev.start}-${ev.end}`,
          propertyId,
          start: ev.start,
          end: ev.end,
          label: ev.summary.includes('Airbnb') || ev.summary.includes('Not available') ? 'Airbnb' : ev.summary,
          source: 'airbnb',
        };
        await addBlock(block);
        result.added++;
      }
    } catch (e) {
      result.errors.push(`Airbnb: ${(e as Error).message}`);
    }
  }

  // Importer depuis Abritel
  if (urls.abritel) {
    try {
      const events = await fetchAndParseICal(urls.abritel);
      for (const ev of events) {
        if (!ev.start || !ev.end || ev.end < ev.start) continue;
        const block: AvailabilityBlock = {
          id: `abritel-${propertyId}-${ev.start}-${ev.end}`,
          propertyId,
          start: ev.start,
          end: ev.end,
          label: 'Abritel',
          source: 'abritel',
        };
        await addBlock(block);
        result.added++;
      }
    } catch (e) {
      result.errors.push(`Abritel: ${(e as Error).message}`);
    }
  }

  // Mettre à jour la date de dernière synchro
  await redis.set(`ical-last-sync:${propertyId}`, new Date().toISOString());

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
