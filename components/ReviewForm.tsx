'use client';
import { useState } from 'react';

interface ReviewFormProps {
  propertyId: string;
  propertyName: string;
}

export default function ReviewForm({ propertyId, propertyName }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    author: '',
    email: '',
    date: '',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Veuillez choisir une note.'); return; }
    if (!form.comment.trim()) { setError('Veuillez écrire un commentaire.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyName, ...form, rating }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Une erreur est survenue, veuillez réessayer.');
      }
    } catch {
      setError('Impossible d\'envoyer. Vérifiez votre connexion.');
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
        <span>Laisser un avis sur votre séjour</span>
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#6B7C45]/10 border border-[#6B7C45]/30 rounded-xl p-5 text-center">
        <div className="text-3xl mb-2">🙏</div>
        <p className="font-bold text-[#2C2416] text-sm">Merci pour votre avis !</p>
        <p className="text-[#5C4F3A] text-xs mt-1">Il sera affiché après validation.</p>
      </div>
    );
  }

  const inputClass = "w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2] transition-colors";

  return (
    <div className="bg-white border border-[#E8DCC8] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-[#2C2416] text-sm">Votre avis sur votre séjour</h4>
        <button onClick={() => setOpen(false)} className="text-[#9B8A74] hover:text-[#2C2416] text-lg leading-none">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Étoiles */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-2">Note *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-[#E8DCC8]'}>★</span>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs text-[#9B8A74] self-center">
                {['', 'Décevant', 'Passable', 'Bien', 'Très bien', 'Excellent !'][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Nom + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#5C4F3A] mb-1">Prénom *</label>
            <input required type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
              className={inputClass} placeholder="Marie" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5C4F3A] mb-1">Email (optionnel)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass} placeholder="marie@..." />
          </div>
        </div>

        {/* Période */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-1">Période de séjour</label>
          <input type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass} />
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-xs font-medium text-[#5C4F3A] mb-1">Votre commentaire *</label>
          <textarea required rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Décrivez votre séjour : l'accueil, le logement, les environs..." />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
          {loading ? 'Envoi...' : 'Envoyer mon avis'}
        </button>

        <p className="text-xs text-[#9B8A74] text-center">Votre avis sera affiché après validation.</p>
      </form>
    </div>
  );
}
