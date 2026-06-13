'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { properties } from '@/lib/properties';

function ContactForm() {
  const t = useTranslations('contact');
  const tProp = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // pathname is like /fr/contact — extract locale
  const locale = pathname.split('/')[1] ?? 'fr';

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
      setDateError(t('date_error_order'));
      return false;
    }
    // Vérification durée minimale
    const prop = properties.find((p) => p.id === property);
    if (prop?.minNights) {
      const nights = Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000);
      if (nights < prop.minNights) {
        setDateError(t('date_error_min_nights', { nights: prop.minNights }));
        return false;
      }
    }
    if (property === 'avignon') {
      if (!isInJulyAugust(checkin) || !isInJulyAugust(checkout)) {
        setDateError(t('date_error_avignon'));
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
        setServerError(data.error || t('error_generic'));
      } else {
        // Rediriger vers la page séjour
        const nom = encodeURIComponent(form.name?.split(' ')[0] ?? '');
        const bien = encodeURIComponent(form.property ?? '');
        router.push(`/${locale}/sejour?bien=${bien}&nom=${nom}`);
      }
    } catch {
      setServerError(t('error_connection'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DCC8] shadow-md p-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-[#2C2416] mb-2">{t('submitted_title')}</h3>
        <p className="text-[#5C4F3A]">{t('form_success')}</p>
      </div>
    );
  }

  const inputClass = "w-full border border-[#E8DCC8] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8763A] bg-white transition-colors text-[#2C2416] placeholder-[#C4B8A8]";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6 md:p-8 space-y-5">
      {/* Bandeau réservation combinée */}
      {isCombined && (
        <div className="flex items-start gap-3 bg-[#C8763A]/10 border border-[#C8763A]/30 rounded-xl p-4">
          <span className="text-2xl shrink-0">🏘️</span>
          <div>
            <p className="font-bold text-[#2C2416] text-sm">{t('combined_title')}</p>
            <p className="text-[#5C4F3A] text-sm mt-0.5">{t('combined_text')}</p>
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
          <p className="text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: t('avignon_warning') }} />
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
            <strong>{t('stay_duration', { n: Math.round((new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000) })}</strong>
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
            {t('sending')}
          </>
        ) : t('form_submit')}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <>
      {/* Bandeau haut */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DCC8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8763A] mb-2">Réservation directe</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-2">{t('title')}</h1>
          <p className="text-[#9B8A74]">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            {/* Email */}
            <a
              href="mailto:loc4ar@gmail.com"
              className="flex items-center gap-3 bg-white border border-[#E8DCC8] hover:border-[#C8763A]/40 rounded-xl p-4 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#C8763A]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#C8763A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-[#9B8A74] uppercase tracking-widest font-semibold">{t('email_label')}</p>
                <p className="text-[#C8763A] font-semibold text-sm group-hover:underline">loc4ar@gmail.com</p>
              </div>
            </a>

            {/* Avantages */}
            <div className="bg-white border border-[#E8DCC8] rounded-xl p-4">
              <p className="font-bold text-[#2C2416] text-sm mb-3">{t('advantage_title')}</p>
              <div className="space-y-2.5">
                {(['advantage_1', 'advantage_2', 'advantage_3', 'advantage_4'] as const).map((k) => (
                  <div key={k} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#6B7C45]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#6B7C45] text-xs font-bold">✓</span>
                    </div>
                    <span className="text-[#5C4F3A] text-sm leading-snug">{t(k)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Délai réponse */}
            <div className="bg-[#6B7C45]/8 border border-[#6B7C45]/20 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚡</span>
              <div>
                <p className="text-sm font-semibold text-[#2C2416]">Réponse rapide</p>
                <p className="text-xs text-[#9B8A74] mt-0.5">Nous répondons à toutes les demandes sous 24h.</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="text-center py-8 text-[#9B8A74]">{t('loading')}</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
