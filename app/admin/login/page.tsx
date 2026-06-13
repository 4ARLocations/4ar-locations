'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className="min-h-screen bg-[#0D0802] flex items-center justify-center px-4">
      {/* Fond subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2C1A08_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
            <Image src="/images/logo-4ar.png" alt="4AR" width={40} height={40} className="object-contain" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[#C8763A] font-bold text-2xl tracking-tight">4AR</span>
            <span className="text-[#6B9E4A] font-semibold text-2xl tracking-tight">Admin</span>
          </div>
          <p className="text-white/30 text-sm mt-1">Espace de gestion</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
          <div className="mb-5">
            <label className="block text-[10px] text-white/40 font-semibold uppercase tracking-widest mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C8763A]/50 transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#C8763A] hover:bg-[#A85E28] disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <a href="/fr" className="block text-center text-white/20 hover:text-white/40 text-xs mt-6 transition-colors">
          ← Retour au site
        </a>
      </div>
    </div>
  );
}
