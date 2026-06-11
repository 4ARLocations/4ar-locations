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

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2416]">Synchronisation iCal</h1>
          <p className="text-sm text-[#9B8A74] mt-1">Liez vos calendriers Airbnb et Abritel pour synchroniser automatiquement les réservations.</p>
        </div>
        <button
          onClick={() => handleSync()}
          disabled={syncing !== null}
          className="flex items-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {syncing === 'all' ? (
            <><span className="animate-spin">↻</span> Synchro en cours…</>
          ) : (
            <><span>↻</span> Tout synchroniser</>
          )}
        </button>
      </div>

      {/* Bouton seed initial */}
      {!allHaveUrls && !seedDone && (
        <div className="mb-6 bg-[#FFF8F0] border border-[#C8763A]/30 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#2C2416] text-sm">Charger les URLs Airbnb initiales</p>
            <p className="text-xs text-[#9B8A74] mt-0.5">Cliquez pour pré-remplir les 5 URLs Airbnb fournies.</p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex-shrink-0 bg-[#2C2416] hover:bg-[#4A3828] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {seeding ? 'Chargement…' : 'Pré-remplir les URLs'}
          </button>
        </div>
      )}

      {/* Résultats de la dernière sync */}
      {results.length > 0 && (
        <div className="mb-6 bg-[#F0FAF4] border border-[#6B7C45]/30 rounded-2xl p-5">
          <p className="font-semibold text-[#2C2416] text-sm mb-3">✅ Résultats de la synchronisation</p>
          <div className="space-y-1.5">
            {results.map((r) => (
              <div key={r.propertyId} className="flex items-center gap-3 text-xs text-[#5C4F3A]">
                <span className="font-medium w-28">{data.find((p) => p.propertyId === r.propertyId)?.name ?? r.propertyId}</span>
                <span className="text-[#6B7C45]">+{r.added} blocs importés</span>
                {r.errors.length > 0 && (
                  <span className="text-red-500">{r.errors.join(', ')}</span>
                )}
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
          return (
            <div key={p.propertyId} className="bg-white border border-[#E8DCC8] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-[#2C2416]">{p.name}</p>
                  <p className="text-xs text-[#9B8A74] mt-0.5">
                    {p.lastSync ? `Dernière synchro : ${timeAgo(p.lastSync)}` : 'Jamais synchronisé'}
                  </p>
                </div>
                <button
                  onClick={() => handleSync(p.propertyId)}
                  disabled={syncing !== null}
                  className="flex items-center gap-1.5 border border-[#E8DCC8] hover:border-[#C8763A]/40 text-[#5C4F3A] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {syncing === p.propertyId ? <span className="animate-spin">↻</span> : '↻'}
                  Synchroniser
                </button>
              </div>

              <div className="space-y-3">
                {/* Airbnb */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#5C4F3A] mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] inline-block" />
                    URL iCal Airbnb
                  </label>
                  <input
                    type="url"
                    value={ed.airbnb}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.propertyId]: { ...ed, airbnb: e.target.value } }))}
                    placeholder="https://www.airbnb.fr/calendar/ical/..."
                    className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2] transition-colors"
                  />
                </div>

                {/* Abritel */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[#5C4F3A] mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A699] inline-block" />
                    URL iCal Abritel
                  </label>
                  <input
                    type="url"
                    value={ed.abritel}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [p.propertyId]: { ...ed, abritel: e.target.value } }))}
                    placeholder="https://www.vrbo.com/icalendar/..."
                    className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#00A699] bg-[#FAF7F2] transition-colors"
                  />
                </div>

                {hasChanges && (
                  <button
                    onClick={() => handleSave(p.propertyId)}
                    disabled={saving === p.propertyId}
                    className="text-xs bg-[#2C2416] hover:bg-[#4A3828] text-white font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving === p.propertyId ? 'Sauvegarde…' : 'Enregistrer les URLs'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note automatisation */}
      <div className="mt-8 bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#2C2416] mb-1">⚙️ Synchronisation automatique</p>
        <p className="text-xs text-[#9B8A74] leading-relaxed">
          Le calendrier est synchronisé automatiquement <strong>toutes les heures</strong> via Vercel Cron.
          Les réservations Airbnb et Abritel apparaissent directement dans le calendrier admin avec leur couleur respective.
          Vous pouvez aussi déclencher une synchronisation manuelle à tout moment.
        </p>
      </div>
    </div>
  );
}
