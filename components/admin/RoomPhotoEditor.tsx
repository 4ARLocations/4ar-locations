'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FLOOR_PLAN_DATA } from '@/lib/floor-plan-data';

// Adapter: RoomDef / FloorDef shape for admin UI (mapped from new data structure)
type RoomDef = { id: string; label: string; icon: string; x: number; y: number; w: number; h: number; fill: string; defaultPhotos: string[] };
type FloorDef = { id: string; label: string; viewBox: string; width: number; height: number; rooms: RoomDef[] };

function buildFloorDefs(propertyId: string): FloorDef[] {
  const data = FLOOR_PLAN_DATA[propertyId];
  if (!data) return [];
  return data.floors.map(f => ({
    id: f.id,
    label: f.label,
    viewBox: `0 0 ${f.buildingW * 60 + 56} ${f.buildingH * 60 + 56}`,
    width: f.buildingW * 60 + 56,
    height: f.buildingH * 60 + 56,
    rooms: f.rooms.map(r => ({
      id: r.id,
      label: r.label,
      icon: r.fill === '#EEF4E8' ? '🛏️'
        : r.fill === '#E8F0F8' ? '🚿'
        : r.fill === '#E2EDD8' ? '☀️'
        : r.fill === '#F0EBE3' ? '📦'
        : r.fill === '#E8E0D8' ? '↕️'
        : '🛋️',
      x: 28 + r.x * 60,
      y: 28 + r.y * 60,
      w: r.w * 60,
      h: r.h * 60,
      fill: r.fill,
      defaultPhotos: r.defaultPhotos,
    })),
  }));
}

interface Props {
  propertyId: string;
  propertyImages: string[];
  initialRoomPhotos: Record<string, string[]>;
}

// ─── Mini SVG plan (sélection de pièce) ─────────────────────────────────────

function RoomSelectShape({
  room,
  isSelected,
  hasPhotos,
  onSelect,
}: {
  room: RoomDef;
  isSelected: boolean;
  hasPhotos: boolean;
  onSelect: (room: RoomDef) => void;
}) {
  return (
    <g onClick={() => onSelect(room)} style={{ cursor: 'pointer' }}>
      {/* Shadow */}
      <rect x={room.x + 5} y={room.y + 5} width={room.w} height={room.h} rx="5" fill="#D4C8B8" />
      {/* Face */}
      <rect
        x={room.x} y={room.y} width={room.w} height={room.h} rx="5"
        fill={isSelected ? '#FDEFD8' : room.fill}
        stroke={isSelected ? '#C8763A' : '#C8B8A0'}
        strokeWidth={isSelected ? 2.5 : 1}
      />
      {/* Icon */}
      <text
        x={room.x + room.w / 2} y={room.y + room.h / 2 - (room.h > 60 ? 13 : 5)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={room.h > 80 ? 18 : 13}
        style={{ userSelect: 'none' }}
      >
        {room.icon}
      </text>
      {/* Label */}
      <text
        x={room.x + room.w / 2} y={room.y + room.h / 2 + (room.h > 60 ? 12 : 8)}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={room.w > 120 ? 10 : 8}
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        fill={isSelected ? '#A85E28' : '#5C4F3A'}
        style={{ userSelect: 'none' }}
      >
        {room.label}
      </text>
      {/* Badge nb photos */}
      {hasPhotos && (
        <circle cx={room.x + room.w - 10} cy={room.y + 10} r="7"
          fill="#C8763A" />
      )}
      {hasPhotos && (
        <text
          x={room.x + room.w - 10} y={room.y + 10}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="8" fill="white" fontWeight="bold"
          style={{ userSelect: 'none' }}
        >
          ✓
        </text>
      )}
    </g>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

export default function RoomPhotoEditor({ propertyId, propertyImages, initialRoomPhotos }: Props) {
  const floors = buildFloorDefs(propertyId);
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomDef | null>(null);
  // roomPhotos : { roomId: ['/images/...', ...] }
  const [roomPhotos, setRoomPhotos] = useState<Record<string, string[]>>(initialRoomPhotos);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const floor: FloorDef = floors[activeFloorIdx];

  // Sélectionner une pièce depuis le plan
  const handleSelectRoom = useCallback((room: RoomDef) => {
    setSelectedRoom(room);
    setSaved(false);
  }, []);

  // Cocher/décocher une photo pour la pièce sélectionnée
  const togglePhoto = useCallback((photo: string) => {
    if (!selectedRoom) return;
    setRoomPhotos((prev) => {
      const current = prev[selectedRoom.id] ?? [];
      const next = current.includes(photo)
        ? current.filter((p) => p !== photo)
        : [...current, photo];
      return { ...prev, [selectedRoom.id]: next };
    });
    setSaved(false);
  }, [selectedRoom]);

  // Supprimer toutes les photos d'une pièce (revenir aux defaults)
  const clearRoom = useCallback(() => {
    if (!selectedRoom) return;
    setRoomPhotos((prev) => {
      const next = { ...prev };
      delete next[selectedRoom.id];
      return next;
    });
    setSaved(false);
  }, [selectedRoom]);

  // Sauvegarder dans Redis
  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/floor-plans/${propertyId}/rooms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomPhotos),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }, [propertyId, roomPhotos]);

  const selectedPhotos = selectedRoom ? (roomPhotos[selectedRoom.id] ?? selectedRoom.defaultPhotos) : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <a href="/admin/floor-plans" className="text-sm text-[#9B8A74] hover:text-[#5C4F3A] transition-colors">
              ← Retour aux plans
            </a>
            <h1 className="text-xl font-bold text-[#2C2416] mt-1">
              Photos par pièce
            </h1>
            <p className="text-sm text-[#9B8A74]">
              Cliquez sur une pièce du plan pour choisir ses photos
            </p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
            } disabled:opacity-60`}
          >
            {saving ? 'Enregistrement...' : saved ? '✓ Enregistré !' : 'Enregistrer'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Colonne gauche : plan SVG ── */}
          <div className="bg-white rounded-2xl border border-[#EDE6DC] overflow-hidden">

            {/* Onglets étages */}
            <div className="flex border-b border-[#EDE6DC] bg-[#FAF7F2]">
              {floors.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => { setActiveFloorIdx(i); setSelectedRoom(null); }}
                  className={`px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                    i === activeFloorIdx
                      ? 'text-[#C8763A] border-[#C8763A] bg-white'
                      : 'text-[#9B8A74] border-transparent hover:text-[#5C4F3A]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* SVG */}
            <div className="p-4">
              <svg
                viewBox={floor.viewBox}
                className="w-full h-auto"
                style={{ maxHeight: '360px' }}
              >
                <rect x="10" y="10" width={floor.width - 20} height={floor.height - 20}
                  rx="8" fill="#F5F0EB" stroke="#A89880" strokeWidth="2" />
                {floor.rooms.map((room) => (
                  <RoomSelectShape
                    key={room.id}
                    room={room}
                    isSelected={selectedRoom?.id === room.id}
                    hasPhotos={(roomPhotos[room.id]?.length ?? 0) > 0 ||
                                (!(room.id in roomPhotos) && room.defaultPhotos.length > 0)}
                    onSelect={handleSelectRoom}
                  />
                ))}
              </svg>
            </div>

            {/* Liste des pièces */}
            <div className="px-4 pb-4 flex flex-wrap gap-1.5">
              {floor.rooms.map((room) => {
                const photos = roomPhotos[room.id] ?? room.defaultPhotos;
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#C8763A] text-white border-[#C8763A]'
                        : 'border-[#E8DCC8] text-[#5C4F3A] hover:border-[#C8763A] hover:text-[#C8763A]'
                    }`}
                  >
                    <span>{room.icon}</span>
                    <span>{room.label}</span>
                    {photos.length > 0 && (
                      <span className={`rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ${isSelected ? 'bg-white text-[#C8763A]' : 'bg-[#C8763A] text-white'}`}>
                        {photos.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Colonne droite : sélecteur de photos ── */}
          <div className="bg-white rounded-2xl border border-[#EDE6DC] overflow-hidden">
            {selectedRoom ? (
              <>
                {/* Titre pièce */}
                <div className="px-5 py-4 border-b border-[#EDE6DC] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedRoom.icon}</span>
                    <div>
                      <div className="font-semibold text-[#2C2416] text-sm">{selectedRoom.label}</div>
                      <div className="text-xs text-[#9B8A74]">
                        {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} sélectionnée{selectedPhotos.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={clearRoom}
                    className="text-xs text-[#9B8A74] hover:text-red-500 transition-colors underline"
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* Grille photos */}
                <div className="p-4">
                  <p className="text-xs text-[#9B8A74] mb-3">
                    Cochez les photos à afficher pour cette pièce :
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {propertyImages.map((photo) => {
                      const photos = roomPhotos[selectedRoom.id] ?? selectedRoom.defaultPhotos;
                      const checked = photos.includes(photo);
                      return (
                        <button
                          key={photo}
                          onClick={() => togglePhoto(photo)}
                          className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                            checked
                              ? 'border-[#C8763A] shadow-md shadow-[#C8763A]/20'
                              : 'border-transparent hover:border-[#E8DCC8]'
                          }`}
                        >
                          <Image
                            src={photo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="150px"
                          />
                          {/* Overlay checkmark */}
                          {checked && (
                            <div className="absolute inset-0 bg-[#C8763A]/20 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-[#C8763A] flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                          {/* Filename */}
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-[9px] truncate">
                            {photo.split('/').pop()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-10 text-center">
                <div>
                  <div className="text-5xl mb-4">👆</div>
                  <p className="text-[#9B8A74] text-sm">
                    Cliquez sur une pièce du plan<br />pour choisir ses photos
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Récap global */}
        <div className="mt-6 bg-white rounded-2xl border border-[#EDE6DC] p-5">
          <h2 className="font-semibold text-[#2C2416] text-sm mb-3">Récapitulatif — toutes les pièces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {floors.flatMap((f) =>
              f.rooms.map((room) => {
                const photos = roomPhotos[room.id] ?? room.defaultPhotos;
                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      const floorIdx = floors.findIndex((fl) => fl.rooms.some((r) => r.id === room.id));
                      if (floorIdx !== -1) setActiveFloorIdx(floorIdx);
                      handleSelectRoom(room);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#EDE6DC] hover:border-[#C8763A] cursor-pointer transition-colors group"
                  >
                    <span>{room.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#2C2416] truncate group-hover:text-[#C8763A] transition-colors">
                        {room.label}
                      </div>
                      <div className="text-[10px] text-[#9B8A74]">
                        {photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? 's' : ''}` : 'Aucune'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bouton bas de page */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-sm ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
            } disabled:opacity-60`}
          >
            {saving ? 'Enregistrement...' : saved ? '✓ Modifications enregistrées !' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}
