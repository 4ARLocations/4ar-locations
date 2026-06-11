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
  { value: 'abritel',  label: 'Abritel',             color: '#00A699' },
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
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');

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
        <div className="flex items-center gap-4">
          <a
            href="/admin/photos"
            className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Photos
          </a>
          <a
            href="/admin/ical"
            className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            iCal
          </a>
          <a
            href="/admin/floor-plans"
            className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Plans interactifs
          </a>
          <a
            href="/fr"
            className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5"
            title="Retour au site"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Site
          </a>
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
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Onglets vue principale */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'calendar' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            📅 Calendrier
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'stats' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            📊 Statistiques
          </button>
        </div>

        {/* ── VUE STATS ── */}
        {activeTab === 'stats' && <StatsView blocks={blocks} onDeleteBlock={removeBlock} />}

        {/* ── VUE CALENDRIER ── */}
        {activeTab === 'calendar' && <>

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
        </> /* fin activeTab === 'calendar' */}
      </div>
    </div>
  );
}

// ── Composant Stats ───────────────────────────────────────────────────────────

function countNights(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000));
}

function StatsView({ blocks, onDeleteBlock }: { blocks: AvailabilityBlock[], onDeleteBlock: (block: AvailabilityBlock) => void }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const today = new Date().toISOString().slice(0, 10);

  const RESERVATION_SOURCES: BlockSource[] = ['airbnb', 'abritel', 'direct'];
  const ALL_SOURCES: BlockSource[] = ['airbnb', 'abritel', 'direct', 'family', 'blocked'];
  const SRC_COLOR: Record<string, string> = {
    airbnb:  '#FF5A5F',
    abritel: '#00A699',
    direct:  '#C8763A',
    family:  '#6B7C45',
    blocked: '#6B6B6B',
  };
  const SRC_LABEL: Record<string, string> = {
    airbnb:  'Airbnb',
    abritel: 'Abritel',
    direct:  'En direct',
    family:  'Famille',
    blocked: 'Bloqué',
  };

  // ── Réservations de l'année sélectionnée (hors bloqué/famille)
  const yearBlocks = blocks.filter(b =>
    (b.start.startsWith(String(year)) || b.end.startsWith(String(year))) &&
    RESERVATION_SOURCES.includes(b.source as BlockSource)
  );
  // Même filtre pour l'année précédente (comparatif)
  const prevYear = year - 1;
  const prevYearBlocks = blocks.filter(b =>
    (b.start.startsWith(String(prevYear)) || b.end.startsWith(String(prevYear))) &&
    RESERVATION_SOURCES.includes(b.source as BlockSource)
  );

  const totalBookings = yearBlocks.length;
  const totalNights   = yearBlocks.reduce((acc, b) => acc + countNights(b.start, b.end), 0);
  const prevTotal     = prevYearBlocks.length;
  const prevNights    = prevYearBlocks.reduce((acc, b) => acc + countNights(b.start, b.end), 0);
  const diffBookings  = totalBookings - prevTotal;
  const diffNights    = totalNights - prevNights;

  // Par plateforme
  const byPlatform = RESERVATION_SOURCES.map(src => {
    const s = yearBlocks.filter(b => b.source === src);
    return { src, count: s.length, nights: s.reduce((a, b) => a + countNights(b.start, b.end), 0) };
  });

  // Durée moyenne de séjour
  const avgNights = totalBookings > 0 ? Math.round(totalNights / totalBookings * 10) / 10 : 0;

  // Meilleur mois
  const monthlyData = Array.from({ length: 12 }, (_, m) => {
    const mb = yearBlocks.filter(b => b.start.startsWith(String(year)) && parseInt(b.start.slice(5, 7)) - 1 === m);
    return {
      label:   new Date(year, m, 1).toLocaleDateString('fr-FR', { month: 'short' }),
      full:    new Date(year, m, 1).toLocaleDateString('fr-FR', { month: 'long' }),
      airbnb:  mb.filter(b => b.source === 'airbnb').length,
      abritel: mb.filter(b => b.source === 'abritel').length,
      direct:  mb.filter(b => b.source === 'direct').length,
      total:   mb.length,
      nights:  mb.reduce((a, b) => a + countNights(b.start, b.end), 0),
    };
  });
  const maxMonthly = Math.max(...monthlyData.map(m => m.total), 1);
  const bestMonth  = monthlyData.reduce((best, m) => m.total > best.total ? m : best, monthlyData[0]);

  // Par logement + taux d'occupation
  const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
  const byProperty = PROPERTIES.map(p => {
    const pb = yearBlocks.filter(b => b.propertyId === p.id);
    const nights = pb.reduce((a, b) => a + countNights(b.start, b.end), 0);
    const occupancy = Math.round((nights / daysInYear) * 100);
    const perSrc = RESERVATION_SOURCES.map(src => ({
      src,
      count:  pb.filter(b => b.source === src).length,
      nights: pb.filter(b => b.source === src).reduce((a, b) => a + countNights(b.start, b.end), 0),
    }));
    return { ...p, total: pb.length, nights, occupancy, perSrc };
  });

  // Prochains séjours (toutes sources, à venir)
  const upcoming = blocks
    .filter(b => b.end >= today && RESERVATION_SOURCES.includes(b.source as BlockSource))
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 5);

  // Liste complète des réservations de l'année (triée par date)
  const allYearBookings = [...yearBlocks].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="space-y-8 pb-10">

      {/* Sélecteur année */}
      <div className="flex items-center gap-3">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">←</button>
        <span className="text-white font-bold text-2xl">{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">→</button>
      </div>

      {/* ── BLOC 0 : Prochains séjours ── */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Prochains séjours</h2>
          <div className="space-y-2">
            {upcoming.map(b => {
              const prop = PROPERTIES.find(p => p.id === b.propertyId);
              const nights = countNights(b.start, b.end);
              const isNow = b.start <= today && b.end >= today;
              return (
                <div key={b.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isNow ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/5'}`}>
                  {isNow && <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">EN COURS</span>}
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: SRC_COLOR[b.source] }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-white text-sm font-medium">{b.label || SRC_LABEL[b.source]}</span>
                    <span className="text-white/40 text-xs ml-2">{prop?.emoji} {prop?.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white/70 text-xs">{b.start} → {b.end}</div>
                    <div className="text-white/40 text-[10px]">{nights} nuit{nights > 1 ? 's' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BLOC 1 : Vue globale ── */}
      <div>
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Vue globale {year}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total réservations */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-white/40 text-xs mb-2">Total réservations</div>
            <div className="text-white text-5xl font-bold">{totalBookings}</div>
            <div className="flex items-center gap-1 mt-2">
              {prevTotal > 0 && (
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${diffBookings >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {diffBookings >= 0 ? '+' : ''}{diffBookings} vs {prevYear}
                </span>
              )}
              <span className="text-white/30 text-xs">{totalNights} nuits</span>
            </div>
          </div>
          {/* Nuits totales */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-white/40 text-xs mb-2">Nuits réservées</div>
            <div className="text-white text-5xl font-bold">{totalNights}</div>
            <div className="flex items-center gap-1 mt-2">
              {prevNights > 0 && (
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${diffNights >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {diffNights >= 0 ? '+' : ''}{diffNights} vs {prevYear}
                </span>
              )}
            </div>
          </div>
          {/* Durée moyenne */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-white/40 text-xs mb-2">Durée moyenne</div>
            <div className="text-white text-5xl font-bold">{avgNights}</div>
            <div className="text-white/30 text-xs mt-2">nuits par séjour</div>
          </div>
          {/* Meilleur mois */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-white/40 text-xs mb-2">Meilleur mois</div>
            <div className="text-white text-2xl font-bold capitalize">{totalBookings > 0 ? bestMonth.full : '—'}</div>
            <div className="text-white/30 text-xs mt-2">{totalBookings > 0 ? `${bestMonth.total} réservation${bestMonth.total > 1 ? 's' : ''}` : ''}</div>
          </div>
        </div>
      </div>

      {/* ── BLOC 2 : Cartes par plateforme ── */}
      <div>
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Par plateforme</h2>
        <div className="grid grid-cols-3 gap-4">
          {byPlatform.map(p => (
            <div key={p.src} className="rounded-2xl p-5 border" style={{ backgroundColor: SRC_COLOR[p.src] + '15', borderColor: SRC_COLOR[p.src] + '40' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SRC_COLOR[p.src] }} />
                <span className="text-white font-semibold text-sm">{SRC_LABEL[p.src]}</span>
              </div>
              <div className="text-white text-4xl font-bold mb-1">{p.count}</div>
              <div className="text-white/40 text-xs">réservation{p.count > 1 ? 's' : ''}</div>
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-end">
                <div>
                  <div className="text-white text-xl font-semibold">{p.nights}</div>
                  <div className="text-white/40 text-xs">nuit{p.nights > 1 ? 's' : ''}</div>
                </div>
                {totalBookings > 0 && (
                  <div className="text-right">
                    <div className="text-white/60 text-sm font-semibold">{Math.round((p.count / totalBookings) * 100)}%</div>
                    <div className="text-white/30 text-[10px]">du total</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BLOC 3 : Graphique mensuel ── */}
      <div>
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Activité mensuelle</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          {totalBookings === 0 ? (
            <p className="text-white/20 text-sm text-center py-4">Aucune réservation pour {year}</p>
          ) : (
            <>
              <div className="flex items-end gap-1.5" style={{ height: '100px' }}>
                {monthlyData.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {m.total > 0 && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1A1008] border border-white/20 rounded-lg px-2 py-1.5 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        <div className="text-white font-bold mb-0.5">{m.full}</div>
                        {m.airbnb > 0  && <div style={{ color: SRC_COLOR.airbnb  }}>{m.airbnb} Airbnb</div>}
                        {m.abritel > 0 && <div style={{ color: SRC_COLOR.abritel }}>{m.abritel} Abritel</div>}
                        {m.direct > 0  && <div style={{ color: SRC_COLOR.direct  }}>{m.direct} Direct</div>}
                        <div className="text-white/40 mt-0.5">{m.nights} nuits</div>
                      </div>
                    )}
                    <div className="w-full flex flex-col-reverse gap-px" style={{ height: `${(m.total / maxMonthly) * 90}px`, minHeight: m.total > 0 ? '4px' : '0' }}>
                      {(['airbnb', 'abritel', 'direct'] as const).map(src => {
                        const count = m[src];
                        if (!count) return null;
                        return <div key={src} className="w-full rounded-sm flex-shrink-0" style={{ height: `${(count / m.total) * 100}%`, minHeight: '4px', backgroundColor: SRC_COLOR[src] }} />;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-2">
                {monthlyData.map((m, i) => <div key={i} className="flex-1 text-center"><span className="text-white/30 text-[9px]">{m.label}</span></div>)}
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 flex-wrap">
                {RESERVATION_SOURCES.map(src => (
                  <div key={src} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: SRC_COLOR[src] }} />
                    <span className="text-white/40 text-xs">{SRC_LABEL[src]}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── BLOC 4 : Par logement + taux d'occupation ── */}
      <div>
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Par logement</h2>
        <div className="space-y-3">
          {byProperty.map(p => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.emoji}</span>
                  <span className="text-white font-semibold text-sm">{p.name}</span>
                </div>
                <div className="flex items-center gap-5 text-right">
                  <div>
                    <div className="text-white font-bold text-xl">{p.total}</div>
                    <div className="text-white/30 text-[10px]">réservation{p.total > 1 ? 's' : ''}</div>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <div className="text-white font-bold text-xl">{p.nights}</div>
                    <div className="text-white/30 text-[10px]">nuit{p.nights > 1 ? 's' : ''}</div>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <div className="text-white font-bold text-xl">{p.occupancy}%</div>
                    <div className="text-white/30 text-[10px]">occupation</div>
                  </div>
                </div>
              </div>
              {/* Barre taux d'occupation */}
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full bg-[#C8763A] transition-all" style={{ width: `${p.occupancy}%` }} />
              </div>
              {/* Détail par plateforme */}
              <div className="flex gap-2 flex-wrap">
                {p.perSrc.map(s => (
                  <div key={s.src} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: SRC_COLOR[s.src] + (s.count > 0 ? '20' : '08') }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.count > 0 ? SRC_COLOR[s.src] : 'rgba(255,255,255,0.15)' }} />
                    <span className="text-xs" style={{ color: s.count > 0 ? SRC_COLOR[s.src] : 'rgba(255,255,255,0.2)' }}>{SRC_LABEL[s.src]}</span>
                    <span className="text-xs font-bold" style={{ color: s.count > 0 ? 'white' : 'rgba(255,255,255,0.15)' }}>
                      {s.count > 0 ? `${s.count} · ${s.nights}n` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {totalBookings === 0 && <p className="text-white/20 text-sm text-center py-6">Aucune réservation pour {year}</p>}
      </div>

      {/* ── BLOC 5 : Liste complète des réservations ── */}
      <div>
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
          Liste des réservations {year} ({allYearBookings.length})
        </h2>
        {allYearBookings.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-6 bg-white/5 rounded-2xl">Aucune réservation pour {year}</p>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs">
                    <th className="text-left px-4 py-3 font-medium">Arrivée</th>
                    <th className="text-left px-4 py-3 font-medium">Départ</th>
                    <th className="text-left px-4 py-3 font-medium">Logement</th>
                    <th className="text-left px-4 py-3 font-medium">Plateforme</th>
                    <th className="text-left px-4 py-3 font-medium">Intitulé</th>
                    <th className="text-center px-4 py-3 font-medium">Nuits</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {allYearBookings.map(b => {
                    const prop = PROPERTIES.find(p => p.id === b.propertyId);
                    const nights = countNights(b.start, b.end);
                    const isPast = b.end < today;
                    return (
                      <tr key={b.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isPast ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3 text-white/80 font-medium">{b.start}</td>
                        <td className="px-4 py-3 text-white/60">{b.end}</td>
                        <td className="px-4 py-3 text-white/70">{prop?.emoji} {prop?.name}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: SRC_COLOR[b.source] + '25', color: SRC_COLOR[b.source] }}>
                            {SRC_LABEL[b.source]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">{b.label || '—'}</td>
                        <td className="px-4 py-3 text-center text-white/60 font-semibold">{nights}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onDeleteBlock(b)}
                            className="text-white/20 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded"
                            title="Supprimer"
                          >✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
