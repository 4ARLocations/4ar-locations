'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FLOOR_PLAN_DATA, type RoomData, type FloorData, type FurnitureItem, type DoorSpec } from '@/lib/floor-plan-data';

// ─── Constantes de rendu ──────────────────────────────────────────────────────
const SCALE = 60;        // pixels par mètre
const WALL = 5;          // épaisseur demi-mur (inset en px) — paroi = 10px total entre 2 pièces
const MARGIN = 28;       // marge autour du bâtiment
const WALL_COLOR = '#3A2E1E';
const TERRACE_STRIPE = '#C8D8B0';

type RoomPhotos = Record<string, string[]>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function m(v: number) { return v * SCALE; }

function getPhotos(room: RoomData, overrides?: RoomPhotos): string[] {
  if (overrides?.[room.id]?.length) return overrides[room.id];
  return room.defaultPhotos;
}

// ─── Mobilier SVG ─────────────────────────────────────────────────────────────
function Furniture({ item, ox, oy }: { item: FurnitureItem; ox: number; oy: number }) {
  const x = ox + item.x * SCALE;
  const y = oy + item.y * SCALE;
  const w = item.w * SCALE;
  const h = item.h * SCALE;
  const cx = x + w / 2;
  const cy = y + h / 2;

  const s: React.CSSProperties = { pointerEvents: 'none' };

  switch (item.type) {
    case 'bed-double':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="3" fill="#D8CCB8" stroke="#9B8A74" strokeWidth="1" />
          {/* Oreillers */}
          <rect x={x + 4} y={y + 4} width={w / 2 - 7} height={h * 0.3} rx="2" fill="#EDE6DC" stroke="#C8B8A0" strokeWidth="0.5" />
          <rect x={x + w / 2 + 3} y={y + 4} width={w / 2 - 7} height={h * 0.3} rx="2" fill="#EDE6DC" stroke="#C8B8A0" strokeWidth="0.5" />
          {/* Couverture */}
          <rect x={x + 4} y={y + h * 0.35} width={w - 8} height={h * 0.6} rx="2" fill="#C8B8A4" stroke="#9B8A74" strokeWidth="0.5" />
        </g>
      );
    case 'bed-single':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="3" fill="#D8CCB8" stroke="#9B8A74" strokeWidth="1" />
          <rect x={x + 3} y={y + 3} width={w - 6} height={h * 0.28} rx="2" fill="#EDE6DC" stroke="#C8B8A0" strokeWidth="0.5" />
          <rect x={x + 3} y={y + h * 0.35} width={w - 6} height={h * 0.6} rx="2" fill="#C8B8A4" stroke="#9B8A74" strokeWidth="0.5" />
        </g>
      );
    case 'sofa':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="5" fill="#C8B8A0" stroke="#9B8A74" strokeWidth="1" />
          {/* Coussins */}
          {[0, 1, 2].map(i => (
            <rect key={i} x={x + 4 + i * (w - 8) / 3} y={y + 4} width={(w - 8) / 3 - 3} height={h - 10} rx="3" fill="#D8C8B0" stroke="#9B8A74" strokeWidth="0.5" />
          ))}
        </g>
      );
    case 'kitchen-counter':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="2" fill="#C8B8A0" stroke="#9B8A74" strokeWidth="1" />
          {/* Plaques */}
          {[0.3, 0.55, 0.75, 1.0].map((fx, i) => (
            <circle key={i} cx={x + fx * 0.4 * w + (i > 1 ? 0.55 * w : 0)} cy={cy} r={h * 0.2} fill="none" stroke="#7A6A58" strokeWidth="0.8" />
          ))}
        </g>
      );
    case 'island':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="4" fill="#D8C8B0" stroke="#9B8A74" strokeWidth="1" />
          <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="2" fill="none" stroke="#9B8A74" strokeWidth="0.5" strokeDasharray="3,2" />
        </g>
      );
    case 'toilet':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h * 0.3} rx="2" fill="#E8E0D8" stroke="#9B8A74" strokeWidth="1" />
          <ellipse cx={cx} cy={y + h * 0.68} rx={w * 0.45} ry={h * 0.35} fill="#E8E0D8" stroke="#9B8A74" strokeWidth="1" />
        </g>
      );
    case 'shower':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="3" fill="#EEF4F8" stroke="#9BB8CC" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.25} fill="none" stroke="#9BB8CC" strokeWidth="1" />
          {/* Lignes eau */}
          {[-1, 0, 1].map(d => (
            <line key={d} x1={cx + d * 5} y1={cy - 5} x2={cx + d * 7} y2={cy + 7} stroke="#9BB8CC" strokeWidth="0.5" />
          ))}
        </g>
      );
    case 'bathtub':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="8" fill="#EEF4F8" stroke="#9BB8CC" strokeWidth="1" />
          <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} rx="6" fill="none" stroke="#9BB8CC" strokeWidth="0.5" />
        </g>
      );
    case 'washer':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="3" fill="#E0EAF0" stroke="#9BB8CC" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={w * 0.35} fill="none" stroke="#9BB8CC" strokeWidth="1" />
        </g>
      );
    case 'wardrobe':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="2" fill="#D8C8B0" stroke="#9B8A74" strokeWidth="1" />
          <line x1={cx} y1={y + 2} x2={cx} y2={y + h - 2} stroke="#9B8A74" strokeWidth="0.8" />
          <circle cx={cx - w / 4} cy={cy} r="2" fill="#9B8A74" />
          <circle cx={cx + w / 4} cy={cy} r="2" fill="#9B8A74" />
        </g>
      );
    case 'table':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="3" fill="#D0C0A8" stroke="#9B8A74" strokeWidth="1" />
        </g>
      );
    case 'tv':
      return (
        <g style={s}>
          <rect x={x} y={y} width={w} height={h} rx="1" fill="#4A4030" stroke="#2C2416" strokeWidth="0.5" />
        </g>
      );
    case 'stairs-up':
    case 'stairs-down':
      return (
        <g style={s} opacity="0.6">
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={x} y1={y + (i + 1) * h / 7}
              x2={x + w} y2={y + (i + 1) * h / 7}
              stroke="#9B8A74" strokeWidth="1"
            />
          ))}
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="#7A6A58" fontFamily="system-ui" fontWeight="600"
            style={{ userSelect: 'none' }}>
            {item.type === 'stairs-up' ? '▲' : '▼'}
          </text>
        </g>
      );
    default:
      return null;
  }
}

// ─── Arc de porte ─────────────────────────────────────────────────────────────
function Door({ door, rx, ry, rw, rh }: { door: DoorSpec; rx: number; ry: number; rw: number; rh: number }) {
  const dw = door.width * SCALE;
  let hx = 0, hy = 0, lx = 0, ly = 0, arcX = 0, arcY = 0;
  const sweep = door.swing === 'in' ? 0 : 1;

  switch (door.wall) {
    case 'top':
      hx = rx + door.pos * rw - dw / 2; hy = ry;
      lx = hx; ly = hy + dw;
      arcX = hx + dw; arcY = hy;
      break;
    case 'bottom':
      hx = rx + door.pos * rw - dw / 2; hy = ry + rh;
      lx = hx; ly = hy - dw;
      arcX = hx + dw; arcY = hy;
      break;
    case 'left':
      hx = rx; hy = ry + door.pos * rh - dw / 2;
      lx = hx + dw; ly = hy;
      arcX = hx; arcY = hy + dw;
      break;
    case 'right':
      hx = rx + rw; hy = ry + door.pos * rh - dw / 2;
      lx = hx - dw; ly = hy;
      arcX = hx; arcY = hy + dw;
      break;
  }

  return (
    <g>
      {/* Ouverture du mur (blanc pour effacer) */}
      {door.wall === 'top' || door.wall === 'bottom' ? (
        <rect x={hx} y={hy - 3} width={dw} height={6} fill="white" />
      ) : (
        <rect x={hx - 3} y={hy} width={6} height={dw} fill="white" />
      )}
      {/* Vantail + arc */}
      <line x1={hx} y1={hy} x2={lx} y2={ly} stroke="#9B8A74" strokeWidth="1" />
      <path
        d={`M ${lx} ${ly} A ${dw} ${dw} 0 0 ${sweep} ${arcX} ${arcY}`}
        fill="none" stroke="#9B8A74" strokeWidth="0.8" strokeDasharray="3,2"
      />
    </g>
  );
}

// ─── Pièce SVG ────────────────────────────────────────────────────────────────
function RoomBlock({
  room,
  ox, oy,
  isHovered, isSelected,
  onHover, onClick,
  hasPhotos,
}: {
  room: RoomData;
  ox: number; oy: number;  // offset du bâtiment dans le SVG
  isHovered: boolean; isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (r: RoomData) => void;
  hasPhotos: boolean;
}) {
  const rx = ox + room.x * SCALE;
  const ry = oy + room.y * SCALE;
  const rw = room.w * SCALE;
  const rh = room.h * SCALE;
  const isInteractive = hasPhotos;

  const fillColor = isHovered ? '#FDEFD8' : room.fill;

  return (
    <g
      onMouseEnter={() => isInteractive && onHover(room.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => isInteractive && onClick(room)}
      style={{ cursor: isInteractive ? 'pointer' : 'default' }}
    >
      {/* Fond de pièce avec inset mur */}
      <rect
        x={rx + WALL} y={ry + WALL}
        width={rw - WALL * 2} height={rh - WALL * 2}
        fill={fillColor}
        style={{ transition: 'fill 0.15s' }}
      />

      {/* Motif terrasse */}
      {room.fill === '#E2EDD8' && (
        <g clipPath={`url(#clip-${room.id})`} opacity="0.4">
          <defs>
            <clipPath id={`clip-${room.id}`}>
              <rect x={rx + WALL} y={ry + WALL} width={rw - WALL * 2} height={rh - WALL * 2} />
            </clipPath>
          </defs>
          {Array.from({ length: 30 }).map((_, i) => (
            <line
              key={i}
              x1={rx + WALL + i * 12 - 20} y1={ry + WALL}
              x2={rx + WALL + i * 12 - 60} y2={ry + rh}
              stroke={TERRACE_STRIPE} strokeWidth="6"
            />
          ))}
        </g>
      )}

      {/* Sélection highlight */}
      {isSelected && (
        <rect
          x={rx + WALL + 1} y={ry + WALL + 1}
          width={rw - WALL * 2 - 2} height={rh - WALL * 2 - 2}
          fill="none" stroke="#C8763A" strokeWidth="2" rx="1"
        />
      )}

      {/* Mobilier */}
      {room.furniture?.map((f, i) => (
        <Furniture key={i} item={f} ox={rx + WALL} oy={ry + WALL} />
      ))}

      {/* Arcs de portes */}
      {room.doors?.map((d, i) => (
        <Door key={i} door={d} rx={rx + WALL} ry={ry + WALL} rw={rw - WALL * 2} rh={rh - WALL * 2} />
      ))}

      {/* Étiquette */}
      {rw > 50 && rh > 40 && (
        <g>
          <text
            x={rx + rw / 2} y={ry + rh / 2 - (room.area ? 8 : 0)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={Math.min(rw, rh) > 60 ? 10 : 8}
            fontFamily="var(--font-space, system-ui)" fontWeight="700"
            fill={isHovered ? '#A85E28' : '#3A2E1E'}
            style={{ userSelect: 'none' }}
          >
            {room.label}
          </text>
          {room.area && (
            <text
              x={rx + rw / 2} y={ry + rh / 2 + 10}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="8"
              fontFamily="var(--font-space, system-ui)"
              fill={isHovered ? '#C8763A' : '#7A6A58'}
              style={{ userSelect: 'none' }}
            >
              {room.area}
            </text>
          )}
        </g>
      )}

      {/* Bouton photo (petit disque orange en haut à droite) */}
      {hasPhotos && (
        <g transform={`translate(${rx + rw - 16}, ${ry + 10})`}>
          <circle cx="0" cy="0" r="9"
            fill={isHovered ? '#C8763A' : '#C8763A'}
            opacity={isHovered ? 1 : 0.8}
            stroke="white" strokeWidth="1.5"
          />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="white" style={{ userSelect: 'none' }}>
            📷
          </text>
        </g>
      )}
    </g>
  );
}

// ─── Modal photos ─────────────────────────────────────────────────────────────
function PhotoModal({ room, photos, onClose, noPhotoLabel }: {
  room: RoomData; photos: string[]; onClose: () => void; noPhotoLabel: string;
}) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="font-semibold text-[#2C2416]">{room.label}{room.area ? ` · ${room.area}` : ''}</span>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {photos.length > 0 ? (
          <div className="relative aspect-[4/3]">
            <Image src={photos[idx]} alt={room.label} fill className="object-cover" sizes="672px" />
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
                      className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
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
export default function FloorPlanDraw({ propertyId, roomPhotos }: { propertyId: string; roomPhotos?: RoomPhotos }) {
  const t = useTranslations('floor_plan');
  const data = FLOOR_PLAN_DATA[propertyId];
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  if (!data) return null;

  const floor: FloorData = data.floors[activeFloorIdx];
  const ox = MARGIN;
  const oy = MARGIN;
  const bw = floor.buildingW * SCALE;
  const bh = floor.buildingH * SCALE;
  const svgW = bw + MARGIN * 2;
  const svgH = bh + MARGIN * 2;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE6DC] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#EDE6DC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#2C2416] text-lg">{t('title')}</h3>
          <p className="text-sm text-[#9B8A74] mt-0.5">{t('hint')}</p>
        </div>
        {/* Légende */}
        <div className="flex gap-3 flex-wrap text-xs text-[#9B8A74]">
          {[
            { color: '#FFF3E8', label: 'Séjour / Cuisine' },
            { color: '#EEF4E8', label: 'Chambre' },
            { color: '#E8F0F8', label: "Salle d'eau / WC" },
            { color: '#E2EDD8', label: 'Terrasse' },
            { color: '#F0EBE3', label: 'Service' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ background: color }} />
              <span className="whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Onglets étages */}
      <div className="flex border-b border-[#EDE6DC] bg-[#FAF7F2]">
        {data.floors.map((f, i) => (
          <button key={f.id} onClick={() => { setActiveFloorIdx(i); setHoveredRoom(null); setSelectedRoom(null); }}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
              i === activeFloorIdx
                ? 'text-[#C8763A] border-[#C8763A] bg-white'
                : 'text-[#9B8A74] border-transparent hover:text-[#5C4F3A]'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Plan SVG */}
      <div className="p-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto"
          style={{ maxHeight: '520px', minWidth: `${Math.min(svgW, 320)}px` }}
        >
          {/* Fond bâtiment (= murs) */}
          <rect x={ox} y={oy} width={bw} height={bh} rx="4" fill={WALL_COLOR} />

          {/* Ombre portée */}
          <rect x={ox + 6} y={oy + 6} width={bw} height={bh} rx="4"
            fill="#1A1008" opacity="0.15" style={{ filter: 'blur(4px)' }} />
          <rect x={ox} y={oy} width={bw} height={bh} rx="4" fill={WALL_COLOR} />

          {/* Pièces */}
          {floor.rooms.map(room => {
            const photos = getPhotos(room, roomPhotos);
            const hasPhotos = room.hasPhotos && photos.length > 0;
            return (
              <RoomBlock
                key={room.id}
                room={room}
                ox={ox} oy={oy}
                isHovered={hoveredRoom === room.id}
                isSelected={selectedRoom?.id === room.id}
                onHover={setHoveredRoom}
                onClick={r => setSelectedRoom(r)}
                hasPhotos={hasPhotos}
              />
            );
          })}

          {/* Boussole */}
          <g transform={`translate(${svgW - 30}, 22)`} opacity="0.5">
            <circle cx="0" cy="0" r="14" fill="white" stroke="#D4C8B8" strokeWidth="1" />
            <text x="0" y="-5" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold" fill="#3A2E1E"
              style={{ userSelect: 'none' }}>N</text>
            <polygon points="0,-12 3,-2 -3,-2" fill="#C8763A" />
            <polygon points="0,12 3,2 -3,2" fill="#9B8A74" />
          </g>
        </svg>
      </div>

      {/* Chips des pièces cliquables */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {floor.rooms.filter(r => r.hasPhotos).map(room => {
          const photos = getPhotos(room, roomPhotos);
          const hasPh = photos.length > 0;
          const isSel = selectedRoom?.id === room.id;
          return (
            <button key={room.id}
              onClick={() => hasPh && setSelectedRoom(room)}
              onMouseEnter={() => hasPh && setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isSel
                  ? 'bg-[#C8763A] text-white border-[#C8763A]'
                  : hasPh
                  ? 'border-[#C8763A]/40 text-[#C8763A] hover:bg-[#C8763A]/10 hover:border-[#C8763A]'
                  : 'border-gray-200 text-gray-400 cursor-default'
              }`}>
              <span>{room.label}</span>
              {hasPh && (
                <span className={`rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ${isSel ? 'bg-white text-[#C8763A]' : 'bg-[#C8763A] text-white'}`}>
                  {photos.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal */}
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
