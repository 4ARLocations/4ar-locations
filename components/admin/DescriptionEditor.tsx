'use client';

import { useState } from 'react';

type Locale = 'fr' | 'en' | 'de';

interface Props {
  propertyId: string;
  propertyName: string;
  defaults: Record<Locale, string>;
  saved: Record<Locale, string | null>;
}

const LOCALE_LABELS: Record<Locale, string> = { fr: '🇫🇷 Français', en: '🇬🇧 English', de: '🇩🇪 Deutsch' };
const LOCALES: Locale[] = ['fr', 'en', 'de'];

export default function DescriptionEditor({ propertyId, propertyName, defaults, saved }: Props) {
  const [activeLocale, setActiveLocale] = useState<Locale>('fr');
  const [texts, setTexts] = useState<Record<Locale, string>>({
    fr: saved.fr ?? defaults.fr,
    en: saved.en ?? defaults.en,
    de: saved.de ?? defaults.de,
  });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch(`/api/admin/descriptions/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(texts),
      });
      if (!res.ok) throw new Error(await res.text());
      setOk(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = () => {
    setTexts(prev => ({ ...prev, [activeLocale]: defaults[activeLocale] }));
    setOk(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <a href="/admin/annonces" className="text-sm text-[#9B8A74] hover:text-[#5C4F3A] transition-colors">
              ← Retour
            </a>
            <h1 className="text-xl font-bold text-[#2C2416] mt-1">{propertyName}</h1>
            <p className="text-sm text-[#9B8A74]">Description affichée sur le site</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={resetToDefault}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-[#E8DCC8] text-[#9B8A74] hover:text-[#5C4F3A] hover:border-[#C8B8A0] transition-all"
            >
              Rétablir défaut
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                ok ? 'bg-green-500 text-white' : 'bg-[#C8763A] hover:bg-[#A85E28] text-white'
              } disabled:opacity-60`}
            >
              {saving ? 'Enregistrement...' : ok ? '✓ Enregistré !' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Tabs langue */}
        <div className="flex gap-1 mb-4 bg-white border border-[#E8DCC8] rounded-xl p-1 w-fit">
          {LOCALES.map(locale => (
            <button
              key={locale}
              onClick={() => setActiveLocale(locale)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeLocale === locale
                  ? 'bg-[#C8763A] text-white shadow-sm'
                  : 'text-[#9B8A74] hover:text-[#5C4F3A]'
              }`}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </div>

        {/* Zone de texte */}
        <div className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-[#E8DCC8] flex items-center justify-between">
            <span className="text-xs font-medium text-[#9B8A74] uppercase tracking-wide">Description</span>
            <span className="text-xs text-[#C8B8A0]">{texts[activeLocale].length} caractères</span>
          </div>
          <textarea
            value={texts[activeLocale]}
            onChange={e => { setTexts(prev => ({ ...prev, [activeLocale]: e.target.value })); setOk(false); }}
            className="w-full px-4 py-4 text-sm text-[#2C2416] leading-relaxed resize-none focus:outline-none"
            rows={20}
            placeholder="Description du logement..."
          />
        </div>

        <p className="text-xs text-[#9B8A74] mt-3">
          Les sauts de ligne sont conservés. Les modifications s'appliquent immédiatement après enregistrement.
        </p>
      </div>
    </div>
  );
}
