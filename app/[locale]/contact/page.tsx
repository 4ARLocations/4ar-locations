'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { properties } from '@/lib/properties';

function ContactForm() {
  const t = useTranslations('contact');
  const tProp = useTranslations();
  const searchParams = useSearchParams();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [dateError, setDateError] = useState('');
  const [isCombined, setIsCombined] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: '', email: '', phone: '', property: '',
    checkin: '', checkout: '', guests: '', message: '',
  });

  useEffect(() => {
    const bien = searchParams.get('bien');
    const combine = searchParams.get('combine');
    if (bien) setForm((f) => ({ ...f, property: bien }));
    if (combine === 'true') setIsCombined(true);
  }, [searchParams]);

  // Vérifie si une date est hors juillet-août (pour Avignon)
  const isAvignon = form.property === 'avignon';
  const isInJulyAugust = (dateStr: string) => {
    if (!dateStr) return true;
    const month = new Date(dateStr).getMonth(); // 0-based: 6=juillet, 7=août
    return month === 6 || month === 7;
  };

  // Validation des dates en temps réel
  const validateDates = (checkin: string, checkout: string, property = form.property) => {
    if (!checkin || !checkout) { setDateError(''); return true; }
    if (checkout <= checkin) {
      setDateError('La date de départ doit être après la date d\'arrivée.');
      return false;
    }
    // Vérification durée minimale
    const prop = properties.find((p) => p.id === property);
    if (prop?.minNights) {
      const nights = Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000);
      if (nights < prop.minNights) {
        setDateError(`La durée minimale de séjour est de ${prop.minNights} nuits pour ce logement.`);
        return false;
      }
    }
    if (property === 'avignon') {
      if (!isInJulyAugust(checkin) || !isInJulyAugust(checkout)) {
        setDateError('L\'appartement d\'Avignon est uniquement disponible en juillet et août.');
        return false;
      }
    }
    setDateError('');
    return true;
  };

  const handleCheckin = (val: string) => {
    const newForm = { ...form, checkin: val };
    if (form.checkout && form.checkout <= val) {
      newForm.checkout = '';
    }
    setForm(newForm);
    validateDates(val, newForm.checkout);
  };

  const handleCheckout = (val: string) => {
    setForm({ ...form, checkout: val });
    validateDates(form.checkin, val);
  };

  const handlePropertyChange = (val: string) => {
    const newForm = { ...form, property: val, checkin: '', checkout: '' };
    setForm(newForm);
    setDateError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validateDates(form.checkin, form.checkout)) return;

    // Retrouver le nom du logement depuis son id
    const prop = properties.find((p) => p.id === form.property);
    const propertyName = prop ? tProp(prop.nameKey) : form.property;

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property: propertyName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || 'Une erreur est survenue, veuillez réessayer.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError('Impossible d\'envoyer la demande. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DCC8] shadow-md p-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-[#2C2416] mb-2">Demande envoyée !</h3>
        <p className="text-[#5C4F3A]">{t('form_success')}</p>
      </div>
    );
  }

  const inputClass = "w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2] transition-colors";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-[#E8DCC8] p-6 md:p-8 space-y-5">
      {/* Bandeau réservation combinée */}
      {isCombined && (
        <div className="flex items-start gap-3 bg-[#C8763A]/10 border border-[#C8763A]/30 rounded-xl p-4">
          <span className="text-2xl shrink-0">🏘️</span>
          <div>
            <p className="font-bold text-[#2C2416] text-sm">Demande de réservation combinée</p>
            <p className="text-[#5C4F3A] text-sm mt-0.5">
              Précisez dans le message le nombre de personnes et les maisons souhaitées — nous vérifierons les disponibilités pour vous.
            </p>
          </div>
        </div>
      )}

      {/* Nom + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_name')} *</label>
          <input required type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass} placeholder="Jean Dupont" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_email')} *</label>
          <input required type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass} placeholder="jean@exemple.fr" />
        </div>
      </div>

      {/* Téléphone + Logement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_phone')}</label>
          <input type="tel" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass} placeholder="+33 6 00 00 00 00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_property')} *</label>
          <select required value={form.property}
            onChange={(e) => handlePropertyChange(e.target.value)}
            className={inputClass}>
            <option value="">{t('select_property')}</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{tProp(p.nameKey)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Avertissement Avignon */}
      {isAvignon && (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <span className="text-blue-500 text-lg shrink-0">ℹ️</span>
          <p className="text-blue-700 text-sm">L'appartement d'Avignon est <strong>disponible uniquement en juillet et août</strong>.</p>
        </div>
      )}

      {/* Dates + Voyageurs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_checkin')} *</label>
          <input required type="date" value={form.checkin}
            min={today}
            onChange={(e) => handleCheckin(e.target.value)}
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_checkout')} *</label>
          <input required type="date" value={form.checkout}
            min={form.checkin || today}
            onChange={(e) => handleCheckout(e.target.value)}
            className={`${inputClass} ${dateError ? 'border-red-400' : ''}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_guests')} *</label>
          <input required type="number" min={1} max={20} value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className={inputClass} placeholder="2" />
        </div>
      </div>

      {/* Erreur de dates */}
      {dateError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <span className="text-red-500 text-lg">⚠️</span>
          <p className={errorClass + ' mt-0'}>{dateError}</p>
        </div>
      )}

      {/* Durée du séjour calculée */}
      {form.checkin && form.checkout && !dateError && (
        <div className="flex items-center gap-2 bg-[#6B7C45]/10 border border-[#6B7C45]/20 rounded-lg px-4 py-2">
          <span className="text-[#6B7C45]">🗓️</span>
          <p className="text-sm text-[#5C4F3A]">
            Séjour de <strong>{Math.round((new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000)} nuit(s)</strong>
          </p>
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_message')}</label>
        <textarea rows={4} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Questions, informations supplémentaires..." />
      </div>

      {/* Erreur serveur */}
      {serverError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span className="text-red-500">❌</span>
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !!dateError}
        className="w-full bg-[#C8763A] hover:bg-[#A85E28] disabled:bg-[#C8763A]/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi en cours...
          </>
        ) : t('form_submit')}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-3">{t('title')}</h1>
        <p className="text-[#5C4F3A] text-lg">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#C8763A]/10 border border-[#C8763A]/30 rounded-xl p-4 text-center">
            <p className="text-xs text-[#5C4F3A] mb-1 font-medium uppercase tracking-wide">Email direct</p>
            <a href="mailto:loc4ar@gmail.com" className="text-[#C8763A] font-bold text-sm hover:underline break-all">
              loc4ar@gmail.com
            </a>
          </div>
          <h2 className="font-bold text-lg text-[#2C2416]">{t('advantage_title')}</h2>
          {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
            <div key={k} className="flex items-start gap-3 bg-[#6B7C45]/10 border border-[#6B7C45]/20 rounded-xl p-4">
              <span className="text-[#6B7C45] text-lg font-bold mt-0.5">✓</span>
              <span className="text-[#5C4F3A] text-sm">{t(k)}</span>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="text-center py-8 text-[#9B8A74]">Chargement...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
