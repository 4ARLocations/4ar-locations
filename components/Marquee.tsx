const ITEMS = [
  'LUBERON', 'LAURIS', 'RISOUL 1850', 'AVIGNON',
  'PROVENCE', 'HAUTES-ALPES', 'RÉSERVATION DIRECTE', 'DEPUIS 2008',
];

export default function Marquee() {
  const text = ITEMS.join('  ·  ') + '  ·  ';
  return (
    <div className="overflow-hidden bg-[#110C06] py-3.5 select-none">
      <div className="marquee-track flex whitespace-nowrap">
        {[text, text].map((t, i) => (
          <span
            key={i}
            className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#C8763A]/55"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
