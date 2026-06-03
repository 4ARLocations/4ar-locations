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

  const regions = [
    { key: 'alpes', label: 'Alpes du Sud', emoji: '🏔️' },
    { key: 'avignon', label: 'Avignon', emoji: '🏰' },
    { key: 'luberon', label: 'Luberon — Lauris', emoji: '🌿' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">{t('title')}</h1>
        <p className="text-[#5C4F3A] text-lg">{t('subtitle')}</p>
      </div>

      {regions.map(({ key, label, emoji }) => {
        const regionProps = properties.filter((p) => p.region === key);
        if (!regionProps.length) return null;
        return (
          <div key={key} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{emoji}</span>
              <h2 className="text-2xl font-bold text-[#2C2416]">{label}</h2>
              <div className="flex-1 h-px bg-[#E8DCC8]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionProps.map((p) => (
                <PropertyCard key={p.id} property={p} locale={locale} />
              ))}
            </div>

            {/* Section Découvrir Lauris — uniquement pour la région luberon */}
            {key === 'luberon' && (
              <div className="mt-10 bg-gradient-to-br from-[#6B7C45]/10 to-[#C8763A]/5 border border-[#6B7C45]/20 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0">🏡</span>
                  <div>
                    <h3 className="text-xl font-bold text-[#2C2416] mb-2">{tLauris('discover_title')}</h3>
                    <p className="text-[#5C4F3A] mb-5 leading-relaxed">{tLauris('discover_text')}</p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://frenchmoments.eu/lauris/?utm_source=Pinterest&utm_medium=organic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border border-[#6B7C45] text-[#6B7C45] px-4 py-2 rounded-lg hover:bg-[#6B7C45] hover:text-white transition-colors text-sm font-medium shadow-sm"
                      >
                        🌿 {tLauris('link1_label')}
                      </a>
                      <a
                        href="https://www.j-aime-le-vaucluse.com/lauris#gsc.tab=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border border-[#C8763A] text-[#C8763A] px-4 py-2 rounded-lg hover:bg-[#C8763A] hover:text-white transition-colors text-sm font-medium shadow-sm"
                      >
                        ☀️ {tLauris('link2_label')}
                      </a>
                      <a
                        href="https://www.destinationluberon.com/decouvrir/villes-et-villages/lauris"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white border border-[#9B8EC4] text-[#9B8EC4] px-4 py-2 rounded-lg hover:bg-[#9B8EC4] hover:text-white transition-colors text-sm font-medium shadow-sm"
                      >
                        🗺️ {tLauris('link3_label')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
