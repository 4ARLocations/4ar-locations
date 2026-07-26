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
  emoji: string;
  links: GuideLink[];
}

interface Destination {
  id: string;
  name: string;
  sub: string;
  emoji: string;
  image: string;
  caption: string;
  sections: GuideSection[];
}

type SeasonItem = { id: Season; label: string; emoji: string; color: string };

const ALL_SEASONS: Season[] = ['winter', 'spring', 'summer', 'autumn'];

const SEASON_COLOR: Record<Season, string> = {
  all: '#6B7C45', winter: '#5B8DB8', spring: '#B87D9A', summer: '#C8763A', autumn: '#A0622A',
};
const SEASON_EMOJI: Record<Season, string> = {
  all: '📅', winter: '❄️', spring: '🌸', summer: '☀️', autumn: '🍂',
};

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
      className="group flex flex-col gap-2 bg-white border border-[#E8DCC8] rounded-2xl p-4 hover:border-[#C8763A]/50 hover:shadow-md transition-all"
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
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${SEASON_COLOR[s]}18`, color: SEASON_COLOR[s] }}
          >
            {SEASON_EMOJI[s]} {seasons.find((x) => x.id === s)?.label}
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
    { id: 'all',    label: t('season_all'),    emoji: '📅', color: '#6B7C45' },
    { id: 'winter', label: t('season_winter'), emoji: '❄️', color: '#5B8DB8' },
    { id: 'spring', label: t('season_spring'), emoji: '🌸', color: '#B87D9A' },
    { id: 'summer', label: t('season_summer'), emoji: '☀️', color: '#C8763A' },
    { id: 'autumn', label: t('season_autumn'), emoji: '🍂', color: '#A0622A' },
  ];

  const destinations: Destination[] = [
    {
      id: 'risoul',
      name: 'Risoul 1850',
      sub: t('risoul_sub'),
      emoji: '⛷',
      image: '/images/bg-risoul-mountain.jpg',
      caption: t('risoul_caption'),
      sections: [
        {
          title: t('risoul_s1_title'),
          emoji: '🎿',
          links: [
            { label: t('risoul_s1_l1_label'), desc: t('risoul_s1_l1_desc'), url: 'https://www.risoul.com', seasons: ['winter'], tags: ['Ski'] },
            { label: t('risoul_s1_l2_label'), desc: t('risoul_s1_l2_desc'), url: 'https://www.foretblanche.com', seasons: ['winter'], tags: ['Ski'] },
            { label: t('risoul_s1_l3_label'), desc: t('risoul_s1_l3_desc'), url: 'https://www.esf-risoul.com', seasons: ['winter'], tags: ['Ski'] },
            { label: t('risoul_s1_l4_label'), desc: t('risoul_s1_l4_desc'), url: 'https://meteofrance.com/meteo-montagne/risoul/051191', seasons: ['winter'] },
          ],
        },
        {
          title: t('risoul_s2_title'),
          emoji: '🏔️',
          links: [
            { label: t('risoul_s2_l1_label'), desc: t('risoul_s2_l1_desc'), url: 'https://www.risoul.com/ete/', seasons: ['summer', 'spring'], tags: ['MTB'] },
            { label: t('risoul_s2_l2_label'), desc: t('risoul_s2_l2_desc'), url: 'https://www.serreponcon.com/la-montagne/les-incontournables-montagne/les-demoiselles-coiffees/', seasons: ['summer'] },
            { label: t('risoul_s2_l3_label'), desc: t('risoul_s2_l3_desc'), url: 'https://www.serreponcon.com/', seasons: ['summer'] },
            { label: t('risoul_s2_l4_label'), desc: t('risoul_s2_l4_desc'), url: 'https://www.hautes-alpes.net', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('risoul_s3_title'),
          emoji: '🏛️',
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
      emoji: '🏛️',
      image: '/images/bg-palais.jpg',
      caption: t('avignon_caption'),
      sections: [
        {
          title: t('avignon_s1_title'),
          emoji: '🎭',
          links: [
            { label: t('avignon_s1_l1_label'), desc: t('avignon_s1_l1_desc'), url: 'https://www.palais-des-papes.com', seasons: ALL_SEASONS },
            { label: t('avignon_s1_l2_label'), desc: t('avignon_s1_l2_desc'), url: 'https://www.avignon-pont.com', seasons: ALL_SEASONS },
            { label: t('avignon_s1_l3_label'), desc: t('avignon_s1_l3_desc'), url: 'https://www.avignon-tourisme.com', seasons: ALL_SEASONS },
            { label: t('avignon_s1_l4_label'), desc: t('avignon_s1_l4_desc'), url: 'https://www.festival-avignon.com', seasons: ['summer'], tags: ['Festival'] },
          ],
        },
        {
          title: t('avignon_s2_title'),
          emoji: '🌻',
          links: [
            { label: t('avignon_s2_l1_label'), desc: t('avignon_s2_l1_desc'), url: 'https://www.lesbauxdeprovence.com/', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('avignon_s2_l2_label'), desc: t('avignon_s2_l2_desc'), url: 'https://www.pontdugard.fr', seasons: ALL_SEASONS, tags: ['UNESCO'] },
            { label: t('avignon_s2_l3_label'), desc: t('avignon_s2_l3_desc'), url: 'https://www.gordes-village.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('avignon_s2_l4_label'), desc: t('avignon_s2_l4_desc'), url: 'https://islesurlasorguetourisme.com/', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('avignon_s3_title'),
          emoji: '🍷',
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
      emoji: '🌿',
      image: '/images/bg-lauris-panorama.jpg',
      caption: t('luberon_caption'),
      sections: [
        {
          title: t('luberon_s1_title'),
          emoji: '🏡',
          links: [
            { label: t('luberon_s1_l1_label'), desc: t('luberon_s1_l1_desc'), url: 'https://www.lourmarin.com', seasons: ALL_SEASONS },
            { label: t('luberon_s1_l2_label'), desc: t('luberon_s1_l2_desc'), url: 'https://www.gordes-village.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s1_l3_label'), desc: t('luberon_s1_l3_desc'), url: 'https://www.roussillon-provence.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s1_l4_label'), desc: t('luberon_s1_l4_desc'), url: 'https://www.destinationluberon.com', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('luberon_s2_title'),
          emoji: '🥾',
          links: [
            { label: t('luberon_s2_l1_label'), desc: t('luberon_s2_l1_desc'), url: 'https://www.parcduluberon.fr', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s2_l2_label'), desc: t('luberon_s2_l2_desc'), url: 'https://www.randoxygene.org', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s2_l3_label'), desc: t('luberon_s2_l3_desc'), url: 'https://www.veloloisirprovence.com', seasons: ['spring', 'summer', 'autumn'] },
            { label: t('luberon_s2_l4_label'), desc: t('luberon_s2_l4_desc'), url: 'https://www.cheval-luberon.fr/', seasons: ['spring', 'summer', 'autumn'] },
          ],
        },
        {
          title: t('luberon_s3_title'),
          emoji: '🧄',
          links: [
            { label: t('luberon_s3_l1_label'), desc: t('luberon_s3_l1_desc'), url: 'https://lourmarin.com/marches/', seasons: ALL_SEASONS },
            { label: t('luberon_s3_l2_label'), desc: t('luberon_s3_l2_desc'), url: 'https://www.ville-pertuis.fr', seasons: ALL_SEASONS },
            { label: t('luberon_s3_l3_label'), desc: t('luberon_s3_l3_desc'), url: 'https://www.routes-lavande.com', seasons: ['summer'] },
            { label: t('luberon_s3_l4_label'), desc: t('luberon_s3_l4_desc'), url: 'https://www.vins-luberon.fr/fr/', seasons: ALL_SEASONS },
          ],
        },
        {
          title: t('luberon_s4_title'),
          emoji: '🎪',
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
      {/* ─── EN-TÊTE ─── */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8763A] mb-2">{t('eyebrow')}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">{t('title')}</h1>
          <p className="text-[#5C4F3A] text-lg max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ─── ONGLETS DESTINATION ─── */}
        <div className="flex flex-wrap gap-3 mb-8">
          {destinations.map((d) => (
            <button
              key={d.id}
              onClick={() => { setActiveDestination(d.id); setActiveSeason('all'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                activeDestination === d.id
                  ? 'bg-[#2C2416] text-white border-[#2C2416] shadow-md'
                  : 'bg-white text-[#5C4F3A] border-[#E8DCC8] hover:border-[#C8763A]/40'
              }`}
            >
              <span>{d.emoji}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        {/* ─── PHOTO DESTINATION ─── */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-52 md:h-72 shadow-sm">
          <Image
            src={dest.image}
            alt={dest.caption}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1152px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{dest.emoji}</span>
              <h2 className="text-xl font-bold">{dest.name}</h2>
            </div>
            <p className="text-sm text-white/70">{dest.sub}</p>
          </div>
        </div>

        {/* ─── FILTRE SAISON ─── */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white border border-[#E8DCC8] rounded-2xl w-fit">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSeason === s.id ? 'text-white shadow-sm' : 'text-[#5C4F3A] hover:bg-[#FAF7F2]'
              }`}
              style={activeSeason === s.id ? { backgroundColor: s.color } : {}}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* ─── RÉSUMÉ ─── */}
        {activeSeason !== 'all' && (
          <p className="text-xs text-[#9B8A74] mb-6">
            {totalLinks === 1 ? t('activities_one', { n: totalLinks }) : t('activities_other', { n: totalLinks })} {activeSeasonItem?.emoji} {activeSeasonItem?.label.toLowerCase()} — {dest.name}
          </p>
        )}

        {/* ─── SECTIONS ─── */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 text-[#9B8A74]">
            <p className="text-4xl mb-3">🌿</p>
            <p className="font-medium text-[#5C4F3A]">{t('no_activities')}</p>
            <button onClick={() => setActiveSeason('all')} className="mt-3 text-sm text-[#C8763A] hover:underline">
              {t('show_all_seasons')}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <h3 className="flex items-center gap-2 text-base font-bold text-[#2C2416] mb-4">
                  <span>{section.emoji}</span>
                  {section.title}
                  <span className="text-xs font-normal text-[#9B8A74] ml-1">({section.links.length})</span>
                </h3>
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
        <div className="mt-12 bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-3xl">💬</span>
          <div className="flex-1">
            <p className="font-semibold text-[#2C2416] text-sm">{t('suggest_title')}</p>
            <p className="text-xs text-[#9B8A74] mt-0.5">{t('suggest_text')}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="flex-shrink-0 bg-[#C8763A] hover:bg-[#A85E28] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {t('suggest_cta')}
          </Link>
        </div>

      </div>
    </>
  );
}
