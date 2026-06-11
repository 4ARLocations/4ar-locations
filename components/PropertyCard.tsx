'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Property } from '@/lib/properties';
import FavoriteButton from '@/components/FavoriteButton';

const regionGradient: Record<string, string> = {
  alpes: 'from-blue-900 to-slate-700',
  avignon: 'from-yellow-700 to-orange-800',
  luberon: 'from-green-800 to-lime-700',
};

const regionEmoji: Record<string, string> = {
  alpes: '🏔️',
  avignon: '🏰',
  luberon: '🌿',
};

export default function PropertyCard({ property, locale, imageOverride, topRated }: { property: Property; locale: string; imageOverride?: string; topRated?: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const displayImage = imageOverride ?? property.image;
  const hasPhoto = displayImage && !displayImage.includes('lauris3');

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-[#E8DCC8] cursor-pointer"
      onClick={() => router.push(`/${locale}/biens/${property.slug}`)}
    >
      {/* Image */}
      <div className={`relative h-56 overflow-hidden ${!hasPhoto ? `bg-gradient-to-br ${regionGradient[property.region]} flex items-center justify-center` : ''}`}>
        {hasPhoto ? (
          <Image
            src={displayImage}
            alt={t(property.nameKey)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-6xl opacity-50">{regionEmoji[property.region]}</span>
        )}
        {/* Gradient overlay for readability */}
        {hasPhoto && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="bg-[#C8763A] text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {t(property.badgeKey)}
          </span>
          {topRated && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow flex items-center gap-1">
              ❤️ Coup de cœur
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          <FavoriteButton propertyId={property.id} size="md" className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow text-[#2C2416]/60 hover:text-[#C8763A]" />
          <span className="bg-white/90 text-[#2C2416] text-xs font-semibold px-2 py-1 rounded-full shadow">
            {t(property.typeKey)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-[#2C2416] mb-1 leading-tight">{t(property.nameKey)}</h3>
        <p className="text-[#9B8A74] text-sm mb-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t(property.locationKey)}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-[#5C4F3A] mb-4 border-y border-[#E8DCC8] py-3">
          <span title={t('properties.guests')}>👥 {property.guests}</span>
          <span title={t('properties.bedrooms')}>🛏 {property.bedrooms}</span>
          <span title={t('properties.bathrooms')}>🚿 {property.bathrooms}</span>
        </div>

        <p className="text-sm text-[#5C4F3A] mb-5 line-clamp-2">{t(property.descriptionKey)}</p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            {property.priceOnRequest ? (
              <div>
                <span className="text-xs text-[#9B8A74]">{t('properties.price_between')} </span>
                <span className="text-lg font-bold text-[#C8763A]">{property.priceFrom}€</span>
                <span className="text-xs text-[#9B8A74]"> {t('properties.price_and')} </span>
                <span className="text-lg font-bold text-[#C8763A]">{property.priceTo}€</span>
                <span className="text-xs text-[#9B8A74]">{t('properties.per_night_short')}</span>
                <div className="text-xs text-[#C8763A] font-medium">{t('properties.contact_for_rates')}</div>
              </div>
            ) : property.priceFrom > 0 ? (
              <div>
                <span className="text-xs text-[#9B8A74]">{t('home.from_price')}</span>
                <span className="text-xl font-bold text-[#C8763A] ml-1">{property.priceFrom}€</span>
                <span className="text-xs text-[#9B8A74]">{t('properties.per_night_short')}</span>
                {property.cleaningFee && (
                  <div className="text-xs text-[#9B8A74]">{t('properties.cleaning_fee_short', { n: property.cleaningFee })}</div>
                )}
                {property.minNights && (
                  <div className="text-xs text-[#9B8A74]">{t('properties.min_nights_short', { n: property.minNights })}</div>
                )}
              </div>
            ) : (
              <span className="text-sm font-semibold text-[#9B8A74] italic">{t('properties.on_request')}</span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {property.airbnbUrl !== '#' && (
              <a
                href={property.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs border border-[#C8763A] text-[#C8763A] px-3 py-1.5 rounded-lg hover:bg-[#C8763A] hover:text-white transition-colors font-medium"
              >
                Airbnb
              </a>
            )}
            {property.abritelUrl && (
              <a
                href={property.abritelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs border border-[#9B8EC4] text-[#9B8EC4] px-3 py-1.5 rounded-lg hover:bg-[#9B8EC4] hover:text-white transition-colors font-medium"
              >
                Abritel
              </a>
            )}
            <Link
              href={`/${locale}/contact?bien=${property.id}`}
              className="text-xs bg-[#6B7C45] text-white px-3 py-1.5 rounded-lg hover:bg-[#5A6838] transition-colors font-medium"
            >
              {t('home.book_direct')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
