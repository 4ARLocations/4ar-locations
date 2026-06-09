import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { properties, type Property } from '@/lib/properties';

export default function LaurisCombine({
  currentProperty,
  locale,
}: {
  currentProperty: Property;
  locale: string;
}) {
  const t = useTranslations();
  const tc = useTranslations('lauris_combine');

  // Les autres maisons de Lauris disponibles (avec photos)
  const otherLauris = properties.filter(
    (p) => p.region === 'luberon' && p.id !== currentProperty.id && p.images.length > 0
  );

  if (otherLauris.length === 0) return null;

  const totalGuests = currentProperty.guests + otherLauris.reduce((sum, p) => sum + p.guests, 0);

  return (
    <div className="mt-10 bg-gradient-to-br from-[#C8763A]/8 to-[#6B7C45]/8 border border-[#C8763A]/20 rounded-2xl p-6 md:p-8">
      {/* Titre */}
      <div className="flex items-start gap-3 mb-5">
        <span className="text-3xl shrink-0">🏘️</span>
        <div>
          <h3 className="text-xl font-bold text-[#2C2416]">
            {tc('group_title', { guests: currentProperty.guests })}
          </h3>
          <p className="text-[#5C4F3A] mt-1">
            {tc('group_text', { total: totalGuests })}
          </p>
        </div>
      </div>

      {/* Cards des autres maisons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {otherLauris.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-[#E8DCC8] overflow-hidden flex gap-3 p-3 shadow-sm"
          >
            {/* Miniature */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
              <Image
                src={p.image}
                alt={t(p.nameKey)}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            {/* Infos */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#2C2416] text-sm truncate">{t(p.nameKey)}</p>
              <div className="flex items-center gap-3 text-xs text-[#9B8A74] mt-1">
                <span>👥 {p.guests} {tc('guests_abbr')}</span>
                <span>🛏 {p.bedrooms} {tc('rooms_abbr')}</span>
              </div>
              {p.priceFrom > 0 && (
                <p className="text-xs text-[#C8763A] font-semibold mt-1">
                  {p.priceFrom}€{tc('per_night')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/${locale}/contact?bien=${currentProperty.id}&combine=true`}
          className="flex-1 bg-[#C8763A] hover:bg-[#A85E28] text-white text-center font-bold py-3 px-5 rounded-xl transition-colors"
        >
          {tc('cta_combined')}
        </Link>
        <Link
          href={`/${locale}/biens`}
          className="flex-1 border border-[#C8763A] text-[#C8763A] text-center font-semibold py-3 px-5 rounded-xl hover:bg-[#C8763A] hover:text-white transition-colors"
        >
          {tc('cta_all')}
        </Link>
      </div>
    </div>
  );
}
