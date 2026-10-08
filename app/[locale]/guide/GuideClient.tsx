'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Season = 'all' | 'winter' | 'spring' | 'summer' | 'autumn';

interface GuideLink {
  label: string;
  desc: string;
  url: string;
  seasons: Season[];
  tags?: string[];
}

interface GuideSection {
  title: string;
  links: GuideLink[];
}

interface Destination {
  id: string;
  name: string;
  sub: string;
  image: string;
  photoPosition: string;
  caption: string;
  sections: GuideSection[];
}

type SeasonItem = { id: Season; label: string; color: string };

const ALL_SEASONS: Season[] = ['winter', 'spring', 'summer', 'autumn'];

const SEASON_COLOR: Record<Season, string> = {
  all: '#6B7C45', winter: '#5B8DB8', spring: '#B87D9A', summer: '#C8763A', autumn: '#A0622A',
};

function SeasonIcon({ id, className }: { id: Season; className?: string }) {
  const cls = className ?? 'w-3.5 h-3.5';
  if (id === 'all') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 7V3m8 4V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM3 10h18" />
    </svg>
  );
  if (id === 'winter') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    </svg>
  );
  if (id === 'spring') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 22V13M12 13C12 8 8 5 3 4M12 13C12 8 16 5 21 4" />
    </svg>
  );
  if (id === 'summer') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
      <path strokeLinecap="round" strokeWidth={1.8}
        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 004.7 21C8 21 12 19 15 16c2-2 3-4.5 2-8zM9 15l5-5" />
    </svg>
  );
}

function LinkCard({ link, activeSeason, seasons }: {
  link: GuideLink;
  activeSeason: Season;
  seasons: SeasonItem[];
}) {
  const isAllYear = link.seasons.length === 4 && ALL_SEASONS.every((s) => link.seasons.includes(s));
  const badgeSeasons: Season[] = activeSeason === 'all'
    ? (isAllYear ? ['all'] : link.seasons)
    : (isAllYear ? ['all'] : [activeSeason]);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 bg-white border border-[#E8DCC8] rounded-2xl p-4 hover:border-[#C8763A]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-[#2C2416] text-sm leading-snug group-hover:text-[#C8763A] transition-colors">
          {link.label}
        </span>
        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#C8763A] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
      <p className="text-xs text-[#9B8A74] leading-relaxed">{link.desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {badgeSeasons.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${SEASON_COLOR[s]}18`, color: SEASON_COLOR[s] }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-80" style={{ backgroundColor: SEASON_COLOR[s] }} />
            {seasons.find((x) => x.id === s)?.label}
          </span>
        ))}
        {link.tags?.map((tag) => (
          <span key={tag} className="text-[10px] text-[#9B8A74] bg-[#FAF7F2] border border-[#E8DCC8] px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

export default function GuideClient() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('guide');
  const [activeDestination, setActiveDestination] = useState<string>('risoul');
  const [activeSeason, setActiveSeason] = useState<Season>('all');

  const SEASONS: SeasonItem[] = [
    { id: 'all',    label: t('season_all'),    color: '#6B7C45' },
    { id: 'winter', label: t('season_winter'), color: '#5B8DB8' },
    { id: 'spring', label: t('season_spring'), color: '#B87D9A' },
    { id: 'summer', label: t('season_summer'), color: '#C8763A' },
    { id: 'autumn', label: t('season_autumn'), color: '#A0622A' },
  ];

  const destinations: Destination[] = [
    {
      id: 'risoul',
      name: 'Risoul 1850',
      sub: t('risoul_sub'),
      image: '/images/bg-risoul-mountain.jpg',
      photoPosition: '50% 38%',
      caption: t('risoul_caption'),
      sections: [
        {
          title: t('risoul_s1_title'),
          links: [
            { label: t('risoul_s1_l1_label'), desc: t('risoul_s1_l1_desc'), url: 'https://www.risoul.com', seasons: ['winter'], tags: ['Ski'] },
            { label: t('risoul_s1_l2_label'), desc: t('risoul_s1_l2_desc'), url: 'https://www.foretblanche.com', seasons: ['winter'], tags: ['Ski'] },
            { label: t('risoul_s1_l3_label'), desc: t('risoul_s1_l3_desc'), url: 'https://www.esf-risoul.com', seasons: ['winter'], tags: ['Ski'] },
            { label: t('risoul_s1_l4_label'), desc: t('risoul_s1_l4_desc'), url: 'https://meteofrance.com/meteo-montagne/risoul/051191', seasons: ['winter'] },
          ],
        },
        {
          title: t('risoul_s2_title'),
          links: [
            { label: t('risoul_s2_l1_label'), desc: t('risoul_s2_l1_desc'), url: 'https://www.risoul.com/ete/', seasons: ['summer', 'spring'], tags: ['MTB'] },
            { label: t('risoul_s2_l2_label'), desc: t('risoul_s2_l2_desc'), url: 'https://www.serreponcon.com/la-montagne/les-incontournables-montagne/les-demoiselles-coiffees/', seasons: ['summer'] },
            { label: t('risoul_s2_l3_label'), desc: t('risoul_s2_l3_desc'), url: 'https://www.serreponcon.com/', seasons: ['summer'] },
            { label: t('risoul_s2_l4_label'), desc: t('risoul_s2_l4_desc'), url: 'https://www.hautes-alpes.net', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('risoul_s3_title'),
          links: [
            { label: t('risoul_s3_l1_label'), desc: t('risoul_s3_l1_desc'), url: 'http://www.marmotteygliers.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('risoul_s3_l2_label'), desc: t('risoul_s3_l2_desc'), url: 'https://www.montdauphin-vauban.fr/fr', seasons: ALL_SEASONS, tags: ['UNESCO'] },
            { label: t('risoul_s3_l3_label'), desc: t('risoul_s3_l3_desc'), url: 'https://tourisme-embrun.com/', seasons: ALL_SEASONS },
            { label: t('risoul_s3_l4_label'), desc: t('risoul_s3_l4_desc'), url: 'https://www.terresdegap.fr/', seasons: ALL_SEASONS },
          ],
        },
      ],
    },
    {
      id: 'avignon',
      name: 'Avignon',
      sub: t('avignon_sub'),
      image: '/images/bg-palais.jpg',
      photoPosition: '50% 22%',
      caption: t('avignon_caption'),
      sections: [
        {
          title: t('avignon_s1_title'),
          links: [
            { label: t('avignon_s1_l1_label'), desc: t('avignon_s1_l1_desc'), url: 'https://www.palais-des-papes.com', seasons: ALL_SEASONS },
            { label: t('avignon_s1_l2_label'), desc: t('avignon_s1_l2_desc'), url: 'https://www.avignon-pont.com', seasons: ALL_SEASONS },
            { label: t('avignon_s1_l3_label'), desc: t('avignon_s1_l3_desc'), url: 'https://www.avignon-tourisme.com', seasons: ALL_SEASONS },
            { label: t('avignon_s1_l4_label'), desc: t('avignon_s1_l4_desc'), url: 'https://www.festival-avignon.com', seasons: ['summer'], tags: ['Festival'] },
          ],
        },
        {
          title: t('avignon_s2_title'),
          links: [
            { label: t('avignon_s2_l1_label'), desc: t('avignon_s2_l1_desc'), url: 'https://www.lesbauxdeprovence.com/', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('avignon_s2_l2_label'), desc: t('avignon_s2_l2_desc'), url: 'https://www.pontdugard.fr', seasons: ALL_SEASONS, tags: ['UNESCO'] },
            { label: t('avignon_s2_l3_label'), desc: t('avignon_s2_l3_desc'), url: 'https://www.gordes-village.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('avignon_s2_l4_label'), desc: t('avignon_s2_l4_desc'), url: 'https://islesurlasorguetourisme.com/', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('avignon_s3_title'),
          links: [
            { label: t('avignon_s3_l1_label'), desc: t('avignon_s3_l1_desc'), url: 'https://www.avignon-tourisme.com', seasons: ALL_SEASONS },
            { label: t('avignon_s3_l2_label'), desc: t('avignon_s3_l2_desc'), url: 'https://www.vins-rhone.com', seasons: ALL_SEASONS },
          ],
        },
      ],
    },
    {
      id: 'luberon',
      name: 'Lauris · Luberon',
      sub: t('luberon_sub'),
      image: '/images/bg-lauris-panorama.jpg',
      photoPosition: '50% 35%',
      caption: t('luberon_caption'),
      sections: [
        {
          title: t('luberon_s1_title'),
          links: [
            { label: t('luberon_s1_l1_label'), desc: t('luberon_s1_l1_desc'), url: 'https://www.lourmarin.com', seasons: ALL_SEASONS },
            { label: t('luberon_s1_l2_label'), desc: t('luberon_s1_l2_desc'), url: 'https://www.gordes-village.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s1_l3_label'), desc: t('luberon_s1_l3_desc'), url: 'https://www.roussillon-provence.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s1_l4_label'), desc: t('luberon_s1_l4_desc'), url: 'https://www.destinationluberon.com', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('luberon_s2_title'),
          links: [
            { label: t('luberon_s2_l1_label'), desc: t('luberon_s2_l1_desc'), url: 'https://www.parcduluberon.fr', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s2_l2_label'), desc: t('luberon_s2_l2_desc'), url: 'https://www.randoxygene.org', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s2_l3_label'), desc: t('luberon_s2_l3_desc'), url: 'https://www.veloloisirprovence.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s2_l4_label'), desc: t('luberon_s2_l4_desc'), url: 'https://www.cheval-luberon.fr/', seasons: ['spring', 'summer', 'autumn'] },
          ],
        },
        {
          title: t('luberon_s3_title'),
          links: [
            { label: t('luberon_s3_l1_label'), desc: t('luberon_s3_l1_desc'), url: 'https://lourmarin.com/marches/', seasons: ALL_SEASONS },
            { label: t('luberon_s3_l2_label'), desc: t('luberon_s3_l2_desc'), url: 'https://www.ville-pertuis.fr', seasons: ALL_SEASONS },
            { label: t('luberon_s3_l3_label'), desc: t('luberon_s3_l3_desc'), url: 'https://www.routes-lavande.com', seasons: ['summer'] },
            { label: t('luberon_s3_l4_label'), desc: t('luberon_s3_l4_desc'), url: 'https://www.vins-luberon.fr/fr/', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('luberon_s4_title'),
          links: [
            { label: t('luberon_s4_l1_label'), desc: t('luberon_s4_l1_desc'), url: 'https://www.festivalpierrecardin.com/', seasons: ['summer'], tags: ['Festival'] },
            { label: t('luberon_s4_l2_label'), desc: t('luberon_s4_l2_desc'), url: 'https://www.luberon-apt.fr/', seasons: ALL_SEASONS },
            { label: t('luberon_s4_l3_label'), desc: t('luberon_s4_l3_desc'), url: 'https://www.destinationluberon.com/agenda', seasons: ALL_SEASONS },
          ],
        },
      ],
    },
  ];

  const dest = destinations.find((d) => d.id === activeDestination)!;

  const filteredSections = dest.sections.map((section) => ({
    ...section,
    links: activeSeason === 'all'
      ? section.links
      : section.links.filter((l) => l.seasons.includes(activeSeason)),
  })).filter((s) => s.links.length > 0);

  const totalLinks = filteredSections.reduce((n, s) => n + s.links.length, 0);
  const activeSeasonItem = SEASONS.find((s) => s.id === activeSeason);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ─── ONGLETS DESTINATION ─── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {destinations.map((d) => (
            <button
              key={d.id}
              onClick={() => { setActiveDestination(d.id); setActiveSeason('all'); }}
              className={`px-5 py-2 rounded-xl font-medium text-sm transition-all border ${
                activeDestination === d.id
                  ? 'bg-[#2C2416] text-white border-[#2C2416] shadow-md'
                  : 'bg-white text-[#5C4F3A] border-[#E8DCC8] hover:border-[#C8763A]/40 hover:text-[#2C2416]'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* ─── PHOTO DESTINATION ─── */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-52 md:h-72 shadow-sm">
          <Image
            src={dest.image}
            alt={dest.caption}
            fill
            className="object-cover"
            style={{ objectPosition: dest.photoPosition }}
            sizes="(max-width: 768px) 100vw, 1152px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0702]/82 via-[#0C0702]/18 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[.28em] text-[#C8763A] mb-2">{dest.name}</p>
            <p className="font-serif text-[22px] font-normal leading-tight mb-1">{dest.caption}</p>
            <p className="text-[12px] text-white/52">{dest.sub}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C8763A] via-[#C8763A]/60 to-transparent" />
        </div>

        {/* ─── FILTRE SAISON ─── */}
        <div className="flex flex-wrap gap-1.5 mb-8 p-1.5 bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl w-fit">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSeason === s.id ? 'text-white shadow-sm' : 'text-[#5C4F3A] hover:bg-white hover:shadow-sm'
              }`}
              style={activeSeason === s.id ? { backgroundColor: s.color } : {}}
            >
              <SeasonIcon id={s.id} className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* ─── RÉSUMÉ ─── */}
        {activeSeason !== 'all' && (
          <p className="text-xs text-[#9B8A74] mb-6">
            {totalLinks === 1 ? t('activities_one', { n: totalLinks }) : t('activities_other', { n: totalLinks })}
            {' · '}
            <span style={{ color: activeSeasonItem?.color }}>{activeSeasonItem?.label}</span>
            {' · '}
            {dest.name}
          </p>
        )}

        {/* ─── SECTIONS ─── */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 text-[#9B8A74]">
            <div className="flex justify-center mb-3">
              <SeasonIcon id={activeSeason} className="w-10 h-10 text-[#D8CFC4]" />
            </div>
            <p className="font-medium text-[#5C4F3A]">{t('no_activities')}</p>
            <button onClick={() => setActiveSeason('all')} className="mt-3 text-sm text-[#C8763A] hover:underline">
              {t('show_all_seasons')}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-0.5 h-5 rounded-full bg-[#C8763A]" />
                  <h3 className="font-serif font-normal text-[#2C2416] text-base">
                    {section.title}
                    <span className="text-xs font-normal text-[#9B8A74] ml-2 font-sans">({section.links.length})</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.links.map((link) => (
                    <LinkCard key={link.url} link={link} activeSeason={activeSeason} seasons={SEASONS} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── BLOC SUGGESTION ─── */}
        <div className="mt-12 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2C2416 0%, #1A1209 100%)', border: '1px solid rgba(200,118,58,0.20)' }}>
          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#C8763A] mb-2">{t('suggest_title')}</p>
              <p className="text-sm text-white/60 leading-relaxed">{t('suggest_text')}</p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="flex-shrink-0 bg-[#C8763A] hover:bg-[#A85E28] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              {t('suggest_cta')}
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
