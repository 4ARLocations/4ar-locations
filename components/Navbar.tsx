'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const locales = ['fr', 'en', 'de'];

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lp = (path: string) => `/${locale}${path}`;

  const isActive = (path: string) =>
    path === '' ? pathname === `/${locale}` || pathname === `/${locale}/` : pathname.startsWith(lp(path));

  const navLink = (path: string, label: string) => (
    <Link
      href={lp(path)}
      className={`text-sm font-medium transition-colors relative py-1 ${
        isActive(path) ? 'text-[#C8763A]' : 'text-[#5C4F3A] hover:text-[#2C2416]'
      }`}
    >
      {label}
      {isActive(path) && (
        <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 bg-[#C8763A] rounded-full" />
      )}
    </Link>
  );

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
      scrolled ? 'shadow-[0_1px_12px_rgba(44,36,22,0.08)] border-b border-[#E8DCC8]/80' : 'border-b border-[#E8DCC8]'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-8">

        {/* Logo */}
        <Link href={lp('')} className="flex items-center gap-2.5 flex-shrink-0 mr-2">
          <Image
            src="/images/logo-4ar.png"
            alt="4AR Locations"
            width={38}
            height={38}
            className="object-contain"
            priority
          />
          <div className="flex items-baseline gap-0.5 leading-none">
            <span className="text-[#C8763A] text-[17px] font-bold tracking-tight">4AR</span>
            <span className="text-[#6B7C45] text-[17px] font-semibold tracking-tight"> Locations</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 flex-1">
          {navLink('', t('home'))}
          {navLink('/biens', t('properties'))}
          {navLink('/guide', t('guide'))}
          {navLink('/carte', t('map'))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={lp('/favoris')}
            className="p-1.5 text-[#9B8A74] hover:text-[#C8763A] transition-colors rounded-lg hover:bg-[#FAF7F2]"
            title="Mes favoris"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          <Link
            href={lp('/contact')}
            className="bg-[#C8763A] hover:bg-[#A85E28] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('contact')}
          </Link>

          <div className="flex items-center border border-[#E8DCC8] rounded-lg overflow-hidden">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  l === locale ? 'bg-[#2C2416] text-white' : 'text-[#9B8A74] hover:bg-[#FAF7F2] hover:text-[#5C4F3A]'
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden ml-auto p-1.5 text-[#5C4F3A] rounded-lg hover:bg-[#FAF7F2] transition-colors"
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
        <div className="md:hidden bg-white border-t border-[#E8DCC8] px-4 py-3 flex flex-col gap-0.5">
          {[
            { path: '', label: t('home') },
            { path: '/biens', label: t('properties') },
            { path: '/guide', label: t('guide') },
            { path: '/carte', label: t('map') },
            { path: '/favoris', label: 'Favoris' },
          ].map(({ path, label }) => (
            <Link
              key={path}
              href={lp(path)}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(path) ? 'text-[#C8763A] bg-[#FAF4EE]' : 'text-[#5C4F3A] hover:bg-[#FAF7F2]'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href={lp('/contact')}
            onClick={() => setMenuOpen(false)}
            className="mt-2 text-center bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {t('contact')}
          </Link>
          <div className="flex gap-1.5 pt-3 mt-1 border-t border-[#E8DCC8]">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  l === locale ? 'bg-[#2C2416] text-white' : 'border border-[#E8DCC8] text-[#9B8A74]'
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
