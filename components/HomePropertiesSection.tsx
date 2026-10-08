'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Property } from '@/lib/properties';
import PropertyCard from '@/components/PropertyCard';
import SectionReveal from '@/components/SectionReveal';

type Filter = 'all' | 'alpes' | 'luberon' | 'avignon' | 'group';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'Tous les logements' },
  { id: 'alpes',   label: 'Risoul 1850' },
  { id: 'luberon', label: 'Luberon · Lauris' },
  { id: 'avignon', label: 'Avignon' },
  { id: 'group',   label: 'Grand groupe' },
];

export default function HomePropertiesSection({
  properties,
  locale,
  imageOverrides,
}: {
  properties: Property[];
  locale: string;
  imageOverrides: Record<string, string>;
}) {
  const t = useTranslations();
  const [active, setActive] = useState<Filter>('all');
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = properties.filter((p) => {
    if (active === 'all')   return true;
    if (active === 'group') return p.guests >= 6;
    return p.region === active;
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.card-reveal'));
    cards.forEach((el) => el.classList.remove('in-view'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); }
      }),
      { threshold: 0.04, rootMargin: '0px 0px -20px 0px' }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  const [featuredProp, ...restProps] = filtered;

  return (
    <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE5 100%)' }}>
      {/* Lueur chaude subtile depuis le haut */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: '280px', background: 'radial-gradient(ellipse 80% 100% at 50% -20%, rgba(200,118,58,0.05) 0%, transparent 70%)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header avec titre-slide */}
        <SectionReveal className="mb-8">
          <p className="section-tag text-[10px] font-bold uppercase tracking-[0.28em] text-[#C8763A] mb-5">
            {t('home.properties_title')}
          </p>
          <span className="section-line" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-0">
            <div>
              <h2 className="text-[30px] md:text-[42px] font-serif font-normal text-[#2C2416] leading-tight tracking-tight">
                <span className="title-line"><span>Nos maisons en Provence</span></span>
                <span className="title-line"><span>&amp; dans les Alpes</span></span>
              </h2>
              <p className="text-sm text-[#9B8A74] mt-3 leading-relaxed max-w-md">
                {t('properties.subtitle')}
              </p>
            </div>
            <Link href={`/${locale}/biens`}
              className="group/lnk text-sm font-semibold text-[#C8763A] hover:text-[#A85E28] flex items-center gap-1.5 transition-colors whitespace-nowrap self-start sm:self-auto">
              {t('home.see_all_properties')}
              <svg className="w-4 h-4 transition-transform group-hover/lnk:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </SectionReveal>

        {/* Filtres — underline tabs */}
        <div className="flex gap-1 mb-10 border-b border-[#EDE6DC] overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setActive(f.id)}
              className={`relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-200 ${
                active === f.id
                  ? 'text-[#2C2416] font-semibold'
                  : 'text-[#9B8A74] hover:text-[#5C4F3A] font-medium'
              }`}>
              {f.label}
              {active === f.id && <span className="filter-tab-active" />}
            </button>
          ))}
        </div>

        {/* ── Mise en page : featured + grille éditoriale ── */}
        {filtered.length > 0 ? (
          <div ref={gridRef} className="space-y-3 md:space-y-4">

            {/* Carte vedette — photo pleine largeur */}
            <div className="card-reveal">
              <PropertyCard
                property={featuredProp}
                locale={locale}
                imageOverride={imageOverrides[featuredProp.id]}
                featured
              />
            </div>

            {restProps.length > 0 && (
              <>
                {/* Mobile — grille 2 col classique */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                  {restProps.map((p, i) => (
                    <div key={p.id} className="card-reveal"
                      style={{ transitionDelay: `${(i + 1) * 0.09}s` }}>
                      <PropertyCard property={p} locale={locale}
                        imageOverride={imageOverrides[p.id]} compact />
                    </div>
                  ))}
                </div>

                {/* Desktop — grille éditoriale 3 cols × 2 rows */}
                <div
                  className="hidden md:grid grid-cols-3 gap-4"
                  style={{ gridTemplateRows: '290px 290px' }}
                >
                  {/* Haut gauche — grand paysage 2/3 */}
                  <div className="card-reveal col-span-2" style={{ transitionDelay: '0.09s' }}>
                    <PropertyCard property={restProps[0]} locale={locale}
                      imageOverride={imageOverrides[restProps[0].id]} compact fillHeight />
                  </div>
                  {/* Droite — portrait pleine hauteur */}
                  {restProps[1] && (
                    <div className="card-reveal row-span-2" style={{ transitionDelay: '0.18s' }}>
                      <PropertyCard property={restProps[1]} locale={locale}
                        imageOverride={imageOverrides[restProps[1].id]} compact fillHeight />
                    </div>
                  )}
                  {/* Bas gauche */}
                  {restProps[2] && (
                    <div className="card-reveal" style={{ transitionDelay: '0.27s' }}>
                      <PropertyCard property={restProps[2]} locale={locale}
                        imageOverride={imageOverrides[restProps[2].id]} compact fillHeight />
                    </div>
                  )}
                  {/* Bas centre */}
                  {restProps[3] && (
                    <div className="card-reveal" style={{ transitionDelay: '0.36s' }}>
                      <PropertyCard property={restProps[3]} locale={locale}
                        imageOverride={imageOverrides[restProps[3].id]} compact fillHeight />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-center py-16 text-[#9B8A74] text-sm">
            Aucun logement disponible pour ce filtre.
          </p>
        )}
      </div>
    </section>
  );
}
