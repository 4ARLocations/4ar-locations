'use client';
import { useEffect, useState } from 'react';

interface LastResult {
  added: number;
  removed: number;
  errors: string[];
  ts: string;
}

interface PropertyICal {
  propertyId: string;
  name: string;
  urls: { airbnb?: string; abritel?: string };
  lastSync: string | null;
  lastResult: LastResult | null;
}

interface SyncResult {
  propertyId: string;
  added: number;
  removed: number;
  errors: string[];
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  return `il y a ${Math.floor(diff / 86400)}j`;
}

function freshnessStatus(lastSync: string | null): 'never' | 'fresh' | 'stale' | 'old' {
  if (!lastSync) return 'never';
  const hours = (Date.now() - new Date(lastSync).getTime()) / 3_600_000;
  if (hours < 6) return 'fresh';
  if (hours < 24) return 'stale';
  return 'old';
}

const FRESHNESS_DOT: Record<string, string> = {
  never: 'bg-white/20',
  fresh: 'bg-green-400',
  stale: 'bg-amber-400',
  old: 'bg-red-400',
};

const FRESHNESS_LABEL: Record<string, string> = {
  never: 'Jamais synchronisé',
  fresh: 'À jour',
  stale: 'Ancien',
  old: 'Très ancien',
};

export default function ICalPage() {
  const [data, setData] = useState<PropertyICal[]>([]);
  const [editing, setEditing] = useState<Record<string, { airbnb: string; abritel: string }>>({});
  const [syncing, setSyncing] = useState<string | null>(null);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/ical');
    if (res.ok) {
      const json: PropertyICal[] = await res.json();
      setData(json);
      const init: Record<string, { airbnb: string; abritel: string }> = {};
      json.forEach((p) => {
        init[p.propertyId] = { airbnb: p.urls.airbnb ?? '', abritel: p.urls.abritel ?? '' };
      });
      setEditing(init);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    await fetch('/api/admin/ical/seed', { method: 'POST' });
    setSeedDone(true);
    setSeeding(false);
    await load();
  };

  const handleSave = async (propertyId: string) => {
    setSaving(propertyId);
    await fetch('/api/admin/ical', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, ...editing[propertyId] }),
    });
    setSaving(null);
    // Auto-sync immédiatement après la sauvegarde
    await handleSync(propertyId);
  };

  const handleSync = async (propertyId?: string) => {
    setSyncing(propertyId ?? 'all');
    const res = await fetch('/api/admin/ical', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyId ? { propertyId } : {}),
    });
    const json = await res.json();
    setResults(Array.isArray(json) ? json : [json]);
    setSyncing(null);
    await load();
  };

  const allHaveUrls = data.every((p) => p.urls.airbnb || p.urls.abritel);
  const hasOldData = data.some((p) => freshnessStatus(p.lastSync) === 'old' || freshnessStatus(p.lastSync) === 'never');
  const lastGlobalSync = data.reduce<string | null>((latest, p) => {
    if (!p.lastSync) return latest;
    if (!latest) return p.lastSync;
    return p.lastSync > latest ? p.lastSync : latest;
  }, null);

  const urlInput = "w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-[#C8763A]/50 transition-colors placeholder-white/20";

  return (
    <div className="px-6 py-6 max-w-4xl">

      {/* ─── En-tête ─── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Synchronisation iCal</h1>
          <p className="text-sm text-white/40 mt-1">
            Importation automatique des réservations Airbnb et Abritel.
            {lastGlobalSync && (
              <span className="ml-2 text-white/25">
                Dernière synchro globale : {timeAgo(lastGlobalSync)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => handleSync()}
          disabled={syncing !== null}
          className="flex items-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          <svg className={`w-4 h-4 ${syncing === 'all' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {syncing === 'all' ? 'Synchro en cours…' : 'Tout synchroniser'}
        </button>
      </div>

      {/* ─── Alerte données périmées ─── */}
      {hasOldData && (
        <div className="mb-5 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-amber-400 text-sm font-semibold">Calendriers non à jour</p>
            <p className="text-amber-400/60 text-xs mt-0.5">Un ou plusieurs logements n&apos;ont pas été synchronisés depuis plus de 24h. Cliquez sur « Tout synchroniser » pour mettre à jour.</p>
          </div>
        </div>
      )}

      {/* ─── Bouton seed ─── */}
      {!allHaveUrls && !seedDone && (
        <div className="mb-5 bg-[#C8763A]/10 border border-[#C8763A]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white text-sm">Charger les URLs Airbnb initiales</p>
            <p className="text-xs text-white/40 mt-0.5">Pré-remplir les 5 URLs Airbnb fournies.</p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex-shrink-0 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 border border-white/10"
          >
            {seeding ? 'Chargement…' : 'Pré-remplir les URLs'}
          </button>
        </div>
      )}

      {/* ─── Résultats sync ─── */}
      {results.length > 0 && (
        <div className="mb-5 bg-green-500/8 border border-green-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-semibold text-green-400 text-sm">Synchronisation terminée</p>
          </div>
          <div className="space-y-1.5">
            {results.map((r) => (
              <div key={r.propertyId} className="flex items-center gap-3 text-xs">
                <span className="font-medium text-white/60 w-40 truncate">{data.find((p) => p.propertyId === r.propertyId)?.name ?? r.propertyId}</span>
                <span className="text-green-400/80">{r.added} blocs importés</span>
                {r.removed > 0 && <span className="text-white/30">{r.removed} remplacés</span>}
                {r.errors.length > 0 && <span className="text-red-400">{r.errors.join(', ')}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Liste des logements ─── */}
      <div className="space-y-4">
        {data.map((p) => {
          const ed = editing[p.propertyId] ?? { airbnb: '', abritel: '' };
          const hasChanges = ed.airbnb !== (p.urls.airbnb ?? '') || ed.abritel !== (p.urls.abritel ?? '');
          const hasUrls = p.urls.airbnb || p.urls.abritel;
          const status = freshnessStatus(p.lastSync);
          const isSyncingThis = syncing === p.propertyId;

          return (
            <div key={p.propertyId} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
              {/* En-tête logement */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${FRESHNESS_DOT[status]}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm">{p.name}</p>
                      {hasUrls && (
                        <span className="text-[10px] bg-white/8 text-white/40 font-medium px-2 py-0.5 rounded-full border border-white/10">
                          {FRESHNESS_LABEL[status]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/25 mt-0.5">
                      {p.lastSync ? timeAgo(p.lastSync) : 'Jamais synchronisé'}
                      {p.lastResult && p.lastResult.errors.length === 0 && p.lastResult.added > 0 && (
                        <span className="ml-2 text-white/20">· {p.lastResult.added} blocs</span>
                      )}
                    </p>
                    {p.lastResult?.errors && p.lastResult.errors.length > 0 && (
                      <p className="text-xs text-red-400/70 mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        {p.lastResult.errors.join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSync(p.propertyId)}
                  disabled={syncing !== null}
                  className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 flex-shrink-0"
                >
                  <svg className={`w-3.5 h-3.5 ${isSyncingThis ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isSyncingThis ? 'Synchro…' : 'Synchroniser'}
                </button>
              </div>

              {/* URLs */}
              <div className="px-5 py-4 space-y-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A5F]" /> URL iCal Airbnb
                  </label>
                  <input
                    type="url"
                    value={ed.airbnb}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.propertyId]: { ...ed, airbnb: e.target.value } }))}
                    placeholder="https://www.airbnb.fr/calendar/ical/..."
                    className={urlInput}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00A699]" /> URL iCal Abritel
                  </label>
                  <input
                    type="url"
                    value={ed.abritel}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.propertyId]: { ...ed, abritel: e.target.value } }))}
                    placeholder="https://www.abritel.fr/icalendar/...ics"
                    className={urlInput}
                  />
                  <p className="text-[10px] text-amber-400/50 mt-1.5 leading-snug">
                    Utiliser l&apos;URL iCal propre à <strong className="text-amber-400/70">ce logement</strong> (Abritel → Calendrier → Exporter). Ne pas utiliser l&apos;URL combinée multi-logements.
                  </p>
                </div>
                {hasChanges && (
                  <button
                    onClick={() => handleSave(p.propertyId)}
                    disabled={saving === p.propertyId || syncing !== null}
                    className="flex items-center gap-2 text-xs bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving === p.propertyId ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Sauvegarde et synchro…
                      </>
                    ) : (
                      'Enregistrer et synchroniser'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Note sync auto ─── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs font-semibold text-white/30 mb-1">Synchronisation automatique</p>
          <p className="text-xs text-white/25 leading-relaxed">
            Synchronisé automatiquement <strong className="text-white/40">toutes les 6 heures</strong> via Vercel Cron (plan Pro).
            Sur le plan Hobby, la synchro cron est quotidienne.
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <p className="text-xs font-semibold text-white/30 mb-1">Indicateurs de fraîcheur</p>
          <div className="flex flex-col gap-1 mt-1">
            {[
              { dot: 'bg-green-400', label: 'À jour', desc: '< 6 heures' },
              { dot: 'bg-amber-400', label: 'Ancien', desc: '6–24 heures' },
              { dot: 'bg-red-400', label: 'Très ancien', desc: '> 24 heures' },
              { dot: 'bg-white/20', label: 'Jamais synchronisé', desc: '' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-white/25">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                <span className="text-white/40">{item.label}</span>
                {item.desc && <span>— {item.desc}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
