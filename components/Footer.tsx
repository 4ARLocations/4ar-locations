import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-[#1E1509] text-[#9B8A74] border-t border-[#2C2416]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Marque */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/images/logo-4ar.png" alt="4AR Locations" width={44} height={44} className="object-contain opacity-90" />
            <div className="leading-none">
              <span className="text-[#C8763A] font-bold text-lg">4AR</span>
              <span className="text-[#6B9E4A] font-semibold text-lg"> Locations</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#6B5E4A]">{t('tagline')}</p>
          <a
            href="mailto:loc4ar@gmail.com"
            className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#6B5E4A] hover:text-[#C8763A] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            loc4ar@gmail.com
          </a>
        </div>

        {/* Destinations */}
        <div>
          <h4 className="text-[#E8DCC8] text-xs font-bold uppercase tracking-widest mb-4">{t('destinations_heading')}</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Risoul 1850', query: 'Risoul+1850+Hautes-Alpes+France' },
              { label: 'Avignon', query: 'Avignon+intramuros+Vaucluse+France' },
              { label: 'Lauris · Luberon', query: 'Lauris+Luberon+Vaucluse+France' },
            ].map(({ label, query }) => (
              <li key={label}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#6B5E4A] hover:text-[#C8763A] transition-colors group"
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[#E8DCC8] text-xs font-bold uppercase tracking-widest mb-4">Navigation</h4>
          <ul className="space-y-2.5">
            {([
              { path: 'biens', key: 'nav_properties' },
              { path: 'guide', key: 'nav_guide' },
              { path: 'carte', key: 'nav_map' },
              { path: 'favoris', key: 'nav_favorites' },
              { path: 'contact', key: 'nav_contact' },
            ] as const).map(({ path, key }) => (
              <li key={path}>
                <Link href={`/${locale}/${path}`} className="text-sm text-[#6B5E4A] hover:text-[#C8763A] transition-colors">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#E8DCC8] text-xs font-bold uppercase tracking-widest mb-4">{t('contact_heading')}</h4>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 text-sm bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors mb-4"
          >
            {t('book_cta')}
          </Link>
          <p className="text-xs text-[#6B5E4A] leading-relaxed">
            {t('book_sub')}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2C2416] py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[#4A3828]">
          <span>© {new Date().getFullYear()} 4AR Locations — {t('rights')}</span>
          <a
            href="/admin"
            title="Administration"
            className="text-white/25 hover:text-white/65 transition-colors"
            aria-label="Administration"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
