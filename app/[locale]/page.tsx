import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/lib/properties';
import { getPropertyImages } from '@/lib/property-images';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '4AR Locations',
  url: 'https://www.4arlocations.com',
  logo: 'https://www.4arlocations.com/icon-512.png',
  email: 'loc4ar@gmail.com',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'loc4ar@gmail.com',
    contactType: 'customer service',
    availableLanguage: ['French', 'English', 'German'],
  },
  sameAs: [
    'https://www.airbnb.fr/users/show/12345',
  ],
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const imageData = await Promise.all(
    properties.map(async (p) => {
      const imgs = await getPropertyImages(p.id, p.images);
      return { id: p.id, img: imgs[0] ?? p.image };
    })
  );
  const imageOverrides: Record<string, string> = {};
  imageData.forEach(({ id, img }) => { if (img) imageOverrides[id] = img; });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeContent locale={locale} imageOverrides={imageOverrides} />
    </>
  );
}

function HomeContent({ locale, imageOverrides }: { locale: string; imageOverrides: Record<string, string> }) {
  const t = useTranslations();

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative text-white overflow-hidden flex items-center" style={{ minHeight: 'max(65vw, 480px)' }}>
        <Image
          src="/images/hero-logo.png"
          alt="4AR Locations — Provence & Alpes"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#130C04]/92 via-[#1A1008]/55 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8763A] animate-pulse" />
              <span className="text-xs text-white/75 font-medium tracking-[0.15em] uppercase">Provence · Alpes · Avignon</span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-5 leading-[1.1] tracking-tight">
              {t('hero.tagline')}
            </h1>
            <p className="text-lg text-white/65 mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/biens`}
                className="bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-7 py-3.5 rounded-xl transition-all text-center shadow-lg shadow-[#C8763A]/30 hover:shadow-[#C8763A]/45 hover:-translate-y-px"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="border border-white/30 hover:border-white/60 hover:bg-white/8 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-center backdrop-blur-sm"
              >
                {t('hero.cta_book')}
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
              {[
                { num: '5', label: t('home.stat_properties') },
                { num: '3', label: t('home.stat_destinations') },
                { num: '8+', label: t('home.stat_experience') },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.num}</div>
                  <div className="text-xs text-white/45 uppercase tracking-widest mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUI SOMMES-NOUS ─── */}
      <section className="bg-[#FAF7F2] py-20 border-b border-[#EDE6DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8763A] mb-2">{t('about.title')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416] leading-tight">
                {t('home.family_name')}<br />
                <span className="text-[#C8763A]">{t('home.welcome_subtitle')}</span>
              </h2>
            </div>
            <p className="text-[#5C4F3A] text-sm leading-relaxed max-w-xs text-[#9B8A74]">
              {t('about.text')}
            </p>
          </div>

          {/* Grille destinations */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { label: 'Risoul 1850', sub: t('home.dest_risoul_sub'), image: '/images/bg-risoul-mountain.jpg', href: `/${locale}/biens/risoul`, tag: 'Hautes-Alpes', span: false },
              { label: 'Avignon', sub: t('home.dest_avignon_sub'), image: '/images/bg-palais.jpg', href: `/${locale}/biens/avignon`, tag: 'Vaucluse', span: false },
              { label: 'Lauris · Luberon', sub: t('home.dest_lauris_sub'), image: '/images/bg-lauris-mid.jpg', href: `/${locale}/biens#luberon`, tag: 'Vaucluse', span: true },
            ].map((d) => (
              <Link key={d.label} href={d.href} className={`group block ${d.span ? 'col-span-2 md:col-span-1' : ''}`}>
                <div className="relative overflow-hidden rounded-2xl h-52 md:h-64">
                  <Image src={d.image} alt={d.label} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/55 mb-0.5">{d.tag}</p>
                    <p className="font-bold text-base leading-tight">{d.label}</p>
                    <p className="text-xs text-white/60 mt-0.5">{d.sub}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Valeurs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#EDE6DC]">
            {([
              { icon: '🏡', title: t('about.value_1_title'), text: t('about.value_1_text') },
              { icon: '📍', title: t('about.value_2_title'), text: t('about.value_2_text') },
              { icon: '✉️', title: t('about.value_3_title'), text: t('about.value_3_text') },
            ]).map((v) => (
              <div key={v.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C8763A]/10 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                  {v.icon}
                </div>
                <div>
                  <p className="font-semibold text-[#2C2416] text-sm">{v.title}</p>
                  <p className="text-[#9B8A74] text-sm mt-0.5 leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOS LOGEMENTS ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8763A] mb-2">{t('home.properties_title')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416]">{t('properties.subtitle')}</h2>
            </div>
            <Link
              href={`/${locale}/biens`}
              className="text-sm font-semibold text-[#C8763A] hover:text-[#A85E28] flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              {t('home.see_all_properties')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} locale={locale} imageOverride={imageOverrides[p.id]} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA réservation directe ─── */}
      <section className="relative text-white py-24 overflow-hidden">
        <Image src="/images/bg-lauris-panorama.jpg" alt="Vue panoramique Luberon" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A3010]/93 via-[#2C4A1A]/85 to-[#0E1E08]/90" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AC870] mb-3">{t('home.direct_booking')}</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.advantage_title')}</h2>
          <p className="text-white/55 mb-10 max-w-md mx-auto text-sm leading-relaxed">{t('home.intro_text')}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
              <div key={k} className="flex items-start gap-2 bg-white/[0.07] rounded-xl p-3.5 backdrop-blur-sm border border-white/[0.09] text-left">
                <span className="text-[#8AC870] font-bold text-sm mt-0.5 flex-shrink-0">✓</span>
                <span className="text-xs text-white/75 leading-snug">{t(`contact.${k}`)}</span>
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-10 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-black/25"
          >
            {t('hero.cta_book')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
