import { useTranslations } from 'next-intl';
import Image from 'next/image';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/lib/properties';

export default async function BiensPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <BiensContent locale={locale} />;
}

function BiensContent({ locale }: { locale: string }) {
  const t = useTranslations('properties');
  const tLauris = useTranslations('lauris');

  const risoul = properties.find((p) => p.id === 'risoul')!;
  const avignon = properties.find((p) => p.id === 'avignon')!;
  const luberon = properties.filter((p) => p.region === 'luberon');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">{t('title')}</h1>
        <p className="text-[#5C4F3A] text-lg">{t('subtitle')}</p>
      </div>

      {/* ─── BANNIÈRE ALPES ─── */}
      <div className="relative h-52 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <Image
          src="/images/bg-risoul-mountain.jpg"
          alt="Alpes du Sud — Risoul 1850"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1520]/75 via-[#0A1520]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/65 mb-1">Hautes-Alpes</p>
            <h2 className="text-3xl font-bold leading-tight">⛷ Alpes du Sud</h2>
            <p className="text-sm text-white/70 mt-1.5">Risoul 1850 · 1 logement</p>
          </div>
        </div>
      </div>

      {/* Risoul & Avignon côte à côte */}
      <div className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#E8DCC8] shadow-sm">
          {/* Risoul */}
          <div className="p-6 bg-white">
            <PropertyCard property={risoul} locale={locale} />
          </div>

          {/* Séparateur */}
          <div className="block md:hidden h-px bg-[#E8DCC8] mx-6" />

          {/* Avignon */}
          <div className="p-6 bg-white border-t md:border-t-0 md:border-l border-[#E8DCC8]">
            <PropertyCard property={avignon} locale={locale} />
          </div>
        </div>
      </div>

      {/* ─── BANNIÈRE AVIGNON ─── */}
      <div className="relative h-52 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <Image
          src="/images/bg-palais.jpg"
          alt="Avignon — Palais des Papes"
          fill
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A1008]/75 via-[#2A1008]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/65 mb-1">Vaucluse</p>
            <h2 className="text-3xl font-bold leading-tight">🏛 Avignon</h2>
            <p className="text-sm text-white/70 mt-1.5">Cité des Papes · Intramuros · 1 logement</p>
          </div>
        </div>
      </div>

      {/* Avignon seul (déjà dans le bloc ci-dessus mais on garde la cohérence visuelle) */}
      {/* ─── BANNIÈRE LUBERON ─── */}
      <div className="relative h-52 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <Image
          src="/images/bg-lauris.jpg"
          alt="Lauris — Village du Luberon"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A08]/75 via-[#0D1A08]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/65 mb-1">Vaucluse</p>
            <h2 className="text-3xl font-bold leading-tight">🌿 Luberon — Lauris</h2>
            <p className="text-sm text-white/70 mt-1.5">Village perché · 3 maisons · Combinables</p>
          </div>
        </div>
      </div>

      {/* Maisons du Luberon */}
      <div className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {luberon.map((p) => (
            <PropertyCard key={p.id} property={p} locale={locale} />
          ))}
        </div>

        {/* Section Découvrir Lauris */}
        <div className="mt-10 bg-gradient-to-br from-[#6B7C45]/10 to-[#C8763A]/5 border border-[#6B7C45]/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl shrink-0">🏡</span>
            <div>
              <h3 className="text-xl font-bold text-[#2C2416] mb-2">{tLauris('discover_title')}</h3>
              <p className="text-[#5C4F3A] mb-5 leading-relaxed">{tLauris('discover_text')}</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://frenchmoments.eu/lauris/?utm_source=Pinterest&utm_medium=organic" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-[#6B7C45] text-[#6B7C45] px-4 py-2 rounded-lg hover:bg-[#6B7C45] hover:text-white transition-colors text-sm font-medium shadow-sm">
                  🌿 {tLauris('link1_label')}
                </a>
                <a href="https://www.j-aime-le-vaucluse.com/lauris#gsc.tab=0" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-[#C8763A] text-[#C8763A] px-4 py-2 rounded-lg hover:bg-[#C8763A] hover:text-white transition-colors text-sm font-medium shadow-sm">
                  ☀️ {tLauris('link2_label')}
                </a>
                <a href="https://www.destinationluberon.com/decouvrir/villes-et-villages/lauris" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-[#9B8EC4] text-[#9B8EC4] px-4 py-2 rounded-lg hover:bg-[#9B8EC4] hover:text-white transition-colors text-sm font-medium shadow-sm">
                  🗺️ {tLauris('link3_label')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
