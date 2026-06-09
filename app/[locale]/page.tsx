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

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        <Image
          src="/images/bg-palais.jpg"
          alt="Palais des Papes, Avignon"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1008]/90 via-[#1A1008]/60 to-transparent" />
        {/* Grain subtil */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-28 md:py-40 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8763A] animate-pulse" />
              <span className="text-xs text-white/80 font-medium tracking-widest uppercase">Provence · Alpes · Avignon</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
              {t('hero.tagline')}
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/${locale}/biens`}
                className="bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-center shadow-lg shadow-[#C8763A]/25 hover:shadow-[#C8763A]/40">
                {t('hero.cta')}
              </Link>
              <Link href={`/${locale}/contact`}
                className="border border-white/40 hover:border-white/70 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-center backdrop-blur-sm hover:bg-white/5">
                {t('hero.cta_book')}
              </Link>
            </div>

            {/* Stats rapides */}
            <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/15">
              {[
                { num: '5', label: t('home.stat_properties') },
                { num: '3', label: t('home.stat_destinations') },
                { num: '10+', label: t('home.stat_experience') },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.num}</div>
                  <div className="text-xs text-white/55 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUI SOMMES-NOUS ─── */}
      <section className="bg-[#FAF7F2] py-20 border-b border-[#EDE6DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Texte */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8763A] mb-3">
                {t('about.title')}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-5 leading-snug">
                La famille Rougon<br />
                <span className="text-[#C8763A]">{t('home.welcome_subtitle')}</span>
              </h2>
              <p className="text-[#5C4F3A] text-base leading-relaxed mb-8">
                {t('about.text')}
              </p>

              {/* 3 valeurs */}
              <div className="space-y-4">
                {([
                  { icon: '🏡', title: t('about.value_1_title'), text: t('about.value_1_text') },
                  { icon: '📍', title: t('about.value_2_title'), text: t('about.value_2_text') },
                  { icon: '✉️', title: t('about.value_3_title'), text: t('about.value_3_text') },
                ]).map((v) => (
                  <div key={v.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#C8763A]/10 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                      {v.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C2416] text-sm">{v.title}</div>
                      <div className="text-[#9B8A74] text-sm mt-0.5">{v.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo + carte destinations */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Risoul 1850', sub: t('home.dest_risoul_sub'), image: '/images/bg-risoul-mountain.jpg', href: `/${locale}/biens/risoul`, span: false },
                { label: 'Avignon', sub: t('home.dest_avignon_sub'), image: '/images/bg-palais.jpg', href: `/${locale}/biens/avignon`, span: false },
                { label: 'Lauris · Luberon', sub: t('home.dest_lauris_sub'), image: '/images/bg-lauris-mid.jpg', href: `/${locale}/biens`, span: true },
              ].map((d) => (
                <Link key={d.label} href={d.href} className={`group block ${d.span ? 'col-span-2' : ''}`}>
                  <div className={`relative overflow-hidden rounded-2xl shadow-sm ${d.span ? 'h-40' : 'h-48'}`}>
                    <Image src={d.image} alt={d.label} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="font-bold text-base leading-tight">{d.label}</div>
                      <div className="text-xs text-white/65 mt-0.5">{d.sub}</div>
                    </div>
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NOS LOGEMENTS — fond Risoul ─── */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: "url('/images/bg-risoul-mountain.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-[#FAF7F2]/80 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8763A] mb-2">{t('home.properties_title')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416]">{t('properties.subtitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA réservation directe ─── */}
      <section className="relative text-white py-20 overflow-hidden">
        <Image src="/images/bg-lauris-panorama.jpg" alt="Vue panoramique de Lauris" fill
          className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C4A1A]/90 via-[#3A5A28]/80 to-[#1A3010]/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8AC870] mb-3">{t('home.direct_booking')}</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.advantage_title')}</h2>
          <p className="text-white/65 mb-10 max-w-xl mx-auto">{t('home.intro_text')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 text-left">
            {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
              <div key={k} className="flex items-start gap-2.5 bg-white/8 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <span className="text-[#8AC870] text-lg mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm text-white/85 leading-snug">{t(`contact.${k}`)}</span>
              </div>
            ))}
          </div>
          <Link href={`/${locale}/contact`}
            className="inline-block bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-10 py-4 rounded-xl transition-all text-base shadow-lg shadow-black/20 hover:shadow-black/30">
            {t('hero.cta_book')}
          </Link>
        </div>
      </section>
    </>
  );
}
