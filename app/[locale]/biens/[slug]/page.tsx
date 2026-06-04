import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { properties } from '@/lib/properties';
import PropertyGallery from '@/components/PropertyGallery';
import LaurisCombine from '@/components/LaurisCombine';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();
  return <PropertyDetail locale={locale} property={property} />;
}

// ─── Petits composants helpers ───────────────────────────────────

function StatBadge({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-[#FAF7F2] border border-[#E8DCC8] rounded-xl px-4 py-3">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-lg font-bold text-[#2C2416] leading-none">{value}</div>
        <div className="text-xs text-[#9B8A74] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#F0EAE0] last:border-0">
      <span className="text-base w-6 text-center flex-shrink-0">{icon}</span>
      <span className="text-sm text-[#5C4F3A] flex-1">{label}</span>
      <span className="text-sm font-semibold text-[#2C2416]">{value}</span>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────

function PropertyDetail({ locale, property }: { locale: string; property: (typeof properties)[0] }) {
  const t = useTranslations();

  // Photo de fond selon la région
  const regionBg = property.region === 'alpes'
    ? '/images/bg-risoul-mountain.jpg'
    : property.region === 'avignon'
    ? '/images/bg-palais.jpg'
    : '/images/bg-lauris-chateau.jpg';

  // Couleur d'accent selon la région
  const regionColor = property.region === 'alpes'
    ? 'text-[#1E7A6E]'
    : property.region === 'avignon'
    ? 'text-[#C8763A]'
    : 'text-[#6B7C45]';

  const hasImages = property.images.length > 0;

  return (
    <>
      {/* ── BANDE EN-TÊTE avec fond régional ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('${regionBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-[#FAF7F2]/88" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#9B8A74] mb-5">
            <Link href={`/${locale}/biens`} className="hover:text-[#C8763A] transition-colors flex items-center gap-1">
              ← {t('properties.title')}
            </Link>
            <span>/</span>
            <span className="text-[#2C2416] font-medium truncate">{t(property.nameKey)}</span>
          </nav>

          {/* Titre + localisation */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-bold uppercase tracking-widest ${regionColor} bg-current/10 px-3 py-1 rounded-full border border-current/20`}
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                  {t(property.badgeKey)}
                </span>
                <span className="text-xs font-medium text-[#9B8A74] uppercase tracking-wide">
                  {t(property.typeKey)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-2 leading-tight">
                {t(property.nameKey)}
              </h1>
              <p className="text-[#9B8A74] flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t(property.locationKey)}
              </p>
            </div>

            {/* Prix compact dans le header */}
            <div className="text-right hidden sm:block">
              {property.priceOnRequest ? (
                <div>
                  <div className="text-sm text-[#9B8A74]">Entre</div>
                  <div className="text-2xl font-bold text-[#C8763A]">
                    {property.priceFrom}€ – {property.priceTo}€
                    <span className="text-sm font-normal text-[#9B8A74]">/nuit</span>
                  </div>
                  <div className="text-xs text-[#C8763A] font-medium mt-0.5">Nous contacter pour les tarifs</div>
                </div>
              ) : property.priceFrom > 0 ? (
                <div>
                  <div className="text-sm text-[#9B8A74]">{t('home.from_price')}</div>
                  <div className="text-2xl font-bold text-[#C8763A]">
                    {property.priceFrom}€
                    <span className="text-sm font-normal text-[#9B8A74]">/nuit</span>
                  </div>
                </div>
              ) : (
                <div className="text-base font-semibold text-[#9B8A74] italic">Sur demande</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CORPS DE LA PAGE ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* GALERIE */}
        {hasImages ? (
          <PropertyGallery images={property.images} name={t(property.nameKey)} />
        ) : (
          <div className="h-64 rounded-2xl bg-[#F0EAE0] flex items-center justify-content-center text-center p-8">
            <div className="mx-auto">
              <div className="text-5xl mb-3">📸</div>
              <p className="text-[#9B8A74] font-medium">Photos bientôt disponibles</p>
            </div>
          </div>
        )}

        {/* ── GRILLE PRINCIPALE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">

          {/* ── COLONNE GAUCHE — contenu ── */}
          <div className="lg:col-span-7 space-y-0">

            {/* STATS HORIZONTALES */}
            <div className="flex flex-wrap gap-3 pb-8 border-b border-[#E8DCC8]">
              <StatBadge icon="👥" value={property.guests} label={t('properties.guests')} />
              <StatBadge icon="🚪" value={property.bedrooms} label={t('properties.bedrooms')} />
              <StatBadge icon="🛏" value={property.beds} label={t('properties.beds')} />
              <StatBadge icon="🚿" value={property.bathrooms} label={t('properties.bathrooms')} />
            </div>

            {/* DESCRIPTION */}
            <div className="py-8 border-b border-[#E8DCC8]">
              <h2 className="text-xl font-bold text-[#2C2416] mb-5 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-[#C8763A] inline-block"></span>
                À propos de ce logement
              </h2>
              <p className="text-[#5C4F3A] leading-[1.85] text-[0.97rem]">
                {t(property.descriptionKey)}
              </p>
            </div>

            {/* INFOS PRATIQUES */}
            <div className="py-8 border-b border-[#E8DCC8]">
              <h2 className="text-xl font-bold text-[#2C2416] mb-5 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-[#6B7C45] inline-block"></span>
                Informations pratiques
              </h2>
              <div className="bg-white border border-[#E8DCC8] rounded-2xl px-5 py-1 shadow-sm">
                {property.minNights && (
                  <InfoRow icon="📅" label="Durée minimale de séjour" value={`${property.minNights} nuits`} />
                )}
                {property.cleaningFee && (
                  <InfoRow icon="🧹" label="Frais de ménage" value={`${property.cleaningFee} €`} />
                )}
                {property.id === 'avignon' && (
                  <InfoRow icon="☀️" label="Disponibilité" value="Juillet & Août uniquement" />
                )}
                {property.id === 'risoul' && (
                  <InfoRow icon="⛷" label="Vacances scolaires d'hiver" value="Location à la semaine (sam → sam)" />
                )}
                {property.id === 'risoul' && (
                  <InfoRow icon="🛏" label="Draps" value="Non fournis — ménage par les locataires" />
                )}
                <InfoRow icon="✉️" label="Réservation" value="Directe ou via Airbnb / Abritel" />
              </div>
            </div>

            {/* AVIS VOYAGEURS */}
            <div className="py-8">
              <ReviewList propertyId={property.id} />
              <div className="mt-6">
                <ReviewForm propertyId={property.id} propertyName={t(property.nameKey)} />
              </div>
            </div>
          </div>

          {/* ── SIDEBAR STICKY ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">

              {/* CARTE PRIX + RÉSERVATION */}
              <div className="bg-white border border-[#E8DCC8] rounded-2xl p-6 shadow-md">

                {/* Prix détaillé */}
                <div className="pb-5 mb-5 border-b border-[#E8DCC8]">
                  {property.priceOnRequest ? (
                    <div>
                      <p className="text-xs text-[#9B8A74] uppercase tracking-wide mb-1">Tarif selon la période</p>
                      <p className="text-2xl font-bold text-[#C8763A]">
                        {property.priceFrom}€ – {property.priceTo}€
                        <span className="text-sm font-normal text-[#9B8A74]"> /nuit</span>
                      </p>
                      <p className="text-xs text-[#C8763A] font-medium mt-1.5 flex items-center gap-1">
                        <span>ℹ️</span> Nous contacter pour un devis précis
                      </p>
                    </div>
                  ) : property.priceFrom > 0 ? (
                    <div>
                      <p className="text-xs text-[#9B8A74] uppercase tracking-wide mb-1">{t('home.from_price')}</p>
                      <p className="text-2xl font-bold text-[#C8763A]">
                        {property.priceFrom}€
                        <span className="text-sm font-normal text-[#9B8A74]"> /nuit</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {property.cleaningFee && (
                          <span className="text-xs bg-[#FAF7F2] border border-[#E8DCC8] rounded-lg px-2.5 py-1 text-[#5C4F3A]">
                            🧹 Ménage {property.cleaningFee}€
                          </span>
                        )}
                        {property.minNights && (
                          <span className="text-xs bg-[#FAF7F2] border border-[#E8DCC8] rounded-lg px-2.5 py-1 text-[#5C4F3A]">
                            📅 Min. {property.minNights} nuits
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-[#9B8A74] uppercase tracking-wide mb-1">Tarif</p>
                      <p className="text-xl font-semibold text-[#9B8A74] italic">Sur demande</p>
                    </div>
                  )}
                </div>

                {/* Boutons */}
                <div className="space-y-3">
                  <Link
                    href={`/${locale}/contact?bien=${property.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-[#C8763A] hover:bg-[#A85E28] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('home.book_direct')}
                  </Link>

                  {property.airbnbUrl !== '#' && (
                    <a href={property.airbnbUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full border border-[#E8DCC8] text-[#5C4F3A] font-semibold py-3 rounded-xl hover:border-[#C8763A] hover:text-[#C8763A] transition-colors text-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                      Voir sur Airbnb
                    </a>
                  )}

                  {property.abritelUrl && (
                    <a href={property.abritelUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full border border-[#E8DCC8] text-[#5C4F3A] font-semibold py-3 rounded-xl hover:border-[#9B8EC4] hover:text-[#9B8EC4] transition-colors text-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                      Voir sur Abritel
                    </a>
                  )}
                </div>

                {/* Avantages résa directe */}
                <div className="mt-5 pt-5 border-t border-[#E8DCC8]">
                  <p className="text-xs text-[#9B8A74] font-medium mb-3 text-center uppercase tracking-wide">
                    Réserver en direct c'est…
                  </p>
                  {[
                    { icon: '💰', text: 'Zéro frais de service' },
                    { icon: '💬', text: 'Contact direct avec les propriétaires' },
                    { icon: '📋', text: 'Flexibilité sur les conditions' },
                  ].map((a) => (
                    <div key={a.text} className="flex items-center gap-2.5 mb-2 last:mb-0">
                      <span className="text-sm">{a.icon}</span>
                      <span className="text-xs text-[#5C4F3A]">{a.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACT EMAIL */}
              <div className="bg-[#FAF7F2] border border-[#E8DCC8] rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C8763A]/15 flex items-center justify-center text-[#C8763A] flex-shrink-0">
                  ✉️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#9B8A74] font-medium">Contact direct</p>
                  <a href="mailto:loc4ar@gmail.com"
                    className="text-[#C8763A] font-bold text-sm hover:underline truncate block">
                    loc4ar@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── COMBINAISON MAISONS LAURIS ── */}
        {property.region === 'luberon' && (
          <LaurisCombine currentProperty={property} locale={locale} />
        )}

      </div>
    </>
  );
}
