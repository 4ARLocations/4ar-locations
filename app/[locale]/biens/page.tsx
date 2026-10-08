import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import PageHero from '@/components/PageHero';
import { properties } from '@/lib/properties';
import { getPropertyImages } from '@/lib/property-images';
import { getReviews } from '@/lib/redis';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('biens_title') };
}

export default async function BiensPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ region?: string }>;
}) {
  const { locale } = await params;
  const { region } = await searchParams;

  // Charger les photos et les avis en parallèle
  const [imageData, reviewData] = await Promise.all([
    Promise.all(properties.map(async (p) => {
      const imgs = await getPropertyImages(p.id, p.images);
      return { id: p.id, img: imgs[0] };
    })),
    Promise.all(properties.map(async (p) => {
      const reviews = await getReviews(p.id);
      const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
      return { id: p.id, avg, count: reviews.length };
    })),
  ]);

  const imageOverrides: Record<string, string> = {};
  imageData.forEach(({ id, img }) => { if (img) imageOverrides[id] = img; });

  // "Coup de cœur" : note moyenne ≥ 4.5 avec au moins 3 avis
  const topRated = new Set(reviewData.filter((r) => r.avg >= 4.5 && r.count >= 3).map((r) => r.id));

  const t = await getTranslations({ locale, namespace: 'properties' });

  return (
    <>
      <PageHero
        tag="Nos destinations"
        title={t('title')}
        subtitle={t('subtitle')}
        compact
      />
      <BiensContent locale={locale} imageOverrides={imageOverrides} regionFilter={region} topRated={topRated} />
    </>
  );
}

function BiensContent({ locale, imageOverrides, regionFilter, topRated }: { locale: string; imageOverrides: Record<string, string>; regionFilter?: string; topRated?: Set<string> }) {
  const t = useTranslations('properties');
  const tLauris = useTranslations('lauris');
  const tCombine = useTranslations('lauris_combine');

  const risoul = properties.find((p) => p.id === 'risoul')!;
  const avignon = properties.find((p) => p.id === 'avignon')!;
  const luberon = properties.filter((p) => p.region === 'luberon');

  return (
    <>
      {/* ─── LIEN CARTE ─── */}
      <section className="py-3.5 border-b border-[#E8DCC8]" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#C8763A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <div>
              <p className="font-semibold text-[#2C2416] text-sm">{t('map_promo_title')}</p>
              <p className="text-xs text-[#9B8A74]">{t('map_promo_sub')}</p>
            </div>
          </div>
          <Link
            href={`/${locale}/carte`}
            className="flex-shrink-0 bg-[#2C2416] hover:bg-[#4A3828] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {t('see_map')} →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ÉCRAN SCINDÉ — Alpes du Sud | Avignon
          Chaque moitié a son propre fond photographique
      ══════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row mb-2">

        {/* ─── CÔTÉ GAUCHE : Alpes du Sud ─── */}
        <div
          className="relative flex-1 py-10 px-6 md:px-10"
          style={{
            backgroundImage: "url('/images/bg-risoul-mountain.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(4,10,18,.72)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-1 h-10 bg-[#C8763A] rounded-full flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.28em] text-[#C8763A] mb-0.5">Hautes-Alpes</p>
                <h2 className="font-serif text-[20px] font-normal text-white leading-tight">{t('alps_title')}</h2>
                <p className="text-[11px] text-white/45 mt-0.5">{t('alps_sub')}</p>
              </div>
            </div>
            <PropertyCard property={risoul} locale={locale} imageOverride={imageOverrides[risoul.id]} topRated={topRated?.has(risoul.id)} />
          </div>
        </div>

        {/* Séparateur vertical */}
        <div className="hidden md:block w-px bg-white/10 flex-shrink-0 my-6" />
        <div className="md:hidden h-px bg-white/10 mx-6" />

        {/* ─── CÔTÉ DROIT : Avignon ─── */}
        <div
          className="relative flex-1 py-10 px-6 md:px-10"
          style={{
            backgroundImage: "url('/images/bg-avignon.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 55%',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(14,7,2,.68)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-1 h-10 bg-[#C8763A] rounded-full flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.28em] text-[#C8763A] mb-0.5">Vaucluse</p>
                <h2 className="font-serif text-[20px] font-normal text-white leading-tight">Avignon</h2>
                <p className="text-[11px] text-white/45 mt-0.5">{t('avignon_area_sub')}</p>
              </div>
            </div>
            <PropertyCard property={avignon} locale={locale} imageOverride={imageOverrides[avignon.id]} topRated={topRated?.has(avignon.id)} />
          </div>
        </div>

      </div>

      {/* ─── SECTION LUBERON — fond château de Lauris ─── */}
      <section
        id="luberon"
        className="relative py-14"
        style={{
          backgroundImage: "url('/images/bg-lauris-mid.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(5,3,1,.64)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 130% 100% at 50% 50%, transparent 40%, rgba(0,0,0,.45) 100%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-10 bg-[#C8763A] rounded-full flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[.28em] text-[#C8763A] mb-0.5">Luberon · Vaucluse</p>
              <h2 className="font-serif text-[20px] font-normal text-white leading-tight">{t('luberon_title')}</h2>
              <p className="text-[11px] text-white/45 mt-0.5">{t('luberon_area_sub')}</p>
            </div>
            <div className="flex-1 h-px bg-white/10 ml-2 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {luberon.map((p) => (
              <PropertyCard key={p.id} property={p} locale={locale} imageOverride={imageOverrides[p.id]} topRated={topRated?.has(p.id)} />
            ))}
          </div>

          {/* ── BLOC GRAND GROUPE ── */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-[#C8763A]/25">
            {/* En-tête coloré */}
            <div className="bg-gradient-to-r from-[#2C2416] to-[#4A3828] px-6 py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏘️</span>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {tCombine('large_group_title')}
                  </h3>
                  <p className="text-white/60 text-sm mt-0.5">
                    {tCombine('large_group_sub', { n: 20 })}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/contact?combine=true`}
                className="flex-shrink-0 bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {tCombine('book_request')} →
              </Link>
            </div>

            {/* Corps — 3 combinaisons possibles */}
            <div className="bg-white/85 backdrop-blur-sm px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9B8A74] mb-4">
                {tCombine('combinations')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Combinaison 1 : Mémé + Atelier */}
                <div className="border border-[#E8DCC8] rounded-xl p-4 bg-[#FAF7F2] hover:border-[#C8763A]/40 transition-colors">
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">Mémé</span>
                    <span className="text-[#9B8A74] text-xs">+</span>
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">L'Atelier</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-[#2C2416]">12</span>
                    <span className="text-sm text-[#9B8A74] mb-0.5">{tCombine('persons_max')}</span>
                  </div>
                  <div className="text-xs text-[#9B8A74] mt-1">{tCombine('travelers_rooms', { guests: '8 + 4', rooms: 6 })}</div>
                </div>

                {/* Combinaison 2 : Mémé + Alain */}
                <div className="border border-[#E8DCC8] rounded-xl p-4 bg-[#FAF7F2] hover:border-[#C8763A]/40 transition-colors">
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">Mémé</span>
                    <span className="text-[#9B8A74] text-xs">+</span>
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">Maison d'Alain</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-[#2C2416]">16</span>
                    <span className="text-sm text-[#9B8A74] mb-0.5">{tCombine('persons_max')}</span>
                  </div>
                  <div className="text-xs text-[#9B8A74] mt-1">{tCombine('travelers_rooms', { guests: '8 + 8', rooms: 8 })}</div>
                </div>

                {/* Combinaison 3 : Les 3 */}
                <div className="border-2 border-[#C8763A]/50 rounded-xl p-4 bg-[#C8763A]/5 relative">
                  <div className="absolute -top-2.5 left-4">
                    <span className="bg-[#C8763A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Max
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">Mémé</span>
                    <span className="text-[#9B8A74] text-xs">+</span>
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">Atelier</span>
                    <span className="text-[#9B8A74] text-xs">+</span>
                    <span className="text-xs font-bold bg-[#6B7C45]/10 text-[#6B7C45] px-2 py-0.5 rounded-full">Alain</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-[#C8763A]">20</span>
                    <span className="text-sm text-[#9B8A74] mb-0.5">{tCombine('persons_max')}</span>
                  </div>
                  <div className="text-xs text-[#9B8A74] mt-1">{tCombine('travelers_rooms', { guests: '8 + 4 + 8', rooms: 10 })}</div>
                </div>
              </div>

              <p className="text-xs text-[#9B8A74] mt-4 flex items-start gap-1.5">
                <span>ℹ️</span>
                {tCombine('availability_note')}
              </p>
            </div>
          </div>

          {/* Découvrir Lauris */}
          <div className="rounded-2xl p-6 md:p-8 backdrop-blur-sm"
            style={{ background: 'rgba(255,250,242,.07)', border: '1px solid rgba(200,118,58,.18)' }}>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.28em] text-[#C8763A] mb-2">{tLauris('discover_title')}</p>
              <p className="text-white/58 mb-5 leading-relaxed text-[14px]">{tLauris('discover_text')}</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://frenchmoments.eu/lauris/?utm_source=Pinterest&utm_medium=organic" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/18 text-white/70 px-4 py-2 rounded-lg hover:border-[#6B7C45] hover:text-[#6B7C45] transition-colors text-sm font-medium">
                  {tLauris('link1_label')}
                </a>
                <a href="https://www.j-aime-le-vaucluse.com/lauris#gsc.tab=0" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/18 text-white/70 px-4 py-2 rounded-lg hover:border-[#C8763A] hover:text-[#C8763A] transition-colors text-sm font-medium">
                  {tLauris('link2_label')}
                </a>
                <a href="https://www.destinationluberon.com/decouvrir/villes-et-villages/lauris" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/18 text-white/70 px-4 py-2 rounded-lg hover:border-white/50 hover:text-white transition-colors text-sm font-medium">
                  {tLauris('link3_label')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
