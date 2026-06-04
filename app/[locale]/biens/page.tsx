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

      {/* ─── SECTION ALPES & AVIGNON — fond montagne ─── */}
      <section
        className="relative py-12"
        style={{
          backgroundImage: "url('/images/bg-risoul-mountain.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-[#FAF7F2]/87 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

          {/* Label de région */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⛷</span>
            <h2 className="text-xl font-bold text-[#2C2416]">Alpes du Sud & Avignon</h2>
            <div className="flex-1 h-px bg-[#E8DCC8]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#E8DCC8] shadow-sm">
            <div className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🏔️</span>
                <span className="text-sm font-semibold text-[#9B8A74]">Hautes-Alpes</span>
              </div>
              <PropertyCard property={risoul} locale={locale} />
            </div>
            <div className="block md:hidden h-px bg-[#E8DCC8] mx-6" />
            <div className="p-6 bg-white/80 backdrop-blur-sm border-t md:border-t-0 md:border-l border-[#E8DCC8]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🏛️</span>
                <span className="text-sm font-semibold text-[#9B8A74]">Vaucluse · Intramuros</span>
              </div>
              <PropertyCard property={avignon} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION LUBERON — fond château de Lauris ─── */}
      <section
        className="relative py-12"
        style={{
          backgroundImage: "url('/images/bg-lauris-chateau.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-[#FAF7F2]/87 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🌿</span>
            <h2 className="text-xl font-bold text-[#2C2416]">Luberon — Lauris</h2>
            <div className="flex-1 h-px bg-[#E8DCC8]" />
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
