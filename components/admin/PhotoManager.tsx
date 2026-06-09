'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  propertyId: string;
  propertyName: string;
  initialImages: string[];
  hasUpload: boolean;   // BLOB_READ_WRITE_TOKEN configuré ?
}

export default function PhotoManager({ propertyId, propertyName, initialImages, hasUpload }: Props) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null); // index de la photo en grand
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const lightboxPrev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length]);
  const lightboxNext = useCallback(() => setLightbox(i => i !== null ? (i + 1) % images.length : null), [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, closeLightbox, lightboxPrev, lightboxNext]);

  // ── Drag & Drop pour réordonner ───────────────────────────────────────────
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...images];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setImages(next);
    setSaved(false);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // ── Supprimer une photo ───────────────────────────────────────────────────
  const removeImage = useCallback((idx: number) => {
    if (!confirm('Retirer cette photo de la galerie ?')) return;
    setImages(prev => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }, []);

  // ── Monter / Descendre ────────────────────────────────────────────────────
  const moveImage = useCallback((idx: number, dir: -1 | 1) => {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setImages(next);
    setSaved(false);
  }, [images]);

  // ── Mettre en photo principale ────────────────────────────────────────────
  const setMain = useCallback((idx: number) => {
    if (idx === 0) return;
    const next = [...images];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    setImages(next);
    setSaved(false);
  }, [images]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (files: FileList) => {
    if (!hasUpload) return;
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch(`/api/photos/${propertyId}/upload`, {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); break; }
        uploaded.push(data.url);
      } catch {
        setError('Erreur lors de l\'upload');
        break;
      }
    }

    if (uploaded.length > 0) {
      setImages(prev => [...prev, ...uploaded]);
      setSaved(false);
    }
    setUploading(false);
  }, [propertyId, hasUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragEnterZone = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  // ── Sauvegarder ───────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/photos/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }, [propertyId, images]);

  // ── Réinitialiser aux photos par défaut ───────────────────────────────────
  const reset = useCallback(async () => {
    if (!confirm('Réinitialiser aux photos par défaut ?')) return;
    setSaving(true);
    try {
      await fetch(`/api/photos/${propertyId}`, { method: 'DELETE' });
      const res = await fetch(`/api/photos/${propertyId}`);
      const data = await res.json();
      setImages(data.images);
      setSaved(false);
    } catch { setError('Erreur'); }
    finally { setSaving(false); }
  }, [propertyId]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <a href="/admin/photos" className="text-sm text-[#9B8A74] hover:text-[#5C4F3A] transition-colors">
              ← Retour
            </a>
            <h1 className="text-xl font-bold text-[#2C2416] mt-1">{propertyName}</h1>
            <p className="text-sm text-[#9B8A74]">
              {images.length} photo{images.length > 1 ? 's' : ''} · Glissez pour réordonner · La 1ère = photo principale
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={reset} className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E8DCC8] text-[#9B8A74] hover:text-[#5C4F3A] hover:border-[#C8B8A0] transition-all">
              Réinitialiser
            </button>
            <button
              onClick={save}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                saved ? 'bg-green-500 text-white' : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
              } disabled:opacity-60`}
            >
              {saving ? 'Enregistrement...' : saved ? '✓ Enregistré !' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Zone d'upload */}
        {hasUpload ? (
          <div
            className="mb-6 border-2 border-dashed border-[#D4C8B8] rounded-2xl p-6 text-center hover:border-[#C8763A] transition-colors cursor-pointer bg-white"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnterZone}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropZone}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-3 text-[#9B8A74]">
                <div className="w-5 h-5 border-2 border-[#C8763A] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Upload en cours...</span>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-2">📤</div>
                <p className="text-[#5C4F3A] font-medium text-sm">Glissez des photos ici ou cliquez pour sélectionner</p>
                <p className="text-[#9B8A74] text-xs mt-1">JPG, PNG, WebP · Max 10 MB par photo</p>
              </>
            )}
            <input
              id={uploadId}
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Upload désactivé</strong> — Pour activer l'upload de photos, ajoutez la variable d'environnement <code className="bg-amber-100 px-1 rounded">BLOB_READ_WRITE_TOKEN</code> dans les paramètres Vercel de votre projet.
          </div>
        )}

        {/* Grille de photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((src, idx) => (
            <div
              key={src + idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                dragOverIdx === idx && dragIdx !== idx
                  ? 'border-[#C8763A] scale-105 shadow-lg'
                  : dragIdx === idx
                  ? 'border-[#C8763A]/50 opacity-50'
                  : idx === 0
                  ? 'border-[#C8763A]'
                  : 'border-transparent hover:border-[#D4C8B8]'
              }`}
            >
              {/* Photo */}
              <div className="aspect-[4/3] relative bg-gray-100">
                <Image
                  src={src}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  draggable={false}
                />

                {/* Badge photo principale */}
                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-[#C8763A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    ★ Principale
                  </div>
                )}

                {/* Numéro */}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>

                {/* Overlay actions (au survol) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {/* Bouton loupe */}
                  <button
                    onClick={e => { e.stopPropagation(); openLightbox(idx); }}
                    className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-lg p-1.5 transition-colors"
                    title="Voir en grand"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                  </button>
                  {idx !== 0 && (
                    <button
                      onClick={() => setMain(idx)}
                      className="w-full bg-[#C8763A] hover:bg-[#A85E28] text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-colors"
                    >
                      ★ Mettre en principale
                    </button>
                  )}
                  <div className="flex gap-1.5 w-full">
                    <button
                      onClick={() => moveImage(idx, -1)}
                      disabled={idx === 0}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1 rounded-lg disabled:opacity-30 transition-colors"
                      title="Déplacer avant"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveImage(idx, 1)}
                      disabled={idx === images.length - 1}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-1 rounded-lg disabled:opacity-30 transition-colors"
                      title="Déplacer après"
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={() => removeImage(idx)}
                    className="w-full bg-red-500/80 hover:bg-red-600 text-white text-[10px] font-medium py-1 px-2 rounded-lg transition-colors"
                  >
                    ✕ Retirer
                  </button>
                </div>
              </div>

              {/* Nom du fichier */}
              <div className="px-2 py-1.5 bg-white">
                <p className="text-[10px] text-[#9B8A74] truncate">{src.split('/').pop()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Image */}
            <div
              className="relative max-w-5xl max-h-[90vh] w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ maxHeight: '85vh' }}>
                <img
                  src={images[lightbox]}
                  alt={`Photo ${lightbox + 1}`}
                  className="w-full h-full object-contain rounded-xl shadow-2xl"
                  style={{ maxHeight: '85vh' }}
                />
              </div>

              {/* Compteur */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {lightbox + 1} / {images.length}
              </div>

              {/* Fermer */}
              <button
                onClick={closeLightbox}
                className="absolute -top-4 -right-4 bg-white text-[#2C2416] rounded-full w-9 h-9 flex items-center justify-center font-bold hover:bg-gray-100 shadow-lg transition-colors text-lg"
              >
                ✕
              </button>

              {/* Précédent */}
              {images.length > 1 && (
                <button
                  onClick={lightboxPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-lg"
                >
                  ←
                </button>
              )}

              {/* Suivant */}
              {images.length > 1 && (
                <button
                  onClick={lightboxNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-lg"
                >
                  →
                </button>
              )}

              {/* Nom du fichier */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 text-xs px-3 py-1 rounded-full truncate max-w-xs">
                {images[lightbox].split('/').pop()}
              </div>
            </div>
          </div>
        )}

        {/* Bouton bas */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-sm ${
              saved ? 'bg-green-500 text-white' : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
            } disabled:opacity-60`}
          >
            {saving ? 'Enregistrement...' : saved ? '✓ Modifications enregistrées !' : 'Enregistrer les modifications'}
          </button>
        </div>

      </div>
    </div>
  );
}
