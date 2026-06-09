'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FLOOR_PLAN_ROOMS, type RoomDef, type FloorDef } from '@/lib/floor-plan-rooms';

// ─── Types ──────────────────────────────────────────────────────────────────

type RoomPhotos = Record<string, string[]>; // roomId → photo URLs

interface Props {
  propertyId: string;
  roomPhotos?: RoomPhotos;  // Overrides from Redis (optional)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Resolve photos for a room (Redis overrides > static defaults) */
function getPhotos(room: RoomDef, overrides?: RoomPhotos): string[] {
  if (overrides && overrides[room.id] && overrides[room.id].length > 0) {
    return overrides[room.id];
  }
  return room.defaultPhotos;
}

/** Slightly darken a hex color for the 3D shadow face */
function darken(hex: string): string {
  const map: Record<string, string> = {
    '#FFF3E8': '#E8CBA0',
    '#F0F4E8': '#C8D4A0',
    '#E8F0F8': '#A8C0D8',
    '#F5F0EB': '#D8CCC0',
    '#E8F5E8': '#A8D4A8',
    '#F0EBE3': '#C8B8A8',
  };
  return map[hex] ?? '#D0C8C0';
}

// ─── Room Component (SVG) ────────────────────────────────────────────────────

function RoomShape({
  room,
  hasPhotos,
  isHovered,
  onHover,
  onClick,
}: {
  room: RoomDef;
  hasPhotos: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (room: RoomDef) => void;
}) {
  const depth = 6; // 3D depth offset
  const shadowFill = darken(room.fill);
  const opacity = isHovered ? 1 : 0.92;

  return (
    <g
      style={{ cursor: hasPhotos ? 'pointer' : 'default' }}
      onMouseEnter={() => hasPhotos && onHover(room.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => hasPhotos && onClick(room)}
    >
      {/* 3D bottom face (shadow) */}
      <rect
        x={room.x + depth}
        y={room.y + depth}
        width={room.w}
        height={room.h}
        rx="6"
        fill={shadowFill}
      />

      {/* Main face */}
      <rect
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        rx="6"
        fill={isHovered ? '#FDEFD8' : room.fill}
        stroke={isHovered ? '#C8763A' : '#D4C8B8'}
        strokeWidth={isHovered ? 2 : 1}
        opacity={opacity}
        style={{ transition: 'fill 0.15s, stroke 0.15s' }}
      />

      {/* Icon */}
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h / 2 - (room.h > 60 ? 14 : 6)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={room.h > 80 ? 20 : 14}
        style={{ userSelect: 'none' }}
      >
        {room.icon}
      </text>

      {/* Label */}
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h / 2 + (room.h > 60 ? 12 : 8)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={room.w > 120 ? 11 : 9}
        fontFamily="var(--font-space), system-ui, sans-serif"
        fontWeight="600"
        fill={isHovered ? '#A85E28' : '#5C4F3A'}
        style={{ userSelect: 'none' }}
      >
        {room.label}
      </text>

      {/* Camera button — only if has photos */}
      {hasPhotos && (
        <g transform={`translate(${room.x + room.w - 18}, ${room.y + 6})`}>
          <circle cx="10" cy="10" r="9" fill={isHovered ? '#C8763A' : '#C8763A'} opacity={isHovered ? 1 : 0.7} />
          {/* Camera icon */}
          <text x="10" y="10" textAnchor="middle" dominantBaseline="middle" fontSize="9" style={{ userSelect: 'none' }}>
            📷
          </text>
        </g>
      )}
    </g>
  );
}

// ─── Photo Modal ─────────────────────────────────────────────────────────────

function PhotoModal({
  room,
  photos,
  onClose,
  noPhotoLabel,
}: {
  room: RoomDef;
  photos: string[];
  onClose: () => void;
  noPhotoLabel: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = useCallback(() => setCurrentIdx((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrentIdx((i) => (i + 1) % photos.length), [photos.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">{room.icon}</span>
            <span className="font-semibold text-[#2C2416]">{room.label}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Photo */}
        {photos.length > 0 ? (
          <div className="relative aspect-[4/3] bg-gray-100">
            <Image
              src={photos[currentIdx]}
              alt={`${room.label} - photo ${currentIdx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
            />

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentIdx ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Counter */}
            {photos.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentIdx + 1} / {photos.length}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm">{noPhotoLabel}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FloorPlanInteractive({ propertyId, roomPhotos }: Props) {
  const t = useTranslations('floor_plan');
  const floors = FLOOR_PLAN_ROOMS[propertyId];

  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomDef | null>(null);

  if (!floors || floors.length === 0) return null;

  const floor: FloorDef = floors[activeFloorIdx];

  return (
    <div className="bg-white rounded-2xl border border-[#EDE6DC] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#EDE6DC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#2C2416] text-lg">{t('title')}</h3>
          <p className="text-sm text-[#9B8A74] mt-0.5">{t('hint')}</p>
        </div>

        {/* Legend */}
        <div className="flex gap-3 flex-wrap">
          {[
            { color: '#FFF3E8', label: 'Séjour / Cuisine' },
            { color: '#F0F4E8', label: 'Chambre' },
            { color: '#E8F0F8', label: 'Salle d\'eau / WC' },
            { color: '#E8F5E8', label: 'Terrasse' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border border-gray-200 flex-shrink-0" style={{ background: color }} />
              <span className="text-xs text-[#9B8A74] whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floor tabs */}
      {floors.length > 1 && (
        <div className="flex border-b border-[#EDE6DC] bg-[#FAF7F2]">
          {floors.map((f, i) => (
            <button
              key={f.id}
              onClick={() => { setActiveFloorIdx(i); setHoveredRoom(null); setSelectedRoom(null); }}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                i === activeFloorIdx
                  ? 'text-[#C8763A] border-[#C8763A] bg-white'
                  : 'text-[#9B8A74] border-transparent hover:text-[#5C4F3A] hover:border-[#D4C8B8]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* SVG Floor Plan */}
      <div className="p-4 sm:p-6">
        <svg
          viewBox={floor.viewBox}
          className="w-full h-auto"
          style={{ maxHeight: '420px' }}
          aria-label={`Plan ${floor.label}`}
        >
          {/* Building outline */}
          <rect
            x="10"
            y="10"
            width={floor.width - 20}
            height={floor.height - 20}
            rx="8"
            fill="#F5F0EB"
            stroke="#A89880"
            strokeWidth="2"
          />

          {/* Rooms */}
          {floor.rooms.map((room) => {
            const photos = getPhotos(room, roomPhotos);
            return (
              <RoomShape
                key={room.id}
                room={room}
                hasPhotos={photos.length > 0}
                isHovered={hoveredRoom === room.id}
                onHover={setHoveredRoom}
                onClick={(r) => setSelectedRoom(r)}
              />
            );
          })}
        </svg>

        {/* Room list / quick nav */}
        <div className="mt-4 flex flex-wrap gap-2">
          {floor.rooms.map((room) => {
            const photos = getPhotos(room, roomPhotos);
            return (
              <button
                key={room.id}
                onClick={() => photos.length > 0 && setSelectedRoom(room)}
                onMouseEnter={() => photos.length > 0 && setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                disabled={photos.length === 0}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  photos.length > 0
                    ? 'border-[#C8763A]/40 text-[#C8763A] hover:bg-[#C8763A]/10 hover:border-[#C8763A] cursor-pointer'
                    : 'border-gray-200 text-gray-400 cursor-default'
                }`}
              >
                <span>{room.icon}</span>
                <span>{room.label}</span>
                {photos.length > 0 && (
                  <span className="bg-[#C8763A] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {photos.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedRoom && (
        <PhotoModal
          room={selectedRoom}
          photos={getPhotos(selectedRoom, roomPhotos)}
          onClose={() => setSelectedRoom(null)}
          noPhotoLabel={t('no_photo')}
        />
      )}
    </div>
  );
}
