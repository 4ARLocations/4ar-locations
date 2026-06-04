'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin/calendar');
      } else {
        setError('Mot de passe incorrect.');
        setPassword('');
      }
    } catch {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1008] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-3">
            <span className="text-[#C8763A] font-bold text-3xl">4AR</span>
            <span className="text-[#8A9E5A] font-bold text-3xl"> Locations</span>
          </div>
          <p className="text-white/50 text-sm">Espace administration</p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-white font-bold text-lg mb-6 text-center">Connexion</h1>

          <div className="mb-4">
            <label className="block text-white/60 text-xs font-medium mb-2 uppercase tracking-wide">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C8763A] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-white/25 text-xs mt-6">
          Accès réservé à l'équipe 4AR Locations
        </p>
      </div>
    </div>
  );
}
