/**
 * Calendrier de disponibilité — lecture seule pour les visiteurs
 * Affiche 3 mois avec les jours bloqués grisés
 */
import { getBlocks } from '@/lib/availability';

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAY_NAMES = ['Lu','Ma','Me','Je','Ve','Sa','Di'];

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfWeek(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

function MonthGrid({
  year, month, blocks, todayStr,
}: {
  year: number; month: number;
  blocks: { start: string; end: string; source: string }[];
  todayStr: string;
}) {
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfWeek(year, month);
  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => isoDate(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Côté visiteur : couleur unique pour toutes les dates indisponibles
  // (peu importe la source — Airbnb, Booking, direct, etc.)
  const UNAVAILABLE_COLOR = '#C8763A';

  return (
    <div className="flex-1 min-w-[220px]">
      <div className="text-center text-sm font-semibold text-[#2C2416] mb-2">
        {MONTH_NAMES[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-px mb-0.5">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] text-[#9B8A74] font-medium py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="h-7" />;
          const isPast = date < todayStr;
          const isToday = date === todayStr;
          const block = blocks.find((b) => date >= b.start && date <= b.end);

          if (isPast) {
            return (
              <div key={date} className="h-7 flex items-center justify-center text-xs text-[#D8CFC4]">
                {parseInt(date.slice(8))}
              </div>
            );
          }
          if (block) {
            return (
              <div
                key={date}
                className="h-7 flex items-center justify-center text-xs text-white font-medium rounded-sm"
                style={{ backgroundColor: UNAVAILABLE_COLOR + 'bb' }}
                title="Non disponible"
              >
                {parseInt(date.slice(8))}
              </div>
            );
          }
          return (
            <div
              key={date}
              className={`h-7 flex items-center justify-center text-xs rounded-sm ${
                isToday
                  ? 'bg-[#2C2416] text-white font-bold'
                  : 'text-[#5C4F3A] hover:bg-[#E8DCC8]/60'
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

export default async function AvailabilityCalendar({ propertyId }: { propertyId: string }) {
  const blocks = await getBlocks(propertyId);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Générer les 3 prochains mois
  const months = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  // Filtrer les blocs futurs (ou en cours)
  const futureBlocks = blocks.filter((b) => b.end >= todayStr);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-[#2C2416] mb-1 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Disponibilités
      </h2>
      <p className="text-xs text-[#9B8A74] mb-4">
        {futureBlocks.length > 0
          ? 'Les dates en orange sont déjà réservées — contactez-nous pour vérifier vos dates.'
          : 'Aucune réservation enregistrée pour les prochains mois — contactez-nous pour vérifier les disponibilités.'}
      </p>

      <div className="bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl p-4">
        <div className="flex flex-wrap gap-6">
          {months.map(({ year, month }) => (
            <MonthGrid
              key={`${year}-${month}`}
              year={year}
              month={month}
              blocks={futureBlocks}
              todayStr={todayStr}
            />
          ))}
        </div>

        {/* Légende compacte */}
        <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-[#E8DCC8]">
          <div className="flex items-center gap-1.5 text-xs text-[#9B8A74]">
            <span className="w-3 h-3 rounded-sm bg-[#E8DCC8] border border-[#D8CFC4]" />
            Disponible
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#9B8A74]">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C8763Acc' }} />
            Réservé
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#9B8A74]">
            <span className="w-3 h-3 rounded-sm bg-[#2C2416]" />
            Aujourd'hui
          </div>
        </div>
      </div>
    </div>
  );
}
