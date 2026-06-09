'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FloorHotspots, type HotspotDef } from '@/lib/floor-plan-hotspots';

type RoomPhotos = Record<string, string[]>;

function getPhotos(hotspot: HotspotDef, overrides?: RoomPhotos): string[] {
  if (overrides?.[hotspot.id]?.length) return overrides[hotspot.id];
  return hotspot.defaultPhotos;
}

// ─── Modal photos ─────────────────────────────────────────────────────────────
function PhotoModal({ hotspot, photos, onClose, noPhotoLabel }: {
  hotspot: HotspotDef; photos: string[]; onClose: () => void; noPhotoLabel: string;
}) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div>
            <span className="font-semibold text-[#2C2416]">{hotspot.label}</span>
            {hotspot.area && <span className="text-xs text-[#9B8A74] ml-2">{hotspot.area}</span>}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {photos.length > 0 ? (
          <div className="relative aspect-[4/3]">
            <Image src={photos[idx]} alt={hotspot.label} fill className="object-cover" sizes="672px" />
            {photos.length > 1 && (
              <>
                <button onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => setIdx(i => (i + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {idx + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] flex items-center justify-center text-gray-400">
            <div className="text-center"><div className="text-4xl mb-2">📷</div><div className="text-sm">{noPhotoLabel}</div></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
interface Props {
  propertyId: string;
  floors: FloorHotspots[];
  roomPhotos?: RoomPhotos;
}

export default function FloorPlanImageViewer({ propertyId, floors, roomPhotos }: Props) {
  const t = useTranslations('floor_plan');
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotDef | null>(null);

  const floor = floors[activeFloorIdx];

  return (
    <div className="bg-white rounded-2xl border border-[#EDE6DC] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#EDE6DC]">
        <h3 className="font-bold text-[#2C2416] text-lg">{t('title')}</h3>
        <p className="text-sm text-[#9B8A74] mt-0.5">{t('hint')}</p>
      </div>

      {/* Onglets étages */}
      <div className="flex border-b border-[#EDE6DC] bg-[#FAF7F2]">
        {floors.map((f, i) => (
          <button key={f.id} onClick={() => { setActiveFloorIdx(i); setHoveredHotspot(null); setSelectedHotspot(null); }}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
              i === activeFloorIdx
                ? 'text-[#C8763A] border-[#C8763A] bg-white'
                : 'text-[#9B8A74] border-transparent hover:text-[#5C4F3A]'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Plan image + hotspots */}
      <div className="relative w-full overflow-hidden bg-[#FAF7F2]">
        {/* Image du plan architectural */}
        <div className="relative w-full" style={{ aspectRatio: floor.id === 'rdc' ? '2700/1155' : floor.id === 'r1' ? '2699/1286' : '2725/1369' }}>
          <Image
            src={floor.image}
            alt={`Plan ${floor.label}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />

          {/* Hotspots positionnés en % sur l'image */}
          {floor.hotspots.map(hotspot => {
            const photos = getPhotos(hotspot, roomPhotos);
            const canClick = hotspot.hasPhotos && photos.length > 0;
            const isHovered = hoveredHotspot === hotspot.id;
            const isSelected = selectedHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                onMouseEnter={() => canClick && setHoveredHotspot(hotspot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={() => canClick && setSelectedHotspot(hotspot)}
              >
                {/* Bouton principal */}
                <div className={`
                  relative flex items-center justify-center rounded-full transition-all duration-200
                  ${canClick ? 'cursor-pointer' : 'cursor-default'}
                  ${isHovered || isSelected
                    ? 'w-10 h-10 bg-[#C8763A] shadow-lg shadow-[#C8763A]/40 scale-110'
                    : canClick
                    ? 'w-8 h-8 bg-[#C8763A] shadow-md shadow-[#C8763A]/30 hover:scale-110'
                    : 'w-6 h-6 bg-[#9B8A74]/70'
                  }
                `}>
                  {/* Ping animation pour les pièces avec photos */}
                  {canClick && !isHovered && !isSelected && (
                    <div className="absolute inset-0 rounded-full bg-[#C8763A] animate-ping opacity-30" />
                  )}
                  <svg className={`${isHovered || isSelected ? 'w-5 h-5' : canClick ? 'w-4 h-4' : 'w-3 h-3'} text-white`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                {/* Tooltip label */}
                <div className={`
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg
                  bg-[#2C2416] text-white text-xs whitespace-nowrap pointer-events-none
                  transition-all duration-150 shadow-lg
                  ${isHovered || isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
                `}>
                  <div className="font-semibold">{hotspot.label}</div>
                  {hotspot.area && <div className="text-white/70 text-[10px]">{hotspot.area}</div>}
                  {/* Flèche */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C2416]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende pièces avec photos */}
      <div className="px-5 py-4 border-t border-[#EDE6DC]">
        <div className="flex flex-wrap gap-2">
          {floor.hotspots.filter(h => h.hasPhotos).map(hotspot => {
            const photos = getPhotos(hotspot, roomPhotos);
            const isSel = selectedHotspot?.id === hotspot.id;
            return (
              <button key={hotspot.id}
                onClick={() => photos.length > 0 && setSelectedHotspot(hotspot)}
                onMouseEnter={() => photos.length > 0 && setHoveredHotspot(hotspot.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                disabled={photos.length === 0}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isSel
                    ? 'bg-[#C8763A] text-white border-[#C8763A]'
                    : photos.length > 0
                    ? 'border-[#C8763A]/40 text-[#C8763A] hover:bg-[#C8763A]/10 hover:border-[#C8763A]'
                    : 'border-gray-200 text-gray-400 cursor-default'
                }`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{hotspot.label}</span>
                {hotspot.area && <span className="opacity-60">{hotspot.area}</span>}
                {photos.length > 0 && (
                  <span className={`rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ${isSel ? 'bg-white text-[#C8763A]' : 'bg-[#C8763A] text-white'}`}>
                    {photos.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedHotspot && (
        <PhotoModal
          hotspot={selectedHotspot}
          photos={getPhotos(selectedHotspot, roomPhotos)}
          onClose={() => setSelectedHotspot(null)}
          noPhotoLabel={t('no_photo')}
        />
      )}
    </div>
  );
}
