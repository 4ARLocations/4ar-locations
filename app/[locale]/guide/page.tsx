'use client';
import { useState } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────
type Season = 'all' | 'winter' | 'spring' | 'summer' | 'autumn';

interface GuideLink {
  label: string;
  desc: string;
  url: string;
  seasons: Season[];
  weather?: 'sun' | 'cloud' | 'snow' | 'any';
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
  color: string;
  bg: string;
  sections: GuideSection[];
}

// ─── Données ─────────────────────────────────────────────────────
const destinations: Destination[] = [
  {
    id: 'risoul',
    name: 'Risoul 1850',
    sub: 'Hautes-Alpes · Station de montagne',
    emoji: '⛷',
    color: '#1A2C3A',
    bg: '/images/bg-risoul-mountain.jpg',
    sections: [
      {
        title: 'Ski & sports d\'hiver',
        emoji: '🎿',
        links: [
          {
            label: 'Risoul — site officiel de la station',
            desc: 'Pistes, remontées, enneigement en temps réel, tarifs forfaits',
            url: 'https://www.risoul.com',
            seasons: ['winter'],
            weather: 'snow',
            tags: ['Ski', 'Officiel'],
          },
          {
            label: 'Espace Lumière — Risoul + Vars',
            desc: 'Le domaine skiable commun : 185 pistes, 80 remontées mécaniques',
            url: 'https://www.espacelumiere.com',
            seasons: ['winter'],
            weather: 'snow',
            tags: ['Domaine', 'Ski'],
          },
          {
            label: 'ESF Risoul — École de Ski Français',
            desc: 'Cours de ski et snowboard pour tous niveaux, enfants et adultes',
            url: 'https://www.esf-risoul.com',
            seasons: ['winter'],
            weather: 'snow',
            tags: ['Cours', 'Enfants'],
          },
          {
            label: 'Météo montagne — Risoul',
            desc: 'Prévisions météo détaillées pour la station, enneigement et vent',
            url: 'https://www.meteo-des-stations.fr/station/risoul-1850/',
            seasons: ['winter'],
            weather: 'any',
            tags: ['Météo'],
          },
        ],
      },
      {
        title: 'Été & plein air',
        emoji: '🏔️',
        links: [
          {
            label: 'VTT & randonnées — Risoul Bike Park',
            desc: 'Pistes VTT, itinéraires de randonnée balisés, bike park ouvert l\'été',
            url: 'https://www.risoul.com/ete/',
            seasons: ['summer', 'spring'],
            weather: 'sun',
            tags: ['VTT', 'Rando'],
          },
          {
            label: 'Via ferrata des Demoiselles Coiffées',
            desc: 'Site d\'escalade et via ferrata spectaculaire près d\'Embrun',
            url: 'https://www.hautes-alpes.net/randonnee/via-ferrata-demoiselles-coiffees/',
            seasons: ['summer'],
            weather: 'sun',
            tags: ['Via ferrata', 'Escalade'],
          },
          {
            label: 'Lac de Serre-Ponçon',
            desc: 'Le plus grand lac artificiel d\'Europe : plages, voile, kayak, baignade',
            url: 'https://www.serre-poncon-tourisme.com',
            seasons: ['summer'],
            weather: 'sun',
            tags: ['Lac', 'Baignade'],
          },
          {
            label: 'Hautes-Alpes Tourisme',
            desc: 'Agenda des événements, activités et découvertes dans les Hautes-Alpes',
            url: 'https://www.hautes-alpes.net',
            seasons: ['all'],
            weather: 'any',
            tags: ['Activités', 'Tourisme'],
          },
        ],
      },
      {
        title: 'Culture & découverte',
        emoji: '🏛️',
        links: [
          {
            label: 'Embrun — ville médiévale',
            desc: 'Cathédrale, vieille ville et balade dans la cité médiévale des Hautes-Alpes',
            url: 'https://www.embrun.fr/tourisme/',
            seasons: ['all'],
            weather: 'any',
            tags: ['Culture', 'Histoire'],
          },
          {
            label: 'Gap — préfecture des Hautes-Alpes',
            desc: 'Musée, marché, commerces et restaurants à 40 min de Risoul',
            url: 'https://www.gap-tourisme.fr',
            seasons: ['all'],
            weather: 'any',
            tags: ['Ville', 'Marché'],
          },
        ],
      },
    ],
  },
  {
    id: 'avignon',
    name: 'Avignon',
    sub: 'Vaucluse · Intramuros',
    emoji: '🏛️',
    color: '#2C1A08',
    bg: '/images/bg-palais.jpg',
    sections: [
      {
        title: 'Incontournables d\'Avignon',
        emoji: '🎭',
        links: [
          {
            label: 'Palais des Papes',
            desc: 'Le plus grand palais gothique du monde — visites guidées et expositions',
            url: 'https://www.palais-des-papes.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Culture', 'Histoire'],
          },
          {
            label: 'Pont Saint-Bénézet (Pont d\'Avignon)',
            desc: 'Le célèbre pont médiéval sur le Rhône — musée et visite',
            url: 'https://www.avignon-pont.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Monument', 'Histoire'],
          },
          {
            label: 'Office de Tourisme d\'Avignon',
            desc: 'Visites guidées, agenda culturel, bons plans et circuits de la ville',
            url: 'https://www.avignon-tourisme.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Tourisme', 'Officiel'],
          },
          {
            label: 'Festival d\'Avignon',
            desc: 'Le plus grand festival de théâtre au monde — chaque année en juillet',
            url: 'https://www.festival-avignon.com',
            seasons: ['summer'],
            weather: 'sun',
            tags: ['Festival', 'Théâtre', 'Juillet'],
          },
        ],
      },
      {
        title: 'Autour d\'Avignon',
        emoji: '🌻',
        links: [
          {
            label: 'Les Baux-de-Provence',
            desc: 'Village des Alpilles, carrières de lumières — à 30 min d\'Avignon',
            url: 'https://www.les-baux-de-provence.com',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Village', 'Alpilles'],
          },
          {
            label: 'Pont du Gard',
            desc: 'Aqueduc romain classé UNESCO — baignade et kayak en été',
            url: 'https://www.pontdugard.fr',
            seasons: ['all'],
            weather: 'any',
            tags: ['UNESCO', 'Romain'],
          },
          {
            label: 'Gordes & le Luberon',
            desc: 'Les plus beaux villages de Provence à moins d\'une heure',
            url: 'https://www.gordes-village.com',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Village', 'Provence'],
          },
          {
            label: 'Isle-sur-la-Sorgue — marché antiques',
            desc: 'Capitale mondiale de l\'antiquité — marché provençal les dimanches',
            url: 'https://www.oti-delasorgue.fr',
            seasons: ['all'],
            weather: 'sun',
            tags: ['Marché', 'Antiques'],
          },
        ],
      },
      {
        title: 'Gastronomie & sorties',
        emoji: '🍷',
        links: [
          {
            label: 'Halles d\'Avignon',
            desc: 'Le marché couvert d\'Avignon — produits locaux, épiceries fines, restauration',
            url: 'https://www.halles-avignon.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Marché', 'Gastronomie'],
          },
          {
            label: 'Vignobles Côtes du Rhône',
            desc: 'Route des vins entre Châteauneuf-du-Pape et les Costières de Nîmes',
            url: 'https://www.vins-rhone.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Vin', 'Dégustation'],
          },
        ],
      },
    ],
  },
  {
    id: 'luberon',
    name: 'Lauris · Luberon',
    sub: 'Vaucluse · Village perché',
    emoji: '🌿',
    color: '#2C2416',
    bg: '/images/bg-lauris-mid.jpg',
    sections: [
      {
        title: 'Villages & balades',
        emoji: '🏡',
        links: [
          {
            label: 'Lourmarin',
            desc: 'Premier village classé "Plus Beaux Villages de France" du Luberon, à 5 km',
            url: 'https://www.lourmarin.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Village', 'Incontournable'],
          },
          {
            label: 'Gordes',
            desc: 'Village perché emblématique du Luberon — vue panoramique exceptionnelle',
            url: 'https://www.gordes-village.com',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Village', 'Vue'],
          },
          {
            label: 'Roussillon — ocres de Provence',
            desc: 'Le sentier des ocres et son village aux façades colorées',
            url: 'https://www.roussillon-provence.com',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Ocres', 'Nature'],
          },
          {
            label: 'Destination Luberon',
            desc: 'L\'office de tourisme du Luberon — agenda, randonnées, villages à visiter',
            url: 'https://www.destinationluberon.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Tourisme', 'Officiel'],
          },
        ],
      },
      {
        title: 'Nature & randonnées',
        emoji: '🥾',
        links: [
          {
            label: 'Parc Naturel Régional du Luberon',
            desc: 'Sentiers balisés, faune, flore et patrimoine du Luberon',
            url: 'https://www.parcduluberon.fr',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Rando', 'Nature', 'Parc'],
          },
          {
            label: 'Randoxygène — itinéraires Vaucluse',
            desc: 'Tous les itinéraires de randonnée pédestre en Vaucluse',
            url: 'https://www.randoxygene.org',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Rando', 'Balisé'],
          },
          {
            label: 'Vélo Loisir en Luberon',
            desc: 'Itinéraires cyclables, location de vélos, circuits VTT dans le Luberon',
            url: 'https://www.veloloisirprovence.com',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Vélo', 'VTT'],
          },
          {
            label: 'Cheval en Luberon',
            desc: 'Balades équestres et randonnées à cheval dans le Luberon',
            url: 'https://www.chevalenluberon.com',
            seasons: ['spring', 'summer', 'autumn'],
            weather: 'sun',
            tags: ['Équitation', 'Nature'],
          },
        ],
      },
      {
        title: 'Marchés & gastronomie',
        emoji: '🧄',
        links: [
          {
            label: 'Marché de Lourmarin — vendredi matin',
            desc: 'Le plus animé du Luberon : fruits, légumes, épices, artisanat local',
            url: 'https://www.lourmarin.com/marche-provencal/',
            seasons: ['all'],
            weather: 'sun',
            tags: ['Marché', 'Vendredi'],
          },
          {
            label: 'Marché de Pertuis — vendredi matin',
            desc: 'Grand marché provençal à 10 min de Lauris',
            url: 'https://www.ville-pertuis.fr',
            seasons: ['all'],
            weather: 'sun',
            tags: ['Marché', 'Vendredi'],
          },
          {
            label: 'Lavande en Provence',
            desc: 'Routes de la lavande, distilleries et champs fleuris (juin–août)',
            url: 'https://www.routes-lavande.com',
            seasons: ['summer'],
            weather: 'sun',
            tags: ['Lavande', 'Juin–Août'],
          },
          {
            label: 'Vins du Luberon — Cave des Vignerons',
            desc: 'Route des vins AOC Luberon, dégustations et domaines à visiter',
            url: 'https://www.vins-luberon.com',
            seasons: ['all'],
            weather: 'any',
            tags: ['Vin', 'Dégustation'],
          },
        ],
      },
      {
        title: 'Événements & culture',
        emoji: '🎪',
        links: [
          {
            label: 'Festival de Lacoste',
            desc: 'Festival de musique et d\'art dans un cadre exceptionnel (juillet)',
            url: 'https://www.festivaldelacoste.com',
            seasons: ['summer'],
            weather: 'sun',
            tags: ['Festival', 'Juillet'],
          },
          {
            label: 'Musée de l\'Aventure Industrielle — Apt',
            desc: 'Musée des ocres et des fruits confits à Apt (ouvert toute l\'année)',
            url: 'https://www.apt.fr/tourisme',
            seasons: ['all'],
            weather: 'any',
            tags: ['Musée', 'Culture'],
          },
          {
            label: 'Agenda Luberon',
            desc: 'Tous les événements, expositions et animations du Luberon',
            url: 'https://www.destinationluberon.com/agenda',
            seasons: ['all'],
            weather: 'any',
            tags: ['Agenda', 'Événements'],
          },
        ],
      },
    ],
  },
];

// ─── Saisons config ───────────────────────────────────────────────
const SEASONS: { id: Season; label: string; emoji: string; color: string }[] = [
  { id: 'all', label: 'Toute l\'année', emoji: '📅', color: '#6B7C45' },
  { id: 'winter', label: 'Hiver', emoji: '❄️', color: '#5B8DB8' },
  { id: 'spring', label: 'Printemps', emoji: '🌸', color: '#B87D9A' },
  { id: 'summer', label: 'Été', emoji: '☀️', color: '#C8763A' },
  { id: 'autumn', label: 'Automne', emoji: '🍂', color: '#A0622A' },
];

// ─── Composant carte de lien ──────────────────────────────────────
function LinkCard({ link }: { link: GuideLink }) {
  const seasonColors: Record<Season, string> = {
    all: '#6B7C45',
    winter: '#5B8DB8',
    spring: '#B87D9A',
    summer: '#C8763A',
    autumn: '#A0622A',
  };
  const seasonEmojis: Record<Season, string> = {
    all: '📅',
    winter: '❄️',
    spring: '🌸',
    summer: '☀️',
    autumn: '🍂',
  };

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
        {link.seasons.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${seasonColors[s]}18`, color: seasonColors[s] }}
          >
            {seasonEmojis[s]} {SEASONS.find((x) => x.id === s)?.label}
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

// ─── Page principale ──────────────────────────────────────────────
export default function GuidePage({ params }: { params: { locale: string } }) {
  const [activeDestination, setActiveDestination] = useState<string>('risoul');
  const [activeSeason, setActiveSeason] = useState<Season>('all');

  const dest = destinations.find((d) => d.id === activeDestination)!;

  // Filtrer les liens selon la saison active
  const filteredSections = dest.sections.map((section) => ({
    ...section,
    links: activeSeason === 'all'
      ? section.links
      : section.links.filter((l) => l.seasons.includes(activeSeason) || l.seasons.includes('all')),
  })).filter((s) => s.links.length > 0);

  return (
    <>
      {/* ─── EN-TÊTE ─── */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8763A] mb-2">Nos destinations</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">Guide de voyage</h1>
          <p className="text-[#5C4F3A] text-lg max-w-2xl">
            À voir, à faire et à vivre autour de nos logements — organisé par saison pour profiter au mieux de chaque destination.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ─── ONGLETS DESTINATION ─── */}
        <div className="flex flex-wrap gap-3 mb-8">
          {destinations.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDestination(d.id)}
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

        {/* ─── FILTRE SAISON ─── */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white border border-[#E8DCC8] rounded-2xl w-fit">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSeason === s.id
                  ? 'text-white shadow-sm'
                  : 'text-[#5C4F3A] hover:bg-[#FAF7F2]'
              }`}
              style={activeSeason === s.id ? { backgroundColor: s.color } : {}}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* ─── EN-TÊTE DESTINATION ─── */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#E8DCC8]">
          <span className="text-3xl">{dest.emoji}</span>
          <div>
            <h2 className="text-xl font-bold text-[#2C2416]">{dest.name}</h2>
            <p className="text-sm text-[#9B8A74]">{dest.sub}</p>
          </div>
          <div className="flex-1 h-px bg-[#E8DCC8] ml-2" />
        </div>

        {/* ─── SECTIONS ─── */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 text-[#9B8A74]">
            <p className="text-4xl mb-3">🌿</p>
            <p className="font-medium text-[#5C4F3A]">Aucune activité répertoriée pour cette saison ici.</p>
            <button onClick={() => setActiveSeason('all')} className="mt-3 text-sm text-[#C8763A] hover:underline">
              Voir toutes les saisons →
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
                    <LinkCard key={link.url} link={link} />
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
            <p className="font-semibold text-[#2C2416] text-sm">Une adresse à recommander ?</p>
            <p className="text-xs text-[#9B8A74] mt-0.5">
              Restaurant, activité, bon plan… partagez vos découvertes avec nous et on les ajoutera au guide !
            </p>
          </div>
          <Link
            href="/fr/contact"
            className="flex-shrink-0 bg-[#C8763A] hover:bg-[#A85E28] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Nous écrire →
          </Link>
        </div>

      </div>
    </>
  );
}
