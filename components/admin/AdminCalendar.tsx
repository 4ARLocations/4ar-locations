'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AvailabilityBlock, BlockSource } from '@/lib/availability';

const PROPERTIES = [
  { id: 'risoul',        name: 'Risoul 1850',       emoji: '⛷' },
  { id: 'avignon',       name: 'Avignon',             emoji: '🏛️' },
  { id: 'lauris-meme',   name: 'Maison de Mémé',     emoji: '🌿' },
  { id: 'lauris-atelier',name: "L'Atelier",           emoji: '🌿' },
  { id: 'lauris-alain',  name: "Maison d'Alain",      emoji: '🌿' },
];

const SOURCES: { value: BlockSource; label: string; color: string }[] = [
  { value: 'airbnb',   label: 'Airbnb',              color: '#FF5A5F' },
  { value: 'booking',  label: 'Booking.com',          color: '#003580' },
  { value: 'direct',   label: 'Réservation directe', color: '#C8763A' },
  { value: 'family',   label: 'Famille / Personnel', color: '#6B7C45' },
  { value: 'blocked',  label: 'Bloqué',              color: '#6B6B6B' },
];

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfWeek(year: number, month: number): number {
  // 0=lundi, 6=dimanche (ISO)
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAY_NAMES = ['Lu','Ma','Me','Je','Ve','Sa','Di'];

interface Props {
  initialBlocks: AvailabilityBlock[];
}

export default function AdminCalendar({ initialBlocks }: Props) {
  const router = useRouter();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0].id);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(initialBlocks);
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'selecting'>('idle');

  // Form state
  const [label, setLabel] = useState('');
  const [source, setSource] = useState<BlockSource>('blocked');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const propertyBlocks = blocks.filter((b) => b.propertyId === selectedProperty);

  // Refresh blocks when property changes
  const fetchBlocks = useCallback(async (propertyId: string) => {
    const res = await fetch(`/api/admin/blocks?propertyId=${propertyId}`);
    if (res.ok) {
      const data = await res.json();
      setBlocks((prev) => [
        ...prev.filter((b) => b.propertyId !== propertyId),
        ...data,
      ]);
    }
  }, []);

  useEffect(() => {
    fetchBlocks(selectedProperty);
  }, [selectedProperty, fetchBlocks]);

  // Date range helpers
  function isInRange(date: string): boolean {
    const s = selStart;
    const e = selEnd ?? hovered;
    if (!s || !e) return false;
    const [lo, hi] = s <= e ? [s, e] : [e, s];
    return date > lo && date < hi;
  }

  function isRangeStart(date: string): boolean {
    const e = selEnd ?? hovered;
    if (!selStart || !e) return date === selStart;
    return date === (selStart <= e ? selStart : e);
  }

  function isRangeEnd(date: string): boolean {
    const e = selEnd ?? hovered;
    if (!selStart || !e) return false;
    return date === (selStart <= e ? e : selStart);
  }

  function blockForDate(date: string): AvailabilityBlock | undefined {
    return propertyBlocks.find((b) => date >= b.start && date <= b.end);
  }

  function handleDayClick(date: string) {
    if (date < today.toISOString().slice(0, 10)) return; // no past dates
    if (phase === 'idle') {
      setSelStart(date);
      setSelEnd(null);
      setPhase('selecting');
      setShowForm(false);
    } else {
      // End selection
      const [start, end] = date >= selStart! ? [selStart!, date] : [date, selStart!];
      setSelStart(start);
      setSelEnd(end);
      setPhase('idle');
      setShowForm(true);
    }
  }

  function cancelSelection() {
    setSelStart(null);
    setSelEnd(null);
    setPhase('idle');
    setShowForm(false);
    setLabel('');
    setSource('blocked');
  }

  async function saveBlock() {
    if (!selStart || !selEnd) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: selectedProperty, start: selStart, end: selEnd, label, source }),
      });
      if (res.ok) {
        const block = await res.json();
        setBlocks((prev) => [...prev, block]);
        cancelSelection();
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(block: AvailabilityBlock) {
    await fetch(`/api/admin/blocks?propertyId=${block.propertyId}&blockId=${block.id}`, {
      method: 'DELETE',
    });
    setBlocks((prev) => prev.filter((b) => b.id !== block.id));
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  // Navigation
  function prevMonth() {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
  }

  // Render one month
  function renderMonth(year: number, month: number) {
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfWeek(year, month);
    const cells: (string | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: days }, (_, i) => isoDate(year, month, i + 1)),
    ];
    // Pad to complete rows
    while (cells.length % 7 !== 0) cells.push(null);

    const todayStr = today.toISOString().slice(0, 10);

    return (
      <div className="flex-1 min-w-[280px]">
        <div className="text-center font-semibold text-white mb-3">
          {MONTH_NAMES[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-white/40 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const isPast = date < todayStr;
            const isToday = date === todayStr;
            const block = blockForDate(date);
            const inRange = isInRange(date);
            const rangeStart = isRangeStart(date);
            const rangeEnd = isRangeEnd(date);

            let bg = 'bg-white/5 hover:bg-white/10';
            let textColor = 'text-white/80';

            if (isPast) {
              bg = '';
              textColor = 'text-white/20';
            } else if (block) {
              const src = SOURCES.find((s) => s.value === block.source);
              bg = '';
              textColor = 'text-white font-semibold';
              return (
                <div
                  key={date}
                  title={`${block.label || src?.label} (${block.start} → ${block.end})`}
                  className="h-8 rounded flex items-center justify-center text-xs cursor-default relative"
                  style={{ backgroundColor: (src?.color ?? '#888') + 'aa' }}
                >
                  <span className="text-white text-[11px] font-bold">{parseInt(date.slice(8))}</span>
                </div>
              );
            } else if (rangeStart || rangeEnd) {
              bg = 'bg-[#C8763A]';
              textColor = 'text-white font-bold';
            } else if (inRange) {
              bg = 'bg-[#C8763A]/40';
              textColor = 'text-white';
            } else if (isToday) {
              bg = 'bg-white/20 ring-1 ring-white/50';
              textColor = 'text-white font-bold';
            }

            return (
              <button
                key={date}
                disabled={isPast}
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => phase === 'selecting' && setHovered(date)}
                onMouseLeave={() => setHovered(null)}
                className={`h-8 rounded flex items-center justify-center text-xs transition-colors cursor-pointer disabled:cursor-default ${bg} ${textColor}`}
              >
                {parseInt(date.slice(8))}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Second month
  const month2 = currentMonth === 11 ? 0 : currentMonth + 1;
  const year2 = currentMonth === 11 ? currentYear + 1 : currentYear;

  return (
    <div className="min-h-screen bg-[#1A1008] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#C8763A] font-bold text-xl">4AR</span>
          <span className="text-[#8A9E5A] font-bold text-xl">Locations</span>
          <span className="text-white/30 mx-2">·</span>
          <span className="text-white/60 text-sm">Gestion des disponibilités</span>
        </div>
        <button
          onClick={logout}
          className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Onglets logements */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PROPERTIES.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedProperty(p.id); cancelSelection(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedProperty === p.id
                  ? 'bg-[#C8763A] text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
              {blocks.filter((b) => b.propertyId === p.id).length > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {blocks.filter((b) => b.propertyId === p.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendriers */}
          <div className="lg:col-span-2">
            {/* Instructions */}
            <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 flex items-start gap-3 text-sm text-white/60">
              {phase === 'idle' ? (
                <>
                  <span className="text-lg mt-0.5">👆</span>
                  <span>Cliquez sur une date pour commencer à sélectionner une période à bloquer.</span>
                </>
              ) : (
                <>
                  <span className="text-lg mt-0.5">📅</span>
                  <span className="text-[#E8A05A]">
                    Début sélectionné : <strong>{selStart}</strong>. Cliquez maintenant sur la date de fin.
                  </span>
                </>
              )}
            </div>

            {/* Navigation mois */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                ← Préc
              </button>
              <span className="text-white/60 text-sm">{MONTH_NAMES[currentMonth]} {currentYear}</span>
              <button onClick={nextMonth}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Suiv →
              </button>
            </div>

            {/* Deux mois côte à côte */}
            <div className="flex gap-6 flex-wrap">
              {renderMonth(currentYear, currentMonth)}
              {renderMonth(year2, month2)}
            </div>

            {/* Légende */}
            <div className="flex flex-wrap gap-3 mt-5">
              {SOURCES.map((s) => (
                <div key={s.value} className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-4">
            {/* Formulaire ajout */}
            {showForm && selStart && selEnd && (
              <div className="bg-white/5 border border-[#C8763A]/40 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span>📌</span> Bloquer cette période
                </h3>
                <div className="text-sm text-white/60 mb-4">
                  Du <strong className="text-white">{selStart}</strong><br />
                  au <strong className="text-white">{selEnd}</strong>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">Source</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {SOURCES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setSource(s.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            source === s.value ? 'bg-white/15 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">Note (optionnel)</label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="ex: Famille Martin"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#C8763A]"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveBlock}
                      disabled={saving}
                      className="flex-1 bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                    >
                      {saving ? '…' : '✓ Enregistrer'}
                    </button>
                    <button
                      onClick={cancelSelection}
                      className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white/60 rounded-xl text-sm transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des blocs */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4 flex items-center justify-between">
                <span>Périodes bloquées</span>
                <span className="text-white/40 text-sm font-normal">
                  {PROPERTIES.find((p) => p.id === selectedProperty)?.name}
                </span>
              </h3>

              {propertyBlocks.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">
                  Aucune période bloquée pour ce logement.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[...propertyBlocks]
                    .sort((a, b) => a.start.localeCompare(b.start))
                    .map((block) => {
                      const src = SOURCES.find((s) => s.value === block.source);
                      return (
                        <div
                          key={block.id}
                          className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 group"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: src?.color ?? '#888' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {block.label || src?.label}
                            </div>
                            <div className="text-xs text-white/40">
                              {block.start} → {block.end}
                            </div>
                          </div>
                          <button
                            onClick={() => removeBlock(block)}
                            className="opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 transition-all text-xs px-2 py-1 rounded"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
