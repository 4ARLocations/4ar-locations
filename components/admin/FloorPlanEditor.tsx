'use client';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PropertyFloorPlan, FloorPlanFloor, Hotspot } from '@/lib/floor-plans';

interface Props {
  propertyId: string;
  initialFloorPlan: PropertyFloorPlan;
  propertyImages: string[];
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FloorPlanEditor({ propertyId, initialFloorPlan, propertyImages }: Props) {
  const [floorPlan, setFloorPlan] = useState<PropertyFloorPlan>(initialFloorPlan);
  const [activeFloor, setActiveFloor] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  // Modal pour créer/éditer un hotspot
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formPhoto, setFormPhoto] = useState('');

  const imageRef = useRef<HTMLDivElement>(null);

  const floor = floorPlan.floors[activeFloor];

  // Calculer position relative au clic sur l'image
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPos({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    setEditingHotspot(null);
    setFormLabel('');
    setFormPhoto('');
  }, []);

  const openEdit = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHotspot(hotspot);
    setPendingPos(null);
    setFormLabel(hotspot.label);
    setFormPhoto(hotspot.photoUrl ?? '');
  };

  const updateFloor = (updatedFloor: FloorPlanFloor) => {
    setFloorPlan((prev) => ({
      ...prev,
      floors: prev.floors.map((f, i) => (i === activeFloor ? updatedFloor : f)),
    }));
  };

  const confirmAdd = () => {
    if (!pendingPos || !formLabel.trim()) return;
    const newHotspot: Hotspot = {
      id: uid(),
      label: formLabel.trim(),
      x: pendingPos.x,
      y: pendingPos.y,
      photoUrl: formPhoto || undefined,
    };
    updateFloor({ ...floor, hotspots: [...floor.hotspots, newHotspot] });
    setPendingPos(null);
    setFormLabel('');
    setFormPhoto('');
  };

  const confirmEdit = () => {
    if (!editingHotspot || !formLabel.trim()) return;
    updateFloor({
      ...floor,
      hotspots: floor.hotspots.map((h) =>
        h.id === editingHotspot.id
          ? { ...h, label: formLabel.trim(), photoUrl: formPhoto || undefined }
          : h
      ),
    });
    setEditingHotspot(null);
  };

  const deleteHotspot = (id: string) => {
    updateFloor({ ...floor, hotspots: floor.hotspots.filter((h) => h.id !== id) });
    setEditingHotspot(null);
  };

  const save = async () => {
    setSaving(true);
    setSavedOk(false);
    try {
      const res = await fetch(`/api/floor-plans/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(floorPlan),
      });
      if (res.ok) setSavedOk(true);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setPendingPos(null);
    setEditingHotspot(null);
  };

  const isModalOpen = pendingPos !== null || editingHotspot !== null;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8DCC8] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/floor-plans" className="text-[#9B8A74] hover:text-[#5C4F3A] text-sm transition-colors">
            ← Retour
          </Link>
          <h1 className="font-bold text-[#2C2416]">Éditeur de plan</h1>
        </div>
        <div className="flex items-center gap-3">
          {savedOk && <span className="text-xs text-green-600 font-medium">✓ Sauvegardé</span>}
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#C8763A] hover:bg-[#A85E28] text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Instructions */}
        <div className="bg-[#FFF8F0] border border-[#F5DCC0] rounded-xl p-4 mb-6 text-sm text-[#7A5230]">
          <strong>Comment utiliser :</strong> Cliquez sur n'importe quelle pièce du plan pour y ajouter un point cliquable. Entrez le nom de la pièce et choisissez une photo. Cliquez sur un point existant pour le modifier. N'oubliez pas de sauvegarder !
        </div>

        {/* Onglets étages */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {floorPlan.floors.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFloor === i
                  ? 'bg-[#C8763A] text-white shadow-sm'
                  : 'bg-white border border-[#E8DCC8] text-[#5C4F3A] hover:bg-[#F0EBE3]'
              }`}
            >
              {f.label}
              {f.hotspots.length > 0 && (
                <span className="ml-1.5 bg-white/30 text-xs rounded-full px-1.5 py-0.5">
                  {f.hotspots.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plan image + hotspots */}
        <div className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden shadow-sm">
          <div
            ref={imageRef}
            className="relative w-full cursor-crosshair select-none"
            style={{ aspectRatio: '4/3' }}
            onClick={handleImageClick}
          >
            <Image
              src={floor.imageUrl}
              alt={`Plan ${floor.label}`}
              fill
              className="object-contain pointer-events-none"
              sizes="800px"
            />

            {/* Hotspots existants */}
            {floor.hotspots.map((h) => (
              <button
                key={h.id}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                onClick={(e) => openEdit(h, e)}
                title={`Modifier : ${h.label}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
              >
                <span className="relative flex h-6 w-6">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#C8763A] opacity-40 animate-ping" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[#C8763A] border-2 border-white shadow-lg items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </span>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#2C2416] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {h.label}
                </span>
              </button>
            ))}
          </div>

          {/* Liste des hotspots en bas */}
          {floor.hotspots.length > 0 && (
            <div className="px-5 py-4 border-t border-[#F0EBE3]">
              <p className="text-xs font-semibold text-[#9B8A74] uppercase tracking-wider mb-3">Points de cet étage</p>
              <div className="space-y-2">
                {floor.hotspots.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 text-sm">
                    <span className="w-3 h-3 rounded-full bg-[#C8763A] flex-shrink-0" />
                    <span className="flex-1 text-[#2C2416] font-medium">{h.label}</span>
                    {h.photoUrl && (
                      <span className="text-xs text-[#9B8A74]">📷 photo</span>
                    )}
                    <button
                      onClick={(e) => openEdit(h, e)}
                      className="text-xs text-[#C8763A] hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteHotspot(h.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal créer/modifier hotspot */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 border-b border-[#F0EBE3]">
              <h3 className="font-bold text-[#2C2416] text-lg">
                {pendingPos ? 'Ajouter un point' : `Modifier : ${editingHotspot?.label}`}
              </h3>
              {pendingPos && (
                <p className="text-xs text-[#9B8A74] mt-1">
                  Position : {pendingPos.x.toFixed(1)}% / {pendingPos.y.toFixed(1)}%
                </p>
              )}
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Nom de la pièce */}
              <div>
                <label className="block text-sm font-medium text-[#5C4F3A] mb-1">Nom de la pièce *</label>
                <input
                  type="text"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="ex: Cuisine, Chambre 1, WC…"
                  className="w-full border border-[#D8CFC4] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8763A]/30 focus:border-[#C8763A]"
                  autoFocus
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-[#5C4F3A] mb-2">Photo de la pièce</label>
                {propertyImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {/* Option "pas de photo" */}
                    <button
                      onClick={() => setFormPhoto('')}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs text-[#9B8A74] transition-colors ${
                        formPhoto === '' ? 'border-[#C8763A] bg-[#FFF8F0]' : 'border-[#E8DCC8] hover:border-[#C8763A]/50'
                      }`}
                    >
                      Aucune
                    </button>
                    {propertyImages.map((img) => (
                      <button
                        key={img}
                        onClick={() => setFormPhoto(img)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          formPhoto === img ? 'border-[#C8763A]' : 'border-[#E8DCC8] hover:border-[#C8763A]/50'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9B8A74]">Aucune photo disponible pour ce logement.</p>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              {editingHotspot && (
                <button
                  onClick={() => deleteHotspot(editingHotspot.id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#9B8A74] hover:text-[#5C4F3A] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={pendingPos ? confirmAdd : confirmEdit}
                disabled={!formLabel.trim()}
                className="bg-[#C8763A] hover:bg-[#A85E28] text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {pendingPos ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
