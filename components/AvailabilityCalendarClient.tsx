'use client';
import { useState } from 'react';

const MONTH_NAMES: Record<string, string[]> = {
  fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
};
const DAY_NAMES: Record<string, string[]> = {
  fr: ['Lu','Ma','Me','Je','Ve','Sa','Di'],
  en: ['Mo','Tu','We','Th','Fr','Sa','Su'],
  de: ['Mo','Di','Mi','Do','Fr','Sa','So'],
};

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfWeek(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

function MonthGrid({
  year, month, blocks, todayStr, locale,
}: {
  year: number; month: number;
  blocks: { start: string; end: string }[];
  todayStr: string;
  locale: string;
}) {
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfWeek(year, month);
  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => isoDate(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthNames = MONTH_NAMES[locale] ?? MONTH_NAMES['fr'];
  const dayNames = DAY_NAMES[locale] ?? DAY_NAMES['fr'];

  return (
    <div className="min-w-0">
      <div className="text-center text-sm font-semibold text-[#2C2416] mb-2 tracking-wide">
        {monthNames[month]} <span className="text-[#9B8A74] font-normal">{year}</span>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[10px] text-[#B0A090] font-semibold py-0.5 uppercase tracking-wider">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="h-7" />;
          const isPast = date < todayStr;
          const isToday = date === todayStr;
          const isBooked = blocks.some((b) => date >= b.start && date <= b.end);

          if (isPast) {
            return (
              <div key={date} className="h-7 flex items-center justify-center text-xs text-[#D8CFC4]">
                {parseInt(date.slice(8))}
              </div>
            );
          }
          if (isBooked) {
            return (
              <div
                key={date}
                className="h-7 flex items-center justify-center text-xs text-white font-medium rounded"
                style={{ backgroundColor: '#C8763Acc' }}
              >
                {parseInt(date.slice(8))}
              </div>
            );
          }
          return (
            <div
              key={date}
              className={`h-7 flex items-center justify-center text-xs rounded ${
                isToday
                  ? 'bg-[#2C2416] text-white font-bold'
                  : 'text-[#5C4F3A] hover:bg-[#F0EBE3]'
              }`}
            >
              {parseInt(date.slice(8))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  blocks: { start: string; end: string }[];
  todayStr: string;
  locale: string;
  labels: {
    title: string;
    has_blocks: string;
    no_blocks: string;
    available: string;
    booked: string;
    today: string;
    prev: string;
    next: string;
  };
}

const MONTHS_PER_PAGE = 6;
const MAX_MONTHS_AHEAD = 18;

export default function AvailabilityCalendarClient({ blocks, todayStr, locale, labels }: Props) {
  const [offset, setOffset] = useState(0); // offset en mois depuis aujourd'hui

  const today = new Date(todayStr);
  const months = Array.from({ length: MONTHS_PER_PAGE }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const canPrev = offset > 0;
  const canNext = offset + MONTHS_PER_PAGE < MAX_MONTHS_AHEAD;

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-[#2C2416] flex items-center gap-2">
          <svg className="w-5 h-5 text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {labels.title}
        </h2>
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffset((o) => Math.max(0, o - MONTHS_PER_PAGE))}
            disabled={!canPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E8DCC8] text-[#9B8A74] hover:border-[#C8763A] hover:text-[#C8763A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label={labels.prev}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setOffset((o) => Math.min(MAX_MONTHS_AHEAD - MONTHS_PER_PAGE, o + MONTHS_PER_PAGE))}
            disabled={!canNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E8DCC8] text-[#9B8A74] hover:border-[#C8763A] hover:text-[#C8763A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label={labels.next}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-xs text-[#9B8A74] mb-4">
        {blocks.length > 0 ? labels.has_blocks : labels.no_blocks}
      </p>

      {/* Grille 3×2 */}
      <div className="bg-white border border-[#E8DCC8] rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map(({ year, month }) => (
            <MonthGrid
              key={`${year}-${month}`}
              year={year}
              month={month}
              blocks={blocks}
              todayStr={todayStr}
              locale={locale}
            />
          ))}
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-5 mt-5 pt-4 border-t border-[#F0EBE3]">
          <div className="flex items-center gap-2 text-xs text-[#9B8A74]">
            <span className="w-3 h-3 rounded bg-white border border-[#D8CFC4]" />
            {labels.available}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9B8A74]">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: '#C8763Acc' }} />
            {labels.booked}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9B8A74]">
            <span className="w-3 h-3 rounded bg-[#2C2416]" />
            {labels.today}
          </div>
        </div>
      </div>
    </div>
  );
}
