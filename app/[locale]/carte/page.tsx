import Image from 'next/image';
import Link from 'next/link';
import PropertiesMapClient from '@/components/PropertiesMapClient';

const destinations = [
  {
    id: 'risoul',
    emoji: '⛷',
    name: 'Risoul 1850',
    region: 'Hautes-Alpes',
    address: 'Résidence Altaïr · Risoul 1850 · 05600 Risoul',
    image: '/images/bg-risoul-mountain.jpg',
    desc: 'Station de ski dans les Alpes du Sud, à 1 850 m d\'altitude. Idéale pour les séjours en famille ou entre amis, hiver comme été.',
    highlights: ['Domaine Espace Lumière (Risoul + Vars)', '185 pistes de ski', 'Lac de Serre-Ponçon à 30 min', 'Embrun — ville médiévale'],
    color: '#1A5276',
    href: '/fr/biens/risoul',
    count: '1 appartement',
  },
  {
    id: 'avignon',
    emoji: '🏛️',
    name: 'Avignon',
    region: 'Vaucluse',
    address: 'Rue Joyeuse · 84000 Avignon (intramuros)',
    image: '/images/bg-palais.jpg',
    desc: 'Au cœur des remparts, à deux pas du Palais des Papes. Un studio rénové dans l\'une des plus belles villes d\'art de Provence.',
    highlights: ['Palais des Papes à 5 min à pied', 'Festival d\'Avignon (juillet)', 'Pont du Gard à 30 min', 'Pont Saint-Bénézet'],
    color: '#C8763A',
    href: '/fr/biens/avignon',
    count: '1 studio',
  },
  {
    id: 'luberon',
    emoji: '🌿',
    name: 'Lauris · Luberon',
    region: 'Vaucluse',
    address: 'Rue Sainte-Marguerite · 84360 Lauris',
    image: '/images/bg-lauris-panorama.jpg',
    desc: 'Village perché du Luberon à 5 km de Lourmarin. Trois maisons de caractère combinables pour des séjours en famille ou en grand groupe.',
    highlights: ['Lourmarin à 5 km', 'Marchés provençaux', 'Randonnées Parc du Luberon', 'Gordes, Roussillon, les Baux'],
    color: '#6B7C45',
    href: '/fr/biens#luberon',
    count: '3 maisons',
  },
];

export default function CartePage() {
  return (
    <>
      {/* ─── EN-TÊTE ─── */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8763A] mb-2">Provence & Alpes</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">Nos destinations</h1>
          <p className="text-[#5C4F3A] text-lg max-w-2xl">
            5 logements répartis sur 3 destinations d'exception dans le sud de la France.
            Cliquez sur un marqueur pour accéder directement au logement.
          </p>
        </div>
      </div>

      {/* ─── CARTE ─── */}
      <div className="bg-white border-b border-[#E8DCC8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <PropertiesMapClient />
        </div>
      </div>

      {/* ─── FICHES DESTINATIONS ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-[#2C2416] mb-8">Découvrir chaque destination</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <div key={d.id} className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {/* Photo */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2416]/60 via-transparent to-transparent" />
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
              </div>

              {/* Contenu */}
              <div className="p-5">
                <p className="text-[#9B8A74] text-xs flex items-center gap-1 mb-3">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {d.address}
                </p>
                <p className="text-[#5C4F3A] text-sm leading-relaxed mb-4">{d.desc}</p>

                {/* Points forts */}
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
                    Voir les logements
                  </Link>
                  <Link
                    href="/fr/guide"
                    className="flex-1 text-center border border-[#E8DCC8] hover:border-[#C8763A]/40 text-[#5C4F3A] text-xs font-medium py-2.5 rounded-xl transition-colors"
                  >
                    Guide de voyage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
