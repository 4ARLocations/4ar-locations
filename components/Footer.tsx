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
          <ul className="space-y-1 text-sm text-[#9B8A74]">
            <li>Risoul 1850 — Hautes-Alpes</li>
            <li>Avignon — Vaucluse</li>
            <li>Lauris — Luberon</li>
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
