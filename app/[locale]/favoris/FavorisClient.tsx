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
      {mounted && favProps.length > 0 && (
        <p className="text-[#9B8A74] text-sm mb-6">
          {favProps.length === 1 ? t('count_one') : t('count_other', { n: favProps.length })}
        </p>
      )}

      {!mounted ? null : favProps.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(44,36,22,.9) 0%, rgba(20,14,4,.95) 100%)', border: '1px solid rgba(200,118,58,.22)' }}
        >
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-[#C8763A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-white/80 font-medium text-lg mb-2">{t('empty_title')}</p>
          <p className="text-white/42 text-sm mb-6">{t('empty_hint')}</p>
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
                    <div className="flex items-center gap-2 text-xs text-[#9B8A74]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{p.guests}</span>
                      <span className="text-[#D8CFC4]">·</span>
                      <span>{p.bedrooms} ch.</span>
                      <span className="text-[#D8CFC4]">·</span>
                      <span>{p.bathrooms} sdb</span>
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
