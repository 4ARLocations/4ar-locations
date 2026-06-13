'use client';
import { useEffect, useState } from 'react';
import type { Review } from '@/lib/redis';

const PROPERTY_NAMES: Record<string, string> = {
  risoul: 'Risoul 1850',
  avignon: 'Avignon',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': "L'Atelier",
  'lauris-alain': "Maison d'Alain",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400' : 'text-white/15'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const load = async () => {
    const res = await fetch('/api/admin/reviews');
    if (!res.ok) return;
    const data: Review[] = await res.json();
    data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setReviews(data);
    const replyMap: Record<string, string> = {};
    data.forEach((r) => {
      if ((r as Review & { ownerReply?: string }).ownerReply) {
        replyMap[r.id] = (r as Review & { ownerReply?: string }).ownerReply!;
      }
    });
    setReplies(replyMap);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (reviewId: string) => {
    const text = drafts[reviewId]?.trim();
    if (!text) return;
    setSaving(reviewId);
    await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, text }),
    });
    setReplies((prev) => ({ ...prev, [reviewId]: text }));
    setDrafts((prev) => { const n = { ...prev }; delete n[reviewId]; return n; });
    setSaving(null);
  };

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.propertyId === filter);
  const withReply = reviews.filter((r) => replies[r.id]).length;

  return (
    <div className="px-6 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Avis voyageurs</h1>
        <p className="text-sm text-white/40 mt-1">
          {reviews.length} avis · {withReply} répondu{withReply > 1 ? 's' : ''} · {reviews.length - withReply} en attente
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {['all', 'risoul', 'avignon', 'lauris-meme', 'lauris-atelier', 'lauris-alain'].map((id) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              filter === id
                ? 'bg-[#C8763A] text-white'
                : 'bg-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/10 border border-white/[0.07]'
            }`}
          >
            {id === 'all' ? 'Tous les logements' : PROPERTY_NAMES[id]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/20">
          <p className="text-3xl mb-3">⭐</p>
          <p>Aucun avis pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => {
            const existingReply = replies[review.id];
            const draft = drafts[review.id] ?? '';

            return (
              <div key={review.id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                {/* Header avis */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#C8763A]/20 flex items-center justify-center text-[#C8763A] font-bold text-sm flex-shrink-0">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{review.author}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        {PROPERTY_NAMES[review.propertyId] ?? review.propertyId} · {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Stars rating={review.rating} />
                    {existingReply && (
                      <span className="text-[10px] bg-green-500/15 text-green-400 font-semibold px-2 py-0.5 rounded-full border border-green-500/20">
                        Répondu
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-white/55 text-sm leading-relaxed italic mb-4 pl-12">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Zone réponse */}
                <div className="border-t border-white/[0.07] pt-4 pl-12">
                  <label className="text-[10px] font-semibold text-white/30 uppercase tracking-widest block mb-2">
                    Réponse du propriétaire
                  </label>
                  <textarea
                    rows={3}
                    value={draft || existingReply || ''}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                    placeholder="Répondre à cet avis..."
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#C8763A]/50 resize-none transition-colors"
                  />
                  {draft && draft !== existingReply && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleSave(review.id)}
                        disabled={saving === review.id}
                        className="text-xs bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving === review.id ? 'Enregistrement…' : existingReply ? 'Modifier' : 'Publier la réponse'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
