'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const localeLabels: Record<string, string> = { fr: '🇫🇷 FR', en: '🇬🇧 EN', de: '🇩🇪 DE' };
const locales = ['fr', 'en', 'de'];

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);

  const localePath = (path: string) => `/${locale}${path}`;

  return (
    <nav className="bg-white border-b border-[#E8DCC8] sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={localePath('')} className="flex items-center gap-2">
          <Image
            src="/images/logo-4ar.png"
            alt=""
            width={52}
            height={52}
            className="object-contain rounded-full"
            priority
          />
          <div className="flex items-baseline gap-1">
            <span className="text-[#C8763A] text-xl tracking-tight font-serif">4AR</span>
            <span className="text-[#6B7C45] text-xl font-serif">Locations</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href={localePath('')} className="text-[#5C4F3A] hover:text-[#C8763A] transition-colors font-medium">
            {t('home')}
          </Link>
          <Link href={localePath('/biens')} className="text-[#5C4F3A] hover:text-[#C8763A] transition-colors font-medium">
            {t('properties')}
          </Link>
          <Link href={localePath('/guide')} className="text-[#5C4F3A] hover:text-[#C8763A] transition-colors font-medium">
            {t('guide')}
          </Link>
          <Link href={localePath('/carte')} className="text-[#5C4F3A] hover:text-[#C8763A] transition-colors font-medium">
            {t('map')}
          </Link>
          <Link href={localePath('/favoris')} className="text-[#5C4F3A] hover:text-[#C8763A] transition-colors" title="Mes favoris">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          <Link href={localePath('/contact')} className="bg-[#C8763A] text-white px-4 py-2 rounded-lg hover:bg-[#A85E28] transition-colors font-medium">
            {t('contact')}
          </Link>
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-[#E8DCC8] rounded-lg overflow-hidden">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`px-2 py-1 text-sm font-medium transition-colors ${l === locale ? 'bg-[#C8763A] text-white' : 'text-[#5C4F3A] hover:bg-[#FAF7F2]'}`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-[#5C4F3A]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8DCC8] px-4 pb-4 flex flex-col gap-3">
          <Link href={localePath('')} onClick={() => setMenuOpen(false)} className="py-2 text-[#5C4F3A] font-medium">{t('home')}</Link>
          <Link href={localePath('/biens')} onClick={() => setMenuOpen(false)} className="py-2 text-[#5C4F3A] font-medium">{t('properties')}</Link>
          <Link href={localePath('/guide')} onClick={() => setMenuOpen(false)} className="py-2 text-[#5C4F3A] font-medium">{t('guide')}</Link>
          <Link href={localePath('/carte')} onClick={() => setMenuOpen(false)} className="py-2 text-[#5C4F3A] font-medium">{t('map')}</Link>
          <Link href={localePath('/contact')} onClick={() => setMenuOpen(false)} className="py-2 text-[#C8763A] font-semibold">{t('contact')}</Link>
          <div className="flex gap-2 pt-2">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`px-3 py-1 rounded text-sm font-medium ${l === locale ? 'bg-[#C8763A] text-white' : 'border border-[#E8DCC8] text-[#5C4F3A]'}`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
