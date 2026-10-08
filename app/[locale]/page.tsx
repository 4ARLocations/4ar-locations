import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { properties } from '@/lib/properties';
import { getPropertyImages } from '@/lib/property-images';
import HomePropertiesSection from '@/components/HomePropertiesSection';
import HeroLogos from '@/components/HeroLogos';
import SectionReveal from '@/components/SectionReveal';
import CountUp from '@/components/CountUp';
import ScrollProgress from '@/components/ScrollProgress';
import Marquee from '@/components/Marquee';

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";

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
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <ScrollProgress />
      <HomeContent locale={locale} imageOverrides={imageOverrides} />
    </>
  );
}

function HomeContent({ locale, imageOverrides }: { locale: string; imageOverrides: Record<string, string> }) {
  const t = useTranslations();

  return (
    <>
      {/* ─────────────────────────────────────────
          HÉRO — splitté texte gauche / photo droite
      ───────────────────────────────────────── */}
      <section className="relative text-white overflow-hidden"
        style={{ minHeight: 'max(38vw, 500px)' }}>

        {/* Fond sombre base */}
        <div className="absolute inset-0" style={{ background: '#090A0C' }} />

        {/* ─── Aurora Provence — orbes warm animés ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        {/* Vignette — profondeur + contraste texte */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 115% 95% at 36% 44%, transparent 18%, rgba(5,2,0,0.62) 100%)' }} />

        {/* Logos destinations — interactifs */}
        <HeroLogos />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: GRAIN_SVG, backgroundSize: '160px 160px' }} />

        {/* Contenu */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-center"
          style={{ minHeight: 'inherit', paddingTop: '5rem', paddingBottom: '2.5rem' }}>
          <div className="lg:max-w-[60%]">
            <p className="hero-a text-[10px] font-bold uppercase tracking-[0.30em] text-[#C8763A] mb-5">
              Provence · Alpes · Avignon
            </p>

            <h1 className="hero-b font-serif font-normal mb-5 leading-[0.90] tracking-tight"
              style={{ fontSize: 'clamp(32px, 4.2vw, 68px)' }}>
              {t('hero.tagline')}
            </h1>

            <p className="hero-c text-[14px] text-white/44 mb-7 leading-relaxed max-w-[380px]">
              {t('hero.subtitle')}
            </p>

            {/* Statistiques */}
            <div className="hero-c flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-white/30 text-[10px] font-medium uppercase tracking-[0.14em]">
              <span className="flex items-center gap-2">
                <span className="text-[#C8763A] font-bold text-[17px] tabular-nums tracking-normal"><CountUp to={5} delay={420} /></span>
                logements
              </span>
              <span className="text-white/12">·</span>
              <span className="flex items-center gap-2">
                <span className="text-[#C8763A] font-bold text-[17px] tabular-nums tracking-normal"><CountUp to={3} delay={580} /></span>
                destinations
              </span>
              <span className="text-white/12">·</span>
              <span>Direct</span>
            </div>

            <div className="hero-d flex flex-col sm:flex-row gap-3">
              <Link href={`/${locale}/biens`}
                className="cta-pulse bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-center shadow-lg shadow-[#C8763A]/25 text-[14px]">
                {t('hero.cta')}
              </Link>
              <Link href={`/${locale}/contact`}
                className="border border-white/18 hover:border-white/42 hover:bg-white/5 text-white/65 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-all text-center text-[14px]">
                {t('hero.cta_book')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <Marquee />

      {/* ─── FAMILLE — intro juste sous la vitrine ─── */}
      <section className="relative py-20 overflow-hidden" style={{
        background: 'linear-gradient(170deg, #FAF7F2 0%, #F2E8DC 100%)',
        clipPath: 'polygon(0 0, 100% 56px, 100% 100%, 0 100%)',
        marginTop: '-56px',
        paddingTop: '120px',
      }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: GRAIN_SVG, backgroundSize: '240px 240px' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            <SectionReveal direction="left">
              <p className="section-tag text-[10px] font-bold uppercase tracking-[0.28em] text-[#C8763A] mb-5">
                {t('home.family_name')}
              </p>
              <span className="section-line" />
              <h2 className="font-serif text-[26px] md:text-[38px] font-normal text-[#2C2416] leading-tight tracking-tight mb-5">
                <span className="title-line"><span>{t('about.title')}</span></span>
              </h2>
              <p className="text-[#5C4F3A]/70 text-[15px] leading-relaxed">
                {t('about.text')}
              </p>
            </SectionReveal>

            <SectionReveal direction="right">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { num: '8+', label: "ans d'expérience" },
                  { num: '5', label: 'logements\nsoigneusement choisis' },
                  { num: '3', label: 'destinations\nuniques' },
                  { num: '100%', label: 'réservation\ndirecte, sans frais' },
                ].map((s) => (
                  <div key={s.num} className="flex flex-col gap-2 p-5 rounded-xl"
                    style={{ background: 'rgba(200,118,58,0.06)', border: '1px solid rgba(200,118,58,0.12)' }}>
                    <span className="font-serif text-[36px] leading-none text-[#C8763A]">{s.num}</span>
                    <span className="text-[12px] text-[#5C4F3A]/70 leading-snug whitespace-pre-line">{s.label}</span>
                  </div>
                ))}
              </div>
            </SectionReveal>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          DESTINATIONS
      ───────────────────────────────────────── */}
      <section className="relative pb-24 overflow-hidden" style={{
        clipPath: 'polygon(0 56px, 100% 0, 100% 100%, 0 100%)',
        marginTop: '-56px',
        paddingTop: '108px',
      }}>
        {/* Photo de fond — paysage alpin désaturé */}
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/images/bg-risoul-mountain.jpg" alt="" fill priority={false}
            className="object-cover object-center"
            style={{ filter: 'brightness(0.18) saturate(0.5)', transform: 'scale(1.04)' }} />
        </div>
        {/* Voile directionnel — renforce la lisibilité du texte en haut */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(170deg, rgba(8,4,2,0.72) 0%, rgba(4,2,1,0.50) 55%, rgba(2,1,0,0.38) 100%)' }} />
        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.055]"
          style={{ backgroundImage: GRAIN_SVG, backgroundSize: '180px 180px' }} />
        {/* Vignette coins */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 130% 110% at 50% 50%, transparent 48%, rgba(0,0,0,0.50) 100%)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <SectionReveal className="mb-12">
            <p className="section-tag text-[10px] font-bold uppercase tracking-[0.28em] text-[#C8763A]/70 mb-5">
              Nos destinations
            </p>
            <span className="section-line" />
            <h2 className="text-[30px] md:text-[42px] font-serif font-normal text-[#F2E8DA] leading-tight tracking-tight mb-4">
              <span className="title-line"><span>Provence &amp; Alpes —</span></span>
              <span className="title-line"><span>à vous de choisir.</span></span>
            </h2>
            <p className="text-sm text-white/38 leading-relaxed max-w-xl">
              Entre le Luberon et ses villages perchés, les pistes des Hautes-Alpes et le cœur
              historique d&apos;Avignon — trois univers à deux heures de Marseille.
            </p>
          </SectionReveal>

          {/* Destinations — 3 colonnes égales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-20">
            {[
              {
                label: 'Lauris · Luberon',
                tag: 'Vaucluse',
                sub: '3 maisons · Provence',
                image: '/images/bg-lauris-mid.jpg',
                href: `/${locale}/biens#luberon`,
                direction: 'left' as const,
              },
              {
                label: 'Risoul 1850',
                tag: 'Hautes-Alpes',
                sub: 'Station de ski · Alpes du Sud',
                image: '/images/bg-risoul-mountain.jpg',
                href: `/${locale}/biens/risoul`,
                direction: 'up' as const,
              },
              {
                label: 'Avignon',
                tag: 'Vaucluse',
                sub: 'Centre historique · Palais des Papes',
                image: '/images/bg-palais.jpg',
                href: `/${locale}/biens/avignon`,
                direction: 'right' as const,
              },
            ].map((d, di) => (
              <SectionReveal key={d.label} direction={d.direction}>
                <Link href={d.href} className="group block card-tilt rounded-xl">
                  <div className={`relative overflow-hidden rounded-xl h-56 ${di === 1 ? 'md:h-[440px]' : 'md:h-[360px]'}`}>
                    <Image src={d.image} alt={d.label} fill
                      className="object-cover photo-card-img" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
                    {/* Ligne terracotta en bas */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8763A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/42 mb-2">{d.tag}</p>
                      <p className="font-serif text-[20px] leading-tight mb-1">{d.label}</p>
                      <p className="text-[12px] text-white/48">{d.sub}</p>
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>

          {/* Valeurs — 01 / 02 / 03 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-12 border-t border-white/8">
            {([
              { title: t('about.value_1_title'), text: t('about.value_1_text') },
              { title: t('about.value_2_title'), text: t('about.value_2_text') },
              { title: t('about.value_3_title'), text: t('about.value_3_text') },
            ] as { title: string; text: string }[]).map((v, i) => (
              <SectionReveal key={v.title} direction="up" delay={i * 120}>
                <span className="font-serif text-[54px] text-white/8 leading-none block mb-2 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-7 h-0.5 bg-[#C8763A] mb-4" />
                <p className="font-semibold text-[#E8D8C0] text-[14px] mb-2">{v.title}</p>
                <p className="text-white/38 text-sm leading-relaxed">{v.text}</p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOGEMENTS ─── */}
      <HomePropertiesSection
        properties={properties}
        locale={locale}
        imageOverrides={imageOverrides}
      />

      {/* ─── CTA ─── */}
      <section className="relative text-white py-28" style={{
        clipPath: 'polygon(0 48px, 100% 0, 100% 100%, 0 100%)',
        marginTop: '-48px',
      }}>
        <Image src="/images/bg-lauris-panorama.jpg" alt="Vue panoramique Luberon" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#160A04]/94 via-[#2C1608]/86 to-[#0E0602]/92" />
        {/* Grain photo */}
        <div className="absolute inset-0 opacity-[0.045]"
          style={{ backgroundImage: GRAIN_SVG, backgroundSize: '180px 180px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8AC870]/70 mb-6">
              Réservation directe
            </p>
            <h2 className="font-serif text-[30px] md:text-[42px] font-normal mb-6 leading-tight tracking-tight">
              <span className="title-line"><span>{t('contact.advantage_title')}</span></span>
            </h2>
            <p className="text-white/50 mb-11 max-w-lg mx-auto text-sm leading-relaxed">
              {t('home.intro_text')}
            </p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-12 max-w-lg mx-auto text-left">
              {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
                <div key={k} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-[#8AC870] font-bold leading-none mt-0.5">—</span>
                  <span>{t(`contact.${k}`)}</span>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-10 py-4 rounded-xl transition-colors shadow-lg shadow-black/20">
              {t('hero.cta_book')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
