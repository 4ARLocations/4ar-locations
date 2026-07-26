'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropertiesMapClient from '@/components/PropertiesMapClient';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function CarteClient() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('carte');
  const [focusId, setFocusId] = useState<string | null>(null);

  const destinations = [
    {
      id: 'risoul',
      mapId: 'risoul',
      emoji: '⛷',
      name: 'Risoul 1850',
      region: 'Hautes-Alpes',
      address: 'Résidence Altaïr · Risoul 1850 · 05600 Risoul',
      image: '/images/bg-risoul-mountain.jpg',
      desc: t('risoul_desc'),
      highlights: [t('risoul_h1'), t('risoul_h2'), t('risoul_h3'), t('risoul_h4')],
      color: '#1A5276',
      href: `/${locale}/biens/risoul`,
      count: t('risoul_count'),
    },
    {
      id: 'avignon',
      mapId: 'avignon',
      emoji: '🏛️',
      name: 'Avignon',
      region: 'Vaucluse',
      address: 'Rue Joyeuse · 84000 Avignon (intramuros)',
      image: '/images/bg-palais.jpg',
      desc: t('avignon_desc'),
      highlights: [t('avignon_h1'), t('avignon_h2'), t('avignon_h3'), t('avignon_h4')],
      color: '#C8763A',
      href: `/${locale}/biens/avignon`,
      count: t('avignon_count'),
    },
    {
      id: 'luberon',
      mapId: 'lauris',
      emoji: '🌿',
      name: 'Lauris · Luberon',
      region: 'Vaucluse',
      address: 'Rue Sainte-Marguerite · 84360 Lauris',
      image: '/images/bg-lauris-panorama.jpg',
      desc: t('luberon_desc'),
      highlights: [t('luberon_h1'), t('luberon_h2'), t('luberon_h3'), t('luberon_h4')],
      color: '#6B7C45',
      href: `/${locale}/biens#luberon`,
      count: t('luberon_count'),
    },
  ];

  const focusOnMap = (mapId: string) => {
    setFocusId(mapId);
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ─── EN-TÊTE ─── */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8763A] mb-2">{t('eyebrow')}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">{t('title')}</h1>
          <p className="text-[#5C4F3A] text-lg max-w-2xl">
            {t('subtitle')} {t('click_hint')}
          </p>
        </div>
      </div>

      {/* ─── CARTE ─── */}
      <div id="map-section" className="bg-white border-b border-[#E8DCC8] scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <PropertiesMapClient focusId={focusId} />
        </div>
      </div>

      {/* ─── FICHES DESTINATIONS ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-[#2C2416] mb-8">{t('discover_heading')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((d) => {
            const isActive = focusId === d.mapId;
            return (
              <div
                key={d.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group ${
                  isActive ? 'border-[#C8763A]/50 ring-2 ring-[#C8763A]/20' : 'border-[#E8DCC8]'
                }`}
              >
                <button
                  type="button"
                  className="relative h-44 overflow-hidden w-full text-left block"
                  onClick={() => focusOnMap(d.mapId)}
                  aria-label={t('locate_aria', { name: d.name })}
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/60 via-transparent to-transparent" />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 text-[#2C2416] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                      <svg className="w-3.5 h-3.5 text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t('view_on_map')}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{d.emoji}</span>
                      <div>
                        <p className="font-bold text-base leading-tight">{d.name}</p>
                        <p className="text-xs text-white/70">{d.region}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute top-3 right-3 text-xs font-semibold text-white px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${d.color}cc` }}
                  >
                    {d.count}
                  </div>
                </button>

                <div className="p-5">
                  <p className="text-[#9B8A74] text-xs flex items-center gap-1 mb-3">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {d.address}
                  </p>
                  <p className="text-[#5C4F3A] text-sm leading-relaxed mb-4">{d.desc}</p>

                  <ul className="space-y-1.5 mb-5">
                    {d.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-[#5C4F3A]">
                        <span className="text-[#C8763A] mt-0.5 flex-shrink-0">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <Link
                      href={d.href}
                      className="flex-1 text-center bg-[#2C2416] hover:bg-[#4A3828] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      {t('view_properties')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => focusOnMap(d.mapId)}
                      className={`flex-1 text-center border text-xs font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'border-[#C8763A]/40 text-[#C8763A] bg-[#C8763A]/5'
                          : 'border-[#E8DCC8] hover:border-[#C8763A]/40 text-[#5C4F3A]'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {isActive ? t('on_map_active') : t('locate')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
