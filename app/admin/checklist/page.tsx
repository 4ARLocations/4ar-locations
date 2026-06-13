'use client';
import { useEffect, useState } from 'react';
import type { PropertyChecklist } from '@/app/api/admin/checklist/route';

const PROPERTIES = [
  { id: 'risoul', name: 'Risoul 1850', emoji: '⛷' },
  { id: 'avignon', name: 'Avignon', emoji: '🏛️' },
  { id: 'lauris-meme', name: 'Maison de Mémé', emoji: '🌿' },
  { id: 'lauris-atelier', name: "L'Atelier", emoji: '🌿' },
  { id: 'lauris-alain', name: "Maison d'Alain", emoji: '🌿' },
];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `il y a ${diff}s`;
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  return `il y a ${Math.floor(diff / 86400)}j`;
}

export default function ChecklistPage() {
  const [activeId, setActiveId] = useState('risoul');
  const [checklist, setChecklist] = useState<PropertyChecklist | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async (id: string) => {
    const res = await fetch(`/api/admin/checklist?propertyId=${id}`);
    if (res.ok) setChecklist(await res.json());
  };

  useEffect(() => { load(activeId); }, [activeId]);

  const toggleItem = async (itemId: string) => {
    if (!checklist) return;
    const updated: PropertyChecklist = {
      ...checklist,
      items: checklist.items.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      ),
    };
    setChecklist(updated);
    setSaving(true);
    await fetch('/api/admin/checklist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setSaving(false);
  };

  const reset = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: activeId }),
    });
    if (res.ok) setChecklist(await res.json());
    setSaving(false);
  };

  const doneCount = checklist?.items.filter((i) => i.done).length ?? 0;
  const totalCount = checklist?.items.length ?? 0;
  const allDone = doneCount === totalCount && totalCount > 0;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="px-6 py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Checklist ménage</h1>
        <p className="text-sm text-white/40 mt-1">Cochez les tâches effectuées avant chaque arrivée.</p>
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
          </button>
        ))}
      </div>

      {checklist && (
        <>
          {/* Progression */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{doneCount}</span>
                  <span className="text-white/40 text-lg">/ {totalCount}</span>
                  <span className="text-white/30 text-sm ml-1">tâches</span>
                </div>
                {checklist.lastReset && (
                  <p className="text-xs text-white/25 mt-1">Réinitialisé {timeAgo(checklist.lastReset)}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {allDone && (
                  <span className="text-xs bg-green-500/15 text-green-400 font-bold px-3 py-1.5 rounded-full border border-green-500/20">
                    ✅ Prêt !
                  </span>
                )}
                <button
                  onClick={reset}
                  disabled={saving}
                  className="text-xs border border-white/10 hover:border-white/25 text-white/40 hover:text-white/70 font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                >
                  ↺ Réinitialiser
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : 'bg-[#C8763A]'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-right text-xs text-white/25 mt-1">{pct}%</p>
          </div>

          {/* Liste des tâches */}
          <div className="space-y-1.5">
            {checklist.items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                disabled={saving}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                  item.done
                    ? 'bg-green-500/[0.07] border-green-500/20'
                    : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/15'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  item.done ? 'bg-green-500 border-green-500' : 'border-white/20'
                }`}>
                  {item.done && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  item.done ? 'line-through text-white/25' : 'text-white/75'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
