'use client';
import { useEffect, useState } from 'react';

interface PropertyICal {
  propertyId: string;
  name: string;
  urls: { airbnb?: string; abritel?: string };
  lastSync: string | null;
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
    await load();
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
  const urlInput = "w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/70 focus:outline-none focus:border-[#C8763A]/50 transition-colors placeholder-white/20";

  return (
    <div className="px-6 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Synchronisation iCal</h1>
          <p className="text-sm text-white/40 mt-1">Liez vos calendriers Airbnb et Abritel pour importer automatiquement les réservations.</p>
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
          {syncing === 'all' ? 'Synchro…' : 'Tout synchroniser'}
        </button>
      </div>

      {/* Bouton seed */}
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

      {/* Résultats sync */}
      {results.length > 0 && (
        <div className="mb-5 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <p className="font-semibold text-green-400 text-sm mb-2">Résultats de la synchronisation</p>
          <div className="space-y-1">
            {results.map((r) => (
              <div key={r.propertyId} className="flex items-center gap-3 text-xs text-white/50">
                <span className="font-medium w-32">{data.find((p) => p.propertyId === r.propertyId)?.name ?? r.propertyId}</span>
                <span className="text-green-400">+{r.added} blocs importés</span>
                {r.errors.length > 0 && <span className="text-red-400">{r.errors.join(', ')}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des logements */}
      <div className="space-y-4">
        {data.map((p) => {
          const ed = editing[p.propertyId] ?? { airbnb: '', abritel: '' };
          const hasChanges = ed.airbnb !== (p.urls.airbnb ?? '') || ed.abritel !== (p.urls.abritel ?? '');
          const hasUrls = p.urls.airbnb || p.urls.abritel;
          return (
            <div key={p.propertyId} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">{p.name}</p>
                    {hasUrls && <span className="text-[10px] bg-green-500/15 text-green-400 font-semibold px-2 py-0.5 rounded-full border border-green-500/20">Configuré</span>}
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">
                    {p.lastSync ? `Dernière synchro : ${timeAgo(p.lastSync)}` : 'Jamais synchronisé'}
                  </p>
                </div>
                <button
                  onClick={() => handleSync(p.propertyId)}
                  disabled={syncing !== null}
                  className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                >
                  <svg className={`w-3.5 h-3.5 ${syncing === p.propertyId ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Synchroniser
                </button>
              </div>

              <div className="space-y-3">
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
                    placeholder="https://www.vrbo.com/icalendar/..."
                    className={urlInput}
                  />
                </div>
                {hasChanges && (
                  <button
                    onClick={() => handleSave(p.propertyId)}
                    disabled={saving === p.propertyId}
                    className="text-xs bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving === p.propertyId ? 'Sauvegarde…' : 'Enregistrer les URLs'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note sync auto */}
      <div className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <p className="text-xs font-semibold text-white/30 mb-1">Synchronisation automatique</p>
        <p className="text-xs text-white/25 leading-relaxed">
          Le calendrier est synchronisé automatiquement <strong className="text-white/40">chaque jour à 7h</strong> via Vercel Cron.
          Vous pouvez aussi déclencher une synchronisation manuelle à tout moment.
        </p>
      </div>
    </div>
  );
}
