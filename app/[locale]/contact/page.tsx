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
  const [form, setForm] = useState({
    name: '', email: '', phone: '', property: '', checkin: '', checkout: '', guests: '', message: '',
  });

  useEffect(() => {
    const bien = searchParams.get('bien');
    if (bien) setForm((f) => ({ ...f, property: bien }));
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[4AR Locations] Demande de réservation — ${form.property}`);
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\nTéléphone : ${form.phone || 'Non renseigné'}\n\nLogement : ${form.property}\nArrivée : ${form.checkin}\nDépart : ${form.checkout}\nVoyageurs : ${form.guests}\n\nMessage :\n${form.message}`
    );
    window.location.href = `mailto:loc4ar@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-xl font-semibold text-[#6B7C45]">{t('form_success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-[#E8DCC8] p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_name')} *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_email')} *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_phone')}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_property')} *</label>
          <select
            required
            value={form.property}
            onChange={(e) => setForm({ ...form, property: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          >
            <option value="">{t('select_property')}</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{tProp(p.nameKey)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_checkin')} *</label>
          <input
            required
            type="date"
            value={form.checkin}
            onChange={(e) => setForm({ ...form, checkin: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_checkout')} *</label>
          <input
            required
            type="date"
            value={form.checkout}
            onChange={(e) => setForm({ ...form, checkout: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_guests')} *</label>
          <input
            required
            type="number"
            min={1}
            max={12}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#5C4F3A] mb-1">{t('form_message')}</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8763A] bg-[#FAF7F2] resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold py-3 rounded-xl transition-colors text-lg"
      >
        {t('form_submit')}
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
        {/* Advantages sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Email direct */}
          <div className="bg-[#C8763A]/10 border border-[#C8763A]/30 rounded-xl p-4 text-center">
            <p className="text-xs text-[#5C4F3A] mb-1 font-medium uppercase tracking-wide">Email direct</p>
            <a
              href="mailto:loc4ar@gmail.com"
              className="text-[#C8763A] font-bold text-sm hover:underline break-all"
            >
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

        {/* Form */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Chargement...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
