'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Property } from '@/lib/properties';
import FavoriteButton from '@/components/FavoriteButton';

const regionLabel: Record<string, string> = {
  alpes:   'Hautes-Alpes',
  avignon: 'Vaucluse',
  luberon: 'Vaucluse',
};

export default function PropertyCard({
  property,
  locale,
  imageOverride,
  topRated,
  featured,
  compact,
  fillHeight,
}: {
  property: Property;
  locale: string;
  imageOverride?: string;
  topRated?: boolean;
  featured?: boolean;
  compact?: boolean;
  fillHeight?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const displayImage = imageOverride ?? property.image;
  const hasPhoto = !!displayImage;

  const priceLabel =
    property.priceOnRequest ? null
    : property.priceFrom > 0 ? `${property.priceFrom}€`
    : null;

  /* ── CARTE FEATURED — grande photo pleine largeur + overlay ── */
  if (featured) {
    return (
      <div
        className="group cursor-pointer"
        onClick={() => router.push(`/${locale}/biens/${property.slug}`)}
      >
        <div className="relative overflow-hidden rounded-xl h-[300px] md:h-[420px] shadow-[0_4px_40px_rgba(44,36,22,0.14)] group-hover:shadow-[0_10px_56px_rgba(44,36,22,0.20)] transition-shadow duration-700">
          {hasPhoto ? (
            <Image src={displayImage} alt={t(property.nameKey)} fill
              className="object-cover photo-card-img" sizes="1152px" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C2416] to-[#5C4F3A]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-black/8" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />

          {/* Badge région */}
          <div className="absolute top-5 left-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {regionLabel[property.region] ?? property.region}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton propertyId={property.id} size="sm"
              className="bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full p-2.5 text-white/55 hover:text-white transition-all" />
          </div>

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end justify-between gap-6">
              <div className="flex-1 min-w-0">
                {property.score && (
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <svg className="w-3.5 h-3.5 text-[#C8763A] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[13px] font-bold text-white">{property.score.value}</span>
                    <span className="text-[11px] text-white/40">· {t(property.typeKey)}</span>
                  </div>
                )}
                <h3 className="font-serif text-[26px] md:text-[34px] text-white leading-tight mb-1.5 truncate">
                  {t(property.nameKey)}
                </h3>
                <p className="text-[13px] text-white/50">
                  {property.guests}&thinsp;{t('properties.guests_short')}
                  &ensp;·&ensp;{property.bedrooms}&thinsp;{t('properties.bedrooms_short')}
                  &ensp;·&ensp;{property.bathrooms}&thinsp;{t('properties.bathrooms_short')}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                {priceLabel ? (
                  <div className="mb-3">
                    <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/32 mb-0.5">{t('home.from_price')}</div>
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-white font-bold text-[30px] leading-none">{priceLabel}</span>
                      <span className="text-white/40 text-sm">{t('properties.per_night_short')}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/50 text-sm italic mb-3">{t('properties.on_request')}</p>
                )}
                <Link href={`/${locale}/contact?bien=${property.id}`} onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold px-5 py-2.5 rounded-lg text-[13px] transition-colors">
                  {t('properties.book_btn')}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── CARTE COMPACTE — 100% photo overlay, ZÉRO encadré ── */
  if (compact) {
    return (
      <div
        className={`group cursor-pointer relative ${fillHeight ? 'h-full' : 'aspect-[3/4]'} overflow-hidden rounded-xl shadow-[0_2px_16px_rgba(44,36,22,0.10)] hover:shadow-[0_8px_32px_rgba(44,36,22,0.18)] transition-shadow duration-500`}
        onClick={() => router.push(`/${locale}/biens/${property.slug}`)}
      >
        {hasPhoto ? (
          <Image src={displayImage} alt={t(property.nameKey)} fill
            className="object-cover photo-card-img"
            sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C2416] to-[#5C4F3A]" />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 compact-card-overlay" />

        {/* Fav */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={property.id} size="sm"
            className="bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full p-2 text-white/50 hover:text-white transition-all" />
        </div>

        {/* Note */}
        {property.score && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/25 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg className="w-2.5 h-2.5 text-[#C8763A] fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] font-bold text-white">{property.score.value}</span>
          </div>
        )}

        {/* Texte bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-[16px] text-white leading-tight mb-1">
            {t(property.nameKey)}
          </h3>
          <div className="flex items-end justify-between gap-2">
            <p className="text-[11px] text-white/50">
              {property.guests}&thinsp;{t('properties.guests_short')}
              &ensp;·&ensp;{property.bedrooms}&thinsp;{t('properties.bedrooms_short')}
            </p>
            {priceLabel && (
              <span className="text-white font-bold text-[15px] leading-none flex-shrink-0">
                {priceLabel}
                <span className="text-white/40 text-[10px] font-normal">{t('properties.per_night_short')}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── CARTE STANDARD (fallback) ── */
  return (
    <div className="group cursor-pointer" onClick={() => router.push(`/${locale}/biens/${property.slug}`)}>
      <div className="relative h-[240px] overflow-hidden rounded-xl mb-4 shadow-[0_2px_20px_rgba(44,36,22,0.08)] group-hover:shadow-[0_8px_32px_rgba(44,36,22,0.14)] transition-shadow duration-500">
        {hasPhoto ? (
          <Image src={displayImage} alt={t(property.nameKey)} fill
            className="object-cover photo-card-img"
            sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-[#2C2416]/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-medium tracking-wide text-white/80 bg-black/22 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {regionLabel[property.region] ?? property.region}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={property.id} size="sm"
            className="bg-white/75 hover:bg-white rounded-full p-2 shadow-sm text-[#2C2416]/30 hover:text-[#C8763A] transition-all backdrop-blur-sm" />
        </div>
        {topRated && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-[#C8763A] text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {t('properties.top_rated')}
            </span>
          </div>
        )}
      </div>
      <div className="px-0.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-[18px] text-[#2C2416] leading-snug flex-1">{t(property.nameKey)}</h3>
          {property.score && (
            <div className="flex items-center gap-1 flex-shrink-0 mt-1">
              <svg className="w-3 h-3 text-[#C8763A] fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[12px] font-bold text-[#2C2416]">{property.score.value}</span>
            </div>
          )}
        </div>
        <p className="text-[12px] text-[#9B8A74] mb-3">{t(property.typeKey)}</p>
        <p className="text-[12px] text-[#6B5F4F] mb-4">
          {property.guests}&thinsp;{t('properties.guests_short')}&ensp;·&ensp;
          {property.bedrooms}&thinsp;{t('properties.bedrooms_short')}&ensp;·&ensp;
          {property.bathrooms}&thinsp;{t('properties.bathrooms_short')}
        </p>
        <div className="flex items-end justify-between gap-2">
          <div>
            {priceLabel ? (
              <>
                <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9B8A74] mb-0.5">{t('home.from_price')}</div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[#C8763A] font-bold text-[22px] leading-none">{priceLabel}</span>
                  <span className="text-[#9B8A74] text-xs">{t('properties.per_night_short')}</span>
                </div>
              </>
            ) : (
              <span className="text-sm text-[#9B8A74] italic">{t('properties.on_request')}</span>
            )}
          </div>
          <Link href={`/${locale}/contact?bien=${property.id}`} onClick={(e) => e.stopPropagation()}
            className="group/btn text-[12px] font-semibold text-[#C8763A] hover:text-[#A85E28] flex items-center gap-1 transition-colors flex-shrink-0">
            {t('properties.book_btn')}
            <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
