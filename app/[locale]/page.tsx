import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/lib/properties';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations();

  const destinations = [
    {
      label: 'Risoul 1850',
      sub: 'Hautes-Alpes',
      emoji: '⛷',
      image: '/images/bg-risoul-mountain.jpg',
      href: `/${locale}/biens/risoul`,
    },
    {
      label: 'Avignon',
      sub: 'Cité des Papes',
      emoji: '🏰',
      image: '/images/bg-palais.jpg',
      href: `/${locale}/biens/avignon`,
    },
    {
      label: 'Lauris',
      sub: 'Luberon · 3 maisons',
      emoji: '🌿',
      image: '/images/bg-lauris.jpg',
      href: `/${locale}/biens`,
    },
  ];

  return (
    <>
      {/* ─── HERO avec photo de fond ─── */}
      <section className="relative text-white overflow-hidden min-h-[520px] flex items-center">
        {/* Photo de fond — Palais des Papes */}
        <Image
          src="/images/bg-palais.jpg"
          alt="Palais des Papes, Avignon"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dégradé sombre pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1008]/85 via-[#1A1008]/70 to-[#1A1008]/40" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#C8763A] font-bold text-3xl md:text-4xl">4AR</span>
              <span className="text-[#8A9E5A] font-bold text-3xl md:text-4xl">Locations</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {t('hero.tagline')}
            </h1>
            <p className="text-lg md:text-xl text-[#E8DCC8] mb-8 opacity-90">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/biens`}
                className="bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="border-2 border-white/60 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center backdrop-blur-sm bg-white/5"
              >
                {t('hero.cta_book')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO + DESTINATIONS ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-4">{t('home.intro_title')}</h2>
          <p className="text-[#5C4F3A] text-lg leading-relaxed">{t('home.intro_text')}</p>
        </div>

        {/* Cartes destinations avec vraies photos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {destinations.map((d) => (
            <Link key={d.label} href={d.href} className="group block">
              <div className="relative overflow-hidden rounded-2xl h-44 shadow-sm">
                <Image
                  src={d.image}
                  alt={d.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dégradé bas → haut */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <div className="text-2xl mb-1">{d.emoji}</div>
                  <div className="font-bold text-lg leading-tight">{d.label}</div>
                  <div className="text-xs text-white/75 mt-0.5">{d.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Logements */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-8 text-center">{t('home.properties_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* ─── CTA réservation directe ─── */}
      <section className="relative text-white py-16 overflow-hidden">
        <Image
          src="/images/bg-lauris-panorama.jpg"
          alt="Vue panoramique de Lauris"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#3A5A28]/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('contact.advantage_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
              <div key={k} className="flex items-start gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <span className="text-[#C8763A] text-xl mt-0.5">✓</span>
                <span>{t(`contact.${k}`)}</span>
              </div>
            ))}
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-block bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            {t('hero.cta_book')}
          </Link>
        </div>
      </section>
    </>
  );
}
