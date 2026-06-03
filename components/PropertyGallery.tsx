'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function PropertyGallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      {/* Galerie principale */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 md:h-[420px] rounded-2xl overflow-hidden">
        {/* Grande photo */}
        <div
          className="col-span-3 row-span-2 relative cursor-pointer group"
          onClick={() => { setCurrent(0); setLightbox(true); }}
        >
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover group-hover:brightness-90 transition"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>
        {/* Miniatures */}
        {images.slice(1, 3).map((img, i) => (
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
        {/* Bouton "Voir tout" si plus de 3 photos */}
        {images.length > 3 && (
          <div
            className="relative cursor-pointer group"
            onClick={() => { setCurrent(3); setLightbox(true); }}
          >
            <Image
              src={images[3]}
              alt={`${name} 4`}
              fill
              className="object-cover group-hover:brightness-75 transition"
              sizes="20vw"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-sm">+{images.length - 3} photos</span>
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
              src={images[current]}
              alt={`${name} ${current + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          <button
            className="absolute right-4 text-white text-4xl hover:text-[#C8763A] disabled:opacity-30"
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => Math.min(images.length - 1, c + 1)); }}
            disabled={current === images.length - 1}
          >›</button>

          {/* Compteur */}
          <div className="absolute bottom-4 text-white/70 text-sm">
            {current + 1} / {images.length}
          </div>

          {/* Miniatures en bas */}
          <div className="absolute bottom-10 flex gap-2">
            {images.map((img, i) => (
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
