'use client';
import { useEffect, useState } from 'react';
import type { PricePeriod } from '@/app/api/admin/tarifs/route';

const PROPERTIES = [
  { id: 'risoul', name: 'Risoul 1850', emoji: '⛷', basePrice: 75 },
  { id: 'avignon', name: 'Avignon', emoji: '🏛️', basePrice: 0 },
  { id: 'lauris-meme', name: 'Maison de Mémé', emoji: '🌿', basePrice: 142 },
  { id: 'lauris-atelier', name: "L'Atelier", emoji: '🌿', basePrice: 115 },
  { id: 'lauris-alain', name: "Maison d'Alain", emoji: '🌿', basePrice: 200 },
];

const SEASON_COLORS = ['#C8763A', '#6B7C45', '#3B82F6', '#A855F7', '#EF4444', '#F59E0B', '#10B981'];

const SUGGESTED: Omit<PricePeriod, 'id' | 'propertyId'>[] = [
  { label: 'Vacances de Noël', start: '2025-12-20', end: '2026-01-05', pricePerNight: 0, color: '#3B82F6' },
  { label: "Vacances d'hiver", start: '2026-02-07', end: '2026-03-01', pricePerNight: 0, color: '#6B7C45' },
  { label: 'Haute saison été', start: '2026-07-04', end: '2026-08-31', pricePerNight: 0, color: '#C8763A' },
  { label: 'Vacances de Pâques', start: '2026-04-11', end: '2026-04-27', pricePerNight: 0, color: '#A855F7' },
  { label: 'Toussaint', start: '2026-10-17', end: '2026-11-02', pricePerNight: 0, color: '#EF4444' },
];

export default function TarifsPage() {
  const [activeId, setActiveId] = useState('risoul');
  const [periods, setPeriods] = useState<PricePeriod[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeProp = PROPERTIES.find((p) => p.id === activeId)!;

  const load = async (id: string) => {
    const res = await fetch(`/api/admin/tarifs?propertyId=${id}`);
    if (res.ok) setPeriods(await res.json());
    else setPeriods([]);
  };

  useEffect(() => { load(activeId); }, [activeId]);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/tarifs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: activeId, periods }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addPeriod = () => {
    const color = SEASON_COLORS[periods.length % SEASON_COLORS.length];
    setPeriods((prev) => [
      ...prev,
      { id: `period-${Date.now()}`, propertyId: activeId, label: 'Nouvelle période', start: '', end: '', pricePerNight: activeProp.basePrice, color },
    ]);
  };

  const addSuggested = (s: typeof SUGGESTED[0]) => {
    setPeriods((prev) => [
      ...prev,
      { ...s, id: `period-${Date.now()}`, propertyId: activeId, pricePerNight: activeProp.basePrice },
    ]);
  };

  const removePeriod = (id: string) => setPeriods((prev) => prev.filter((p) => p.id !== id));

  const updatePeriod = (id: string, field: keyof PricePeriod, value: string | number) => {
    setPeriods((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const inputCls = "w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[#C8763A]/50 transition-colors";

  return (
    <div className="px-6 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Calendrier de prix</h1>
          <p className="text-sm text-white/40 mt-1">Tarifs spéciaux pour les périodes de haute ou basse saison.</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {saved ? '✅ Enregistré' : saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      {/* Sélecteur logement */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {PROPERTIES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeId === p.id
                ? 'bg-[#C8763A] text-white'
                : 'bg-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/10 border border-white/[0.07]'
            }`}
          >
            <span>{p.emoji}</span>
            <span>{p.name}</span>
            {p.basePrice > 0 && <span className="opacity-50 text-xs">({p.basePrice}€)</span>}
          </button>
        ))}
      </div>

      {/* Périodes suggérées */}
      {periods.length === 0 && (
        <div className="mb-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Périodes suggérées</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s, i) => (
              <button
                key={i}
                onClick={() => addSuggested(s)}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/[0.07] transition-all"
                style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des périodes */}
      <div className="space-y-3 mb-4">
        {periods.map((period) => (
          <div key={period.id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="color"
                value={period.color ?? '#C8763A'}
                onChange={(e) => updatePeriod(period.id, 'color', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={period.label}
                onChange={(e) => updatePeriod(period.id, 'label', e.target.value)}
                placeholder="Nom de la période"
                className="flex-1 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-[#C8763A]/50"
              />
              <button
                onClick={() => removePeriod(period.id)}
                className="text-white/20 hover:text-red-400 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-white/30 font-semibold uppercase tracking-widest block mb-1.5">Début</label>
                <input type="date" value={period.start}
                  onChange={(e) => updatePeriod(period.id, 'start', e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-white/30 font-semibold uppercase tracking-widest block mb-1.5">Fin</label>
                <input type="date" value={period.end}
                  onChange={(e) => updatePeriod(period.id, 'end', e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-white/30 font-semibold uppercase tracking-widest block mb-1.5">Prix / nuit</label>
                <div className="relative">
                  <input type="number" value={period.pricePerNight} min={0}
                    onChange={(e) => updatePeriod(period.id, 'pricePerNight', Number(e.target.value))}
                    className={inputCls + ' pr-7'} />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">€</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addPeriod}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-white/10 hover:border-[#C8763A]/40 text-white/30 hover:text-[#C8763A]/60 py-3 rounded-2xl transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une période
      </button>
    </div>
  );
}
