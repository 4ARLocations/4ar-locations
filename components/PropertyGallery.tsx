'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function PropertyGallery({
  images,
  name,
  categories = {},
}: {
  images: string[];
  name: string;
  categories?: Record<string, string>;
}) {
  const t = useTranslations('properties');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Build ordered list of distinct category labels
  const tabOrder = ['all', ...Array.from(
    images.reduce((acc, url) => {
      const cat = categories[url];
      if (cat) acc.add(cat);
      return acc;
    }, new Set<string>())
  )];
  const hasTabs = tabOrder.length > 1;

  const filtered = activeTab === 'all'
    ? images
    : images.filter(url => categories[url] === activeTab);

  // Reset current index when tab changes
  useEffect(() => { setCurrent(0); }, [activeTab]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(filtered.length - 1, c + 1));
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, filtered.length]);

  if (filtered.length === 0) return null;

  return (
    <>
      {/* Onglets catégories */}
      {hasTabs && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tabOrder.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-[#C8763A] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5C4F3A] border border-[#E8DCC8] hover:border-[#C8763A] hover:text-[#C8763A]'
              }`}
            >
              {tab === 'all' ? 'Tout' : tab}
              {tab !== 'all' && (
                <span className="ml-1 opacity-60">
                  {images.filter(u => categories[u] === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Galerie principale */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 md:h-[420px] rounded-2xl overflow-hidden">
        {/* Grande photo */}
        <div
          className="col-span-3 row-span-2 relative cursor-pointer group"
          onClick={() => { setCurrent(0); setLightbox(true); }}
        >
          <Image
            src={filtered[0]}
            alt={name}
            fill
            className="object-cover group-hover:brightness-90 transition"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          {hasTabs && categories[filtered[0]] && (
            <span className="absolute bottom-3 left-3 bg-black/55 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
              {categories[filtered[0]]}
            </span>
          )}
        </div>
        {/* Miniatures */}
        {filtered.slice(1, 3).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer group"
            onClick={() => { setCurrent(i + 1); setLightbox(true); }}
          >
            <Image
              src={img}
              alt={`${name} ${i + 2}`}
              fill
              className="object-cover group-hover:brightness-90 transition"
              sizes="20vw"
            />
          </div>
        ))}
        {/* Bouton "Voir tout" */}
        {filtered.length > 3 && (
          <div
            className="relative cursor-pointer group"
            onClick={() => { setCurrent(3); setLightbox(true); }}
          >
            <Image
              src={filtered[3]}
              alt={`${name} 4`}
              fill
              className="object-cover group-hover:brightness-75 transition"
              sizes="20vw"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{t('more_photos', { n: filtered.length - 3 })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-[#C8763A]"
            onClick={() => setLightbox(false)}
          >✕</button>

          <button
            className="absolute left-4 text-white text-4xl hover:text-[#C8763A] disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => Math.max(0, c - 1)); }}
            disabled={current === 0}
          >‹</button>

          <div
            className="relative w-full max-w-4xl h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[current]}
              alt={`${name} ${current + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
            {/* Badge catégorie dans la lightbox */}
            {categories[filtered[current]] && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {categories[filtered[current]]}
              </div>
            )}
          </div>

          <button
            className="absolute right-4 text-white text-4xl hover:text-[#C8763A] disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => Math.min(filtered.length - 1, c + 1)); }}
            disabled={current === filtered.length - 1}
          >›</button>

          {/* Compteur */}
          <div className="absolute bottom-4 text-white/70 text-sm">
            {current + 1} / {filtered.length}
          </div>

          {/* Miniatures en bas */}
          <div className="absolute bottom-10 flex gap-2 flex-wrap justify-center max-w-[90vw]">
            {filtered.map((img, i) => (
              <div
                key={i}
                className={`relative w-14 h-10 rounded cursor-pointer overflow-hidden border-2 transition ${i === current ? 'border-[#C8763A]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
