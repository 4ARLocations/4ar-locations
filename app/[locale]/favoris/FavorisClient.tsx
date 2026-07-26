'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getFavorites, setFavorites } from '@/components/FavoriteButton';
import { properties } from '@/lib/properties';
import { useTranslations } from 'next-intl';

export default function FavorisClient() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('favorites');
  const tProp = useTranslations();
  const [favIds, setFavIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavIds(getFavorites());
    setMounted(true);
  }, []);

  const favProps = properties.filter((p) => favIds.includes(p.id));

  const removeFav = (id: string) => {
    const next = favIds.filter((f) => f !== id);
    setFavorites(next);
    setFavIds(next);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C2416] flex items-center gap-3">
          <span>❤️</span> {t('title')}
        </h1>
        <p className="text-[#9B8A74] mt-2">
          {mounted && favProps.length > 0
            ? favProps.length === 1 ? t('count_one') : t('count_other', { n: favProps.length })
            : t('subtitle_empty')}
        </p>
      </div>

      {!mounted ? null : favProps.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF7F2] rounded-2xl border border-[#E8DCC8]">
          <p className="text-5xl mb-4">🏡</p>
          <p className="text-[#5C4F3A] font-medium text-lg mb-2">{t('empty_title')}</p>
          <p className="text-[#9B8A74] text-sm mb-6">{t('empty_hint')}</p>
          <Link
            href={`/${locale}/biens`}
            className="inline-block bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t('view_properties')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProps.map((p) => (
              <div key={p.id} className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <Link href={`/${locale}/biens/${p.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={tProp(p.nameKey)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-[#2C2416] text-lg mb-1">{tProp(p.nameKey)}</h2>
                    <p className="text-[#9B8A74] text-sm flex items-center gap-1 mb-3">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {tProp(p.locationKey)}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-[#5C4F3A]">
                      <span>👥 {p.guests}</span>
                      <span>🛏 {p.bedrooms}</span>
                      <span>🚿 {p.bathrooms}</span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex items-center justify-between border-t border-[#F0EAE0] pt-3">
                  <span className="text-[#C8763A] font-bold text-lg">
                    {p.priceFrom > 0 ? `${p.priceFrom}€` : tProp('properties.on_request')}
                    {p.priceFrom > 0 && <span className="text-xs font-normal text-[#9B8A74]">{tProp('properties.per_night_short')}</span>}
                  </span>
                  <button
                    onClick={() => removeFav(p.id)}
                    className="text-xs text-[#9B8A74] hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t('remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/biens`}
              className="text-[#C8763A] hover:underline text-sm font-medium"
            >
              {t('back_to_all')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
