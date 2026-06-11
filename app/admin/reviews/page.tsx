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

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
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
    // Sort newest first
    data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setReviews(data);

    // Load existing replies from a separate endpoint if needed
    // For now we fetch them individually via the reviews endpoint which includes replies if stored on the review
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
  const withoutReply = reviews.length - withReply;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2416]">Avis voyageurs</h1>
        <p className="text-sm text-[#9B8A74] mt-1">
          {reviews.length} avis au total · {withReply} avec réponse · {withoutReply} sans réponse
        </p>
      </div>

      {/* Filtre par logement */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'risoul', 'avignon', 'lauris-meme', 'lauris-atelier', 'lauris-alain'].map((id) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              filter === id
                ? 'bg-[#C8763A] text-white'
                : 'bg-[#FAF7F2] border border-[#E8DCC8] text-[#5C4F3A] hover:border-[#C8763A]'
            }`}
          >
            {id === 'all' ? 'Tous' : PROPERTY_NAMES[id]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#9B8A74]">Aucun avis pour le moment.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => {
            const existingReply = replies[review.id];
            const draft = drafts[review.id] ?? '';
            const hasChanges = draft !== (existingReply ?? '');

            return (
              <div key={review.id} className="bg-white border border-[#E8DCC8] rounded-2xl p-5 shadow-sm">
                {/* En-tête avis */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#C8763A]/15 flex items-center justify-center text-[#C8763A] font-bold text-sm">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2C2416] text-sm">{review.author}</p>
                      <p className="text-xs text-[#9B8A74]">
                        {PROPERTY_NAMES[review.propertyId] ?? review.propertyId} · {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    {existingReply && !draft && (
                      <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Répondu</span>
                    )}
                  </div>
                </div>

                <p className="text-[#5C4F3A] text-sm leading-relaxed italic mb-4">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Zone de réponse */}
                <div className="border-t border-[#F0EAE0] pt-4">
                  <label className="text-xs font-semibold text-[#9B8A74] uppercase tracking-wide block mb-2">
                    Réponse du propriétaire
                  </label>
                  <textarea
                    rows={3}
                    value={draft || existingReply || ''}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))}
                    placeholder="Répondre à cet avis..."
                    className="w-full border border-[#E8DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2416] bg-[#FAF7F2] focus:outline-none focus:border-[#C8763A] resize-none transition-colors"
                  />
                  {(hasChanges || !existingReply) && draft && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleSave(review.id)}
                        disabled={saving === review.id}
                        className="text-xs bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving === review.id ? 'Enregistrement…' : existingReply ? 'Modifier la réponse' : 'Publier la réponse'}
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
