'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FLOOR_HOTSPOTS, type FloorHotspots, type HotspotDef } from '@/lib/floor-plan-hotspots';

interface Props {
  propertyId: string;
  initialPositions: Record<string, { x: number; y: number }>;
}

export default function HotspotPositionEditor({ propertyId, initialPositions }: Props) {
  const floors = FLOOR_HOTSPOTS[propertyId];
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  // positions: { hotspotId: { x: %, y: % } }
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(initialPositions);
  const [dragging, setDragging] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const floor: FloorHotspots = floors[activeFloorIdx];

  const getPos = useCallback((h: HotspotDef) => {
    return positions[h.id] ?? { x: h.x, y: h.y };
  }, [positions]);

  const handleMouseDown = useCallback((e: React.MouseEvent, hotspotId: string) => {
    e.preventDefault();
    setDragging(hotspotId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPositions(prev => ({
      ...prev,
      [dragging]: {
        x: Math.max(1, Math.min(99, x)),
        y: Math.max(1, Math.min(99, y)),
      },
    }));
    setSaved(false);
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  // Touch support
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || !imgContainerRef.current) return;
    const touch = e.touches[0];
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setPositions(prev => ({
      ...prev,
      [dragging]: {
        x: Math.max(1, Math.min(99, x)),
        y: Math.max(1, Math.min(99, y)),
      },
    }));
    setSaved(false);
  }, [dragging]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/floor-plans/${propertyId}/hotspots`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(positions),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }, [propertyId, positions]);

  const resetHotspot = useCallback((hotspotId: string) => {
    setPositions(prev => {
      const next = { ...prev };
      delete next[hotspotId];
      return next;
    });
    setSaved(false);
  }, []);

  const aspectRatio = floor.id === 'rdc' ? '2700/1155' : floor.id === 'r1' ? '2699/1286' : '2725/1369';

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <a href="/admin/floor-plans" className="text-sm text-[#9B8A74] hover:text-[#5C4F3A]">← Retour</a>
            <h1 className="text-xl font-bold text-[#2C2416] mt-1">Positionner les boutons sur le plan</h1>
            <p className="text-sm text-[#9B8A74]">
              <strong>Glissez</strong> les boutons oranges pour les placer sur la bonne pièce
            </p>
          </div>
          <button onClick={save} disabled={saving}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              saved ? 'bg-green-500 text-white' : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
            } disabled:opacity-60`}>
            {saving ? 'Enregistrement...' : saved ? '✓ Enregistré !' : 'Enregistrer les positions'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
        )}

        {/* Onglets étages */}
        <div className="flex border-b border-[#EDE6DC] bg-white rounded-t-xl overflow-hidden mb-0">
          {floors.map((f, i) => (
            <button key={f.id} onClick={() => setActiveFloorIdx(i)}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                i === activeFloorIdx
                  ? 'text-[#C8763A] border-[#C8763A] bg-[#FFF8F2]'
                  : 'text-[#9B8A74] border-transparent hover:text-[#5C4F3A] bg-white'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Zone plan + hotspots draggables */}
        <div className="bg-white border border-[#EDE6DC] rounded-b-xl overflow-hidden">
          <div
            ref={imgContainerRef}
            className="relative w-full select-none"
            style={{ aspectRatio, cursor: dragging ? 'grabbing' : 'default', touchAction: 'none' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <Image
              src={floor.image}
              alt={`Plan ${floor.label}`}
              fill
              className="object-contain pointer-events-none"
              sizes="1000px"
              priority
            />

            {/* Hotspots draggables */}
            {floor.hotspots.map(hotspot => {
              const pos = getPos(hotspot);
              const isDragging = dragging === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: isDragging ? 20 : 10 }}
                  onMouseDown={e => handleMouseDown(e, hotspot.id)}
                  onTouchStart={e => { e.preventDefault(); setDragging(hotspot.id); }}
                >
                  <div className={`
                    relative flex items-center justify-center rounded-full transition-all
                    cursor-grab active:cursor-grabbing
                    ${isDragging
                      ? 'w-12 h-12 bg-[#A85E28] shadow-xl scale-110 ring-2 ring-white'
                      : hotspot.hasPhotos
                      ? 'w-9 h-9 bg-[#C8763A] shadow-md hover:scale-110 ring-2 ring-white'
                      : 'w-7 h-7 bg-[#9B8A74] shadow hover:scale-110 ring-1 ring-white'
                    }
                  `}>
                    <span className="text-white text-xs font-bold pointer-events-none">
                      {hotspot.hasPhotos ? '📷' : '·'}
                    </span>
                  </div>

                  {/* Label permanent visible */}
                  <div className={`
                    absolute left-1/2 -translate-x-1/2 top-full mt-1
                    bg-[#2C2416]/90 text-white text-[9px] font-semibold
                    px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none shadow
                    ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}>
                    {hotspot.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tableau des positions */}
        <div className="mt-5 bg-white rounded-xl border border-[#EDE6DC] p-4">
          <h2 className="font-semibold text-[#2C2416] text-sm mb-3">Positions actuelles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {floor.hotspots.map(hotspot => {
              const pos = getPos(hotspot);
              const isCustom = Boolean(positions[hotspot.id]);
              return (
                <div key={hotspot.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${
                    isCustom ? 'border-[#C8763A]/30 bg-[#FFF8F2]' : 'border-[#EDE6DC]'
                  }`}>
                  <div>
                    <div className="font-medium text-[#2C2416] truncate max-w-[100px]">{hotspot.label}</div>
                    <div className="text-[#9B8A74]">{pos.x.toFixed(1)}% / {pos.y.toFixed(1)}%</div>
                  </div>
                  {isCustom && (
                    <button onClick={() => resetHotspot(hotspot.id)}
                      className="text-[#9B8A74] hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                      title="Réinitialiser">✕</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton bas */}
        <div className="mt-5 flex justify-end">
          <button onClick={save} disabled={saving}
            className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-sm ${
              saved ? 'bg-green-500 text-white' : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
            } disabled:opacity-60`}>
            {saving ? 'Enregistrement...' : saved ? '✓ Positions enregistrées !' : 'Enregistrer les positions'}
          </button>
        </div>
      </div>
    </div>
  );
}
