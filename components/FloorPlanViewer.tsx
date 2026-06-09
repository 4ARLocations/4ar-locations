'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { FloorPlanFloor, Hotspot } from '@/lib/floor-plans';

interface Props {
  floors: FloorPlanFloor[];
  propertyName: string;
}

export default function FloorPlanViewer({ floors, propertyName }: Props) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  if (!floors || floors.length === 0) return null;

  const floor = floors[activeFloor];

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-[#2C2416] mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Plan du logement
      </h2>

      {/* Onglets d'étages */}
      {floors.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {floors.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFloor === i
                  ? 'bg-[#C8763A] text-white shadow-sm'
                  : 'bg-[#F0EBE3] text-[#5C4F3A] hover:bg-[#E8DCC8]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Plan avec hotspots */}
      <div className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden shadow-sm">
        <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
          <Image
            src={floor.imageUrl}
            alt={`Plan ${floor.label} – ${propertyName}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 700px"
          />

          {/* Hotspots */}
          {floor.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => setSelectedHotspot(hotspot)}
              title={hotspot.label}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              {/* Point pulsant */}
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8763A] opacity-60" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-[#C8763A] border-2 border-white shadow-md" />
              </span>
              {/* Label au survol */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#2C2416] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {hotspot.label}
              </span>
            </button>
          ))}
        </div>

        {/* Légende */}
        {floor.hotspots.length > 0 && (
          <div className="px-4 py-3 border-t border-[#F0EBE3] flex flex-wrap gap-3">
            {floor.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedHotspot(h)}
                className="flex items-center gap-1.5 text-xs text-[#5C4F3A] hover:text-[#C8763A] transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8763A] flex-shrink-0" />
                {h.label}
              </button>
            ))}
          </div>
        )}

        {floor.hotspots.length === 0 && (
          <p className="px-4 py-3 text-xs text-[#B0A090] border-t border-[#F0EBE3]">
            Cliquez sur un point orange pour voir la pièce en photo.
          </p>
        )}
      </div>

      {/* Modal photo */}
      {selectedHotspot && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedHotspot(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedHotspot.photoUrl ? (
              <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={selectedHotspot.photoUrl}
                  alt={selectedHotspot.label}
                  fill
                  className="object-cover"
                  sizes="500px"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-[#F5F1EB] text-[#9B8A74] text-sm">
                Pas de photo disponible
              </div>
            )}
            <div className="px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-[#2C2416] text-lg">{selectedHotspot.label}</h3>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-[#9B8A74] hover:text-[#5C4F3A] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
