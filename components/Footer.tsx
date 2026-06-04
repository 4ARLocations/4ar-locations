import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-[#2C2416] text-[#E8DCC8] mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#C8763A] font-bold text-xl">4AR</span>
            <span className="text-[#8A9E5A] font-semibold text-xl">Locations</span>
          </div>
          <p className="text-sm text-[#9B8A74]">{t('tagline')}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#E8DCC8]">Destinations</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Risoul+1850+Hautes-Alpes+France"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#9B8A74] hover:text-[#C8763A] transition-colors group"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Risoul 1850 — Hautes-Alpes
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Avignon+intramuros+Vaucluse+France"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#9B8A74] hover:text-[#C8763A] transition-colors group"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Avignon — Vaucluse
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Lauris+Luberon+Vaucluse+France"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#9B8A74] hover:text-[#C8763A] transition-colors group"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lauris — Luberon
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-[#E8DCC8]">Contact</h4>
          <a
            href="mailto:loc4ar@gmail.com"
            className="text-sm text-[#9B8A74] hover:text-[#C8763A] transition-colors"
          >
            loc4ar@gmail.com
          </a>
        </div>
      </div>
      <div className="border-t border-[#5C4F3A] text-center py-4 text-xs text-[#9B8A74]">
        © {new Date().getFullYear()} 4AR Locations — {t('rights')}
      </div>
    </footer>
  );
}
