'use client';
import { useEffect, useState } from 'react';
import type { PropertyChecklist, ChecklistItem } from '@/app/api/admin/checklist/route';

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2416]">Checklist ménage</h1>
        <p className="text-sm text-[#9B8A74] mt-1">Cochez les tâches effectuées avant chaque nouvelle arrivée.</p>
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
          </button>
        ))}
      </div>

      {checklist && (
        <>
          {/* Progression */}
          <div className="bg-white border border-[#E8DCC8] rounded-2xl p-5 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-2xl font-bold text-[#2C2416]">{doneCount}</span>
                <span className="text-[#9B8A74]">/{totalCount} tâches</span>
                {checklist.lastReset && (
                  <p className="text-xs text-[#9B8A74] mt-0.5">Réinitialisé {timeAgo(checklist.lastReset)}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {allDone && (
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-full">✅ Prêt !</span>
                )}
                <button
                  onClick={reset}
                  disabled={saving}
                  className="text-xs border border-[#E8DCC8] hover:border-[#C8763A] text-[#5C4F3A] font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  🔄 Réinitialiser
                </button>
              </div>
            </div>

            <div className="h-2 bg-[#F0EAE0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : 'bg-[#C8763A]'}`}
                style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Liste des tâches */}
          <div className="space-y-2">
            {checklist.items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                disabled={saving}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                  item.done
                    ? 'bg-green-50 border-green-200 opacity-70'
                    : 'bg-white border-[#E8DCC8] hover:border-[#C8763A]/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  item.done ? 'bg-green-500 border-green-500' : 'border-[#D8CFC4]'
                }`}>
                  {item.done && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium ${item.done ? 'line-through text-[#9B8A74]' : 'text-[#2C2416]'}`}>
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
