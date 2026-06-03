import { useTranslations } from 'next-intl';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/lib/properties';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#2C2416] via-[#5C4F3A] to-[#6B7C45] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🌿</div>
          <div className="absolute bottom-10 right-10 text-9xl">🏔️</div>
          <div className="absolute top-20 right-1/3 text-7xl">🏰</div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
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
                className="border-2 border-white/60 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center"
              >
                {t('hero.cta_book')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-4">{t('home.intro_title')}</h2>
          <p className="text-[#5C4F3A] text-lg leading-relaxed">{t('home.intro_text')}</p>
        </div>

        {/* Destinations strip */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { emoji: '🏔️', label: 'Risoul 1850', sub: 'Hautes-Alpes', color: 'bg-slate-700' },
            { emoji: '🏰', label: 'Avignon', sub: 'Vaucluse', color: 'bg-orange-800' },
            { emoji: '🌿', label: 'Lauris', sub: 'Luberon', color: 'bg-green-800' },
          ].map((d) => (
            <div key={d.label} className={`${d.color} text-white rounded-2xl p-5 text-center`}>
              <div className="text-3xl mb-2">{d.emoji}</div>
              <div className="font-bold">{d.label}</div>
              <div className="text-xs opacity-75 mt-0.5">{d.sub}</div>
            </div>
          ))}
        </div>

        {/* Properties */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#2C2416] mb-8 text-center">{t('home.properties_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* Direct booking CTA */}
      <section className="bg-[#6B7C45] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('contact.advantage_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
              <div key={k} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
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
