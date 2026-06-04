import { useTranslations } from 'next-intl';
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
    <>
      {/* ─── EN-TÊTE ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">{t('title')}</h1>
        <p className="text-[#5C4F3A] text-lg">{t('subtitle')}</p>
      </div>

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
            backgroundPosition: 'center 35%',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Voile crème légèrement bleutée pour ambiance alpine */}
          <div className="absolute inset-0 bg-[#EEF3F7]/84 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⛷</span>
              <div>
                <h2 className="text-xl font-bold text-[#1A2C3A]">Alpes du Sud</h2>
                <p className="text-xs text-[#5C7080] font-medium tracking-wide">Hautes-Alpes · Risoul 1850</p>
              </div>
            </div>
            <PropertyCard property={risoul} locale={locale} />
          </div>
        </div>

        {/* Séparateur vertical */}
        <div className="hidden md:block w-px bg-[#D8CFC4] flex-shrink-0 my-6" />
        <div className="md:hidden h-px bg-[#D8CFC4] mx-6" />

        {/* ─── CÔTÉ DROIT : Avignon ─── */}
        <div
          className="relative flex-1 py-10 px-6 md:px-10"
          style={{
            backgroundImage: "url('/images/bg-avignon.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Voile crème légèrement chaude pour ambiance provençale */}
          <div className="absolute inset-0 bg-[#F8F2E8]/84 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🏛️</span>
              <div>
                <h2 className="text-xl font-bold text-[#2C1A08]">Avignon</h2>
                <p className="text-xs text-[#80604A] font-medium tracking-wide">Vaucluse · Intramuros</p>
              </div>
            </div>
            <PropertyCard property={avignon} locale={locale} />
          </div>
        </div>

      </div>

      {/* ─── SECTION LUBERON — fond château de Lauris ─── */}
      <section
        className="relative py-12"
        style={{
          backgroundImage: "url('/images/bg-lauris-chateau.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-[#FAF7F2]/87 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🌿</span>
            <div>
              <h2 className="text-xl font-bold text-[#2C2416]">Luberon — Lauris</h2>
              <p className="text-xs text-[#6B7C45] font-medium tracking-wide">Vaucluse · Village perché · 3 maisons combinables</p>
            </div>
            <div className="flex-1 h-px bg-[#E8DCC8] ml-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {luberon.map((p) => (
              <PropertyCard key={p.id} property={p} locale={locale} />
            ))}
          </div>

          {/* Découvrir Lauris */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#6B7C45]/20 rounded-2xl p-6 md:p-8">
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
      </section>

      <div className="pb-8" />
    </>
  );
}
