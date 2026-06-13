'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Property } from '@/lib/properties';
import FavoriteButton from '@/components/FavoriteButton';

const regionGradient: Record<string, string> = {
  alpes: 'from-[#1A3050] to-[#2C4870]',
  avignon: 'from-[#3A2410] to-[#5C3A1A]',
  luberon: 'from-[#1A2E10] to-[#2C4A1A]',
};

const regionEmoji: Record<string, string> = {
  alpes: '🏔️',
  avignon: '🏛️',
  luberon: '🌿',
};

export default function PropertyCard({
  property,
  locale,
  imageOverride,
  topRated,
}: {
  property: Property;
  locale: string;
  imageOverride?: string;
  topRated?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const displayImage = imageOverride ?? property.image;
  const hasPhoto = !!displayImage;

  const priceLabel = property.priceOnRequest
    ? null
    : property.priceFrom > 0
    ? `${property.priceFrom}€`
    : null;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8DCC8] hover:border-[#C8763A]/30 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => router.push(`/${locale}/biens/${property.slug}`)}
    >
      {/* ─── Photo ─── */}
      <div className={`relative h-60 overflow-hidden flex-shrink-0 ${!hasPhoto ? `bg-gradient-to-br ${regionGradient[property.region]}` : ''}`}>
        {hasPhoto ? (
          <Image
            src={displayImage}
            alt={t(property.nameKey)}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-30">{regionEmoji[property.region]}</span>
          </div>
        )}

        {/* Gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badges haut gauche */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#C8763A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
            {t(property.badgeKey)}
          </span>
          {topRated && (
            <span className="bg-amber-400 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              ❤️ Coup de cœur
            </span>
          )}
        </div>

        {/* Favoris haut droite */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            propertyId={property.id}
            size="sm"
            className="bg-white/90 hover:bg-white rounded-full p-2 shadow-sm text-[#2C2416]/50 hover:text-[#C8763A] transition-all"
          />
        </div>

        {/* Nom + localisation en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 z-10">
          <h3 className="text-white font-bold text-base leading-snug drop-shadow-sm">
            {t(property.nameKey)}
          </h3>
          <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t(property.locationKey)}
          </p>
        </div>
      </div>

      {/* ─── Infos ─── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Capacité */}
        <div className="flex items-center gap-4 text-[#9B8A74] text-xs mb-3 pb-3 border-b border-[#F0EAE0]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.guests} pers.
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {property.bedrooms} ch.
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-2 2-2V6c0-1.1-.9-2-2-2z" />
            </svg>
            {property.bathrooms} sdb
          </span>
          <span className="ml-auto text-[#9B8A74] bg-[#FAF7F2] px-2 py-0.5 rounded text-[10px] font-medium">
            {t(property.typeKey)}
          </span>
        </div>

        {/* Description courte */}
        <p className="text-[#5C4F3A] text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          {t(property.descriptionKey)}
        </p>

        {/* Prix + CTA */}
        <div className="flex items-end justify-between gap-2 flex-wrap">
          <div>
            {priceLabel ? (
              <>
                <div className="text-[10px] text-[#9B8A74] uppercase tracking-wide leading-none mb-0.5">
                  {property.priceOnRequest ? 'entre' : 'à partir de'}
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[#C8763A] font-bold text-xl leading-none">{priceLabel}</span>
                  <span className="text-[#9B8A74] text-xs">/nuit</span>
                </div>
                {property.cleaningFee && (
                  <div className="text-[10px] text-[#9B8A74] mt-0.5">
                    + {property.cleaningFee}€ ménage
                  </div>
                )}
              </>
            ) : (
              <span className="text-sm text-[#9B8A74] italic">Sur demande</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {property.airbnbUrl !== '#' && (
              <a
                href={property.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-semibold border border-[#E8DCC8] text-[#9B8A74] hover:border-[#FF5A5F] hover:text-[#FF5A5F] px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Airbnb
              </a>
            )}
            <Link
              href={`/${locale}/contact?bien=${property.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold bg-[#2C2416] hover:bg-[#C8763A] text-white px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
