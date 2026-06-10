'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ReviewFormProps {
  propertyId: string;
  propertyName: string;
}

export default function ReviewForm({ propertyId, propertyName }: ReviewFormProps) {
  const t = useTranslations('review');
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ author: '', email: '', date: '', comment: '' });

  // Photos
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ratingLabels = ['', t('rating_1'), t('rating_2'), t('rating_3'), t('rating_4'), t('rating_5')];

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = 3 - photoFiles.length;
    const toAdd = files.slice(0, remaining);
    setPhotoFiles((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(f);
    });
    // Reset input pour pouvoir re-sélectionner le même fichier
    e.target.value = '';
  };

  const handlePhotoRemove = (idx: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photoFiles.length === 0) return [];
    setPhotoUploading(true);
    try {
      const urls = await Promise.all(
        photoFiles.map(async (file) => {
          const fd = new FormData();
          fd.append('file', file);
          const res = await fetch('/api/review/upload-photo', { method: 'POST', body: fd });
          if (!res.ok) throw new Error('Upload échoué');
          const data = await res.json();
          return data.url as string;
        })
      );
      return urls;
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError(t('error_rating')); return; }
    if (!form.comment.trim()) { setError(t('error_comment')); return; }
    setError('');
    setLoading(true);
    try {
      const photos = await uploadPhotos();
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, propertyName, ...form, rating, photos }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(t('error_generic'));
      }
    } catch {
      setError(t('error_connection'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#C8763A]/40 text-[#C8763A] rounded-xl py-3 px-4 hover:bg-[#C8763A]/5 transition-colors text-sm font-medium"
      >
        <span>✍️</span>
        <span>{t('leave_review')}</span>
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#6B7C45]/10 border border-[#6B7C45]/30 rounded-xl p-5 text-center">
        <div className="text-3xl mb-2">🙏</div>
        <p className="font-bold text-[#2C2416] text-sm">{t('thank_you')}</p>
        <p className="text-[#5C4F3A] text-xs mt-1">{t('published')}</p>
      </div>
    );
  }

  const inputClass = "w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2] transition-colors";

  return (
    <div className="bg-white border border-[#E8DCC8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-[#2C2416] text-sm">{t('title')}</h4>
        <button onClick={() => setOpen(false)} className="text-[#9B8A74] hover:text-[#2C2416] text-lg leading-none">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Étoiles */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-2">{t('rating')}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-[#E8DCC8]'}>★</span>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs text-[#9B8A74] self-center">{ratingLabels[rating]}</span>
            )}
          </div>
        </div>

        {/* Nom + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#5C4F3A] mb-1">{t('first_name')}</label>
            <input required type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
              className={inputClass} placeholder="Marie" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5C4F3A] mb-1">{t('email')}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass} placeholder="marie@..." />
          </div>
        </div>

        {/* Période */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-1">{t('stay_period')}</label>
          <input type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass} />
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-1">{t('comment_label')}</label>
          <textarea required rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className={`${inputClass} resize-none`} placeholder={t('comment_placeholder')} />
        </div>

        {/* Photos */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-2">
            📷 Photos de votre séjour
            <span className="text-[#9B8A74] font-normal ml-1">(optionnel — max 3 photos)</span>
          </label>

          {photoPreviews.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {photoPreviews.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E8DCC8] group">
                  <Image src={src} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handlePhotoRemove(idx)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {photoFiles.length < 3 && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-dashed border-[#E8DCC8] rounded-xl px-4 py-2.5 text-xs text-[#9B8A74] hover:border-[#C8763A]/40 hover:text-[#C8763A] transition-colors"
              >
                <span>📎</span>
                <span>Ajouter {photoFiles.length === 0 ? 'des photos' : 'une photo'} ({photoFiles.length}/3)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                multiple
                className="hidden"
                onChange={handlePhotoAdd}
              />
            </>
          )}
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" disabled={loading || photoUploading}
          className="w-full bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
          {photoUploading ? 'Upload des photos...' : loading ? t('submitting') : t('submit')}
        </button>

        <p className="text-xs text-[#9B8A74] text-center">{t('visible_note')}</p>
      </form>
    </div>
  );
}
