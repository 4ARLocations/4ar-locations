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

const SEASON_COLORS = [
  '#C8763A', '#6B7C45', '#3B82F6', '#A855F7', '#EF4444', '#F59E0B', '#10B981',
];

const SUGGESTED: Omit<PricePeriod, 'id' | 'propertyId'>[] = [
  { label: 'Vacances de Noël', start: '2025-12-20', end: '2026-01-05', pricePerNight: 0, color: '#3B82F6' },
  { label: 'Vacances d\'hiver', start: '2026-02-07', end: '2026-03-01', pricePerNight: 0, color: '#6B7C45' },
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
    const id = `period-${Date.now()}`;
    const color = SEASON_COLORS[periods.length % SEASON_COLORS.length];
    setPeriods((prev) => [
      ...prev,
      { id, propertyId: activeId, label: 'Nouvelle période', start: '', end: '', pricePerNight: activeProp.basePrice, color },
    ]);
  };

  const addSuggested = (s: typeof SUGGESTED[0]) => {
    const id = `period-${Date.now()}`;
    setPeriods((prev) => [
      ...prev,
      { ...s, id, propertyId: activeId, pricePerNight: activeProp.basePrice },
    ]);
  };

  const removePeriod = (id: string) => setPeriods((prev) => prev.filter((p) => p.id !== id));

  const updatePeriod = (id: string, field: keyof PricePeriod, value: string | number) => {
    setPeriods((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2416]">Calendrier de prix</h1>
          <p className="text-sm text-[#9B8A74] mt-1">Définissez des tarifs spéciaux pour les périodes de haute ou basse saison.</p>
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
      <div className="flex flex-wrap gap-2 mb-6">
        {PROPERTIES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
              activeId === p.id
                ? 'bg-[#C8763A] text-white'
                : 'bg-[#FAF7F2] border border-[#E8DCC8] text-[#5C4F3A] hover:border-[#C8763A]'
            }`}
          >
            <span>{p.emoji}</span>
            <span>{p.name}</span>
            {p.basePrice > 0 && <span className="opacity-60 text-xs">({p.basePrice}€)</span>}
          </button>
        ))}
      </div>

      {/* Périodes suggérées */}
      {periods.length === 0 && (
        <div className="mb-6 bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl p-5">
          <p className="text-sm font-semibold text-[#2C2416] mb-3">Périodes suggérées</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s, i) => (
              <button
                key={i}
                onClick={() => addSuggested(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#E8DCC8] text-[#5C4F3A] hover:border-[#C8763A] hover:text-[#C8763A] transition-colors"
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
          <div key={period.id} className="bg-white border border-[#E8DCC8] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="color"
                value={period.color ?? '#C8763A'}
                onChange={(e) => updatePeriod(period.id, 'color', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={period.label}
                onChange={(e) => updatePeriod(period.id, 'label', e.target.value)}
                placeholder="Nom de la période"
                className="flex-1 border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm font-semibold text-[#2C2416] focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
              />
              <button
                onClick={() => removePeriod(period.id)}
                className="text-[#9B8A74] hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#9B8A74] font-medium block mb-1">Début</label>
                <input
                  type="date"
                  value={period.start}
                  onChange={(e) => updatePeriod(period.id, 'start', e.target.value)}
                  className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm text-[#2C2416] focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
                />
              </div>
              <div>
                <label className="text-xs text-[#9B8A74] font-medium block mb-1">Fin</label>
                <input
                  type="date"
                  value={period.end}
                  onChange={(e) => updatePeriod(period.id, 'end', e.target.value)}
                  className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm text-[#2C2416] focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
                />
              </div>
              <div>
                <label className="text-xs text-[#9B8A74] font-medium block mb-1">Prix / nuit</label>
                <div className="relative">
                  <input
                    type="number"
                    value={period.pricePerNight}
                    onChange={(e) => updatePeriod(period.id, 'pricePerNight', Number(e.target.value))}
                    min={0}
                    className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm text-[#2C2416] focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2] pr-7"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B8A74] text-xs">€</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addPeriod}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E8DCC8] hover:border-[#C8763A] text-[#9B8A74] hover:text-[#C8763A] py-3 rounded-2xl transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une période
      </button>
    </div>
  );
}
