import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { properties } from '@/lib/properties';
import { getPropertyImages } from '@/lib/property-images';
import PropertyGallery from '@/components/PropertyGallery';
import LaurisCombine from '@/components/LaurisCombine';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import FavoriteButton from '@/components/FavoriteButton';
import BookingCalculator from '@/components/BookingCalculator';
import PropertyFAQ from '@/components/PropertyFAQ';

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();
  const images = await getPropertyImages(property.id, property.images);
  return <PropertyDetail locale={locale} property={property} images={images} />;
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

function DescriptionBlock({ text }: { text: string }) {
  const raw = text.trim();
  let paragraphs: string[] = [];

  if (raw.includes('\n\n')) {
    // Split on double newlines (paragraph breaks); keep single \n as line breaks within paragraphs
    paragraphs = raw.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  } else if (raw.includes('\n')) {
    paragraphs = raw.split(/\n/).map((s) => s.trim()).filter(Boolean);
  } else {
    // Fallback: split on sentence boundaries and group by 2
    const parts = raw.split(/\. (?=[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜÆŒ🔹⚠️🏡])/).filter(Boolean);
    if (parts.length <= 1) {
      paragraphs.push(raw);
    } else {
      paragraphs.push(parts[0].trim());
      for (let i = 1; i < parts.length; i += 2) {
        paragraphs.push(parts.slice(i, i + 2).join('. ').trim());
      }
    }
  }

  // Check if last paragraph ends with a period
  const ensurePeriod = (s: string) => (s.endsWith('.') || s.endsWith('?') || s.endsWith('!') ? s : s + '.');

  return (
    <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8DCC8] px-6 py-5 space-y-4">
      {paragraphs.map((para, i) => {
        const isLead = i === 0;
        const isNote = para.startsWith('⚠️') || para.startsWith('🔹');
        if (isNote) {
          const match = para.match(/^(⚠️|🔹)\s*/);
          const prefix = match ? match[1] : '';
          const body = para.slice(match ? match[0].length : 0);
          return (
            <div key={i} className="flex items-start gap-2.5 bg-[#C8763A]/8 border border-[#C8763A]/20 rounded-xl px-4 py-3">
              <span className="text-base mt-0.5 flex-shrink-0">{prefix}</span>
              <p className="text-sm text-[#5C4F3A] leading-relaxed">{body}</p>
            </div>
          );
        }
        // Render lines within a paragraph as <br>-separated spans
        const lines = para.split('\n');
        return (
          <p
            key={i}
            className={
              isLead
                ? 'text-[#2C2416] font-medium text-[1rem] leading-[1.8]'
                : 'text-[#5C4F3A] text-[0.93rem] leading-[1.8]'
            }
          >
            {lines.map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {li === lines.length - 1 ? ensurePeriod(line) : line}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────

function PropertyDetail({ locale, property, images }: { locale: string; property: (typeof properties)[0]; images: string[] }) {
  const t = useTranslations();
  const td = useTranslations('property_detail');

  // Photo de fond selon la région
  const regionBg = property.region === 'alpes'
    ? '/images/bg-risoul-mountain.jpg'
    : property.region === 'avignon'
    ? '/images/bg-palais.jpg'
    : '/images/bg-lauris-mid.jpg';

  // Couleur d'accent selon la région
  const regionColor = property.region === 'alpes'
    ? 'text-[#1E7A6E]'
    : property.region === 'avignon'
    ? 'text-[#C8763A]'
    : 'text-[#6B7C45]';

  const hasImages = images.length > 0;

  return (
    <>
      {/* ── BANDE EN-TÊTE avec fond régional ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('${regionBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Gradient sombre → lisibilité des textes sur la photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1008]/75 via-[#1A1008]/55 to-[#1A1008]/30" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/65 mb-5">
            <Link href={`/${locale}/biens`} className="hover:text-white transition-colors flex items-center gap-1">
              ← {t('properties.title')}
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/85 font-medium truncate">{t(property.nameKey)}</span>
          </nav>

          {/* Titre + localisation */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                  {t(property.badgeKey)}
                </span>
                <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
                  {t(property.typeKey)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-sm">
                {t(property.nameKey)}
              </h1>
              <p className="text-white/70 flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t(property.locationKey)}
              </p>
            </div>

            {/* Favori */}
            <FavoriteButton
              propertyId={property.id}
              size="lg"
              className="bg-white/15 hover:bg-white/30 backdrop-blur-sm rounded-full p-2.5 text-white/80 hover:text-white flex-shrink-0"
            />

            {/* Prix compact dans le header */}
            <div className="text-right hidden sm:block bg-black/25 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15">
              {property.priceOnRequest ? (
                <div>
                  <div className="text-xs text-white/55 uppercase tracking-wide mb-1">Entre</div>
                  <div className="text-2xl font-bold text-[#E8A05A]">
                    {property.priceFrom}€ – {property.priceTo}€
                    <span className="text-sm font-normal text-white/60">/nuit</span>
                  </div>
                  <div className="text-xs text-white/55 mt-1">Nous contacter pour les tarifs</div>
                </div>
              ) : property.priceFrom > 0 ? (
                <div>
                  <div className="text-xs text-white/55 uppercase tracking-wide mb-1">{t('home.from_price')}</div>
                  <div className="text-2xl font-bold text-[#E8A05A]">
                    {property.priceFrom}€
                    <span className="text-sm font-normal text-white/60">/nuit</span>
                  </div>
                </div>
              ) : (
                <div className="text-base font-semibold text-white/70 italic">Sur demande</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CORPS DE LA PAGE ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* GALERIE */}
        {hasImages ? (
          <PropertyGallery images={images} name={t(property.nameKey)} />
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
              <DescriptionBlock text={t(property.descriptionKey)} />
            </div>

            {/* INFOS PRATIQUES */}
            <div className="py-8 border-b border-[#E8DCC8]">
              <h2 className="text-xl font-bold text-[#2C2416] mb-5 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-[#6B7C45] inline-block"></span>
                {td('practical_info')}
              </h2>
              <div className="bg-white border border-[#E8DCC8] rounded-2xl px-5 py-1 shadow-sm">
                {property.minNights && (
                  <InfoRow icon="📅" label={td('min_stay')} value={`${property.minNights} ${td('nights')}`} />
                )}
                {property.cleaningFee && (
                  <InfoRow icon="🧹" label={td('cleaning_fee')} value={`${property.cleaningFee} €`} />
                )}
                {property.id === 'avignon' && (
                  <InfoRow icon="☀️" label={td('avignon_availability')} value={td('avignon_availability_value')} />
                )}
                {property.id === 'risoul' && (
                  <InfoRow icon="⛷" label={td('risoul_school_holidays')} value={td('risoul_school_holidays_value')} />
                )}
                {property.id === 'risoul' && (
                  <InfoRow icon="🛏" label={td('risoul_linen')} value={td('risoul_linen_value')} />
                )}
                <InfoRow icon="✉️" label={td('booking_info')} value={td('booking_info_value')} />
              </div>
            </div>

            {/* CALENDRIER DISPONIBILITÉS */}
            <AvailabilityCalendar propertyId={property.id} />

            {/* FAQ */}
            <PropertyFAQ propertyId={property.id} />

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
                      <p className="text-xs text-[#9B8A74] uppercase tracking-wide mb-1">{td('price_on_request_label')}</p>
                      <p className="text-2xl font-bold text-[#C8763A]">
                        {property.priceFrom}€ – {property.priceTo}€
                        <span className="text-sm font-normal text-[#9B8A74]"> {td('per_night')}</span>
                      </p>
                      <p className="text-xs text-[#C8763A] font-medium mt-1.5 flex items-center gap-1">
                        <span>ℹ️</span> {td('price_quote')}
                      </p>
                    </div>
                  ) : property.priceFrom > 0 ? (
                    <div>
                      <p className="text-xs text-[#9B8A74] uppercase tracking-wide mb-1">{t('home.from_price')}</p>
                      <p className="text-2xl font-bold text-[#C8763A]">
                        {property.priceFrom}€
                        <span className="text-sm font-normal text-[#9B8A74]"> {td('per_night')}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {property.cleaningFee && (
                          <span className="text-xs bg-[#FAF7F2] border border-[#E8DCC8] rounded-lg px-2.5 py-1 text-[#5C4F3A]">
                            🧹 {td('cleaning_fee')} {property.cleaningFee}€
                          </span>
                        )}
                        {property.minNights && (
                          <span className="text-xs bg-[#FAF7F2] border border-[#E8DCC8] rounded-lg px-2.5 py-1 text-[#5C4F3A]">
                            📅 Min. {property.minNights} {td('nights')}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-[#9B8A74] uppercase tracking-wide mb-1">{td('price_label')}</p>
                      <p className="text-xl font-semibold text-[#9B8A74] italic">{td('price_on_request')}</p>
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
                      {td('view_airbnb')}
                    </a>
                  )}

                  {property.abritelUrl && (
                    <a href={property.abritelUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full border border-[#E8DCC8] text-[#5C4F3A] font-semibold py-3 rounded-xl hover:border-[#9B8EC4] hover:text-[#9B8EC4] transition-colors text-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                      {td('view_abritel')}
                    </a>
                  )}
                </div>

                {/* Avantages résa directe */}
                <div className="mt-5 pt-5 border-t border-[#E8DCC8]">
                  <p className="text-xs text-[#9B8A74] font-medium mb-3 text-center uppercase tracking-wide">
                    {td('book_direct_label')}
                  </p>
                  {[
                    { icon: '💰', text: td('book_direct_1') },
                    { icon: '💬', text: td('book_direct_2') },
                    { icon: '📋', text: td('book_direct_3') },
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
                  <p className="text-xs text-[#9B8A74] font-medium">{td('direct_contact')}</p>
                  <a href="mailto:loc4ar@gmail.com"
                    className="text-[#C8763A] font-bold text-sm hover:underline truncate block">
                    loc4ar@gmail.com
                  </a>
                </div>
              </div>

              {/* CALCULATEUR */}
              {property.priceFrom > 0 && !property.priceOnRequest && (
                <BookingCalculator
                  pricePerNight={property.priceFrom}
                  cleaningFee={property.cleaningFee}
                  minNights={property.minNights}
                />
              )}

            </div>
          </div>
        </div>

        {/* ── COMBINAISON MAISONS LAURIS ── */}
        {property.region === 'luberon' && (
          <LaurisCombine currentProperty={property} locale={locale} />
        )}

        {/* ── VOUS AIMEREZ AUSSI ── */}
        <SuggestedProperties currentId={property.id} locale={locale} />

      </div>

      {/* ── BOUTON WHATSAPP FLOTTANT ── */}
      <a
        href="https://wa.me/33600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
        title="Nous contacter sur WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}

// ─── "Vous aimerez aussi" ─────────────────────────────────────────
function SuggestedProperties({ currentId, locale }: { currentId: string; locale: string }) {
  const t = useTranslations();
  const others = properties.filter((p) => p.id !== currentId).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-[#E8DCC8]">
      <h2 className="text-2xl font-bold text-[#2C2416] mb-6">Vous aimerez aussi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {others.map((p) => (
          <Link
            key={p.id}
            href={`/${locale}/biens/${p.slug}`}
            className="group bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={p.image}
                alt={t(p.nameKey)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="bg-[#C8763A] text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {t(p.badgeKey)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#2C2416] mb-1">{t(p.nameKey)}</h3>
              <p className="text-[#9B8A74] text-xs flex items-center gap-1 mb-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t(p.locationKey)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#5C4F3A] text-xs">👥 {p.guests} · 🛏 {p.bedrooms}</span>
                {p.priceFrom > 0 ? (
                  <span className="text-[#C8763A] font-bold text-sm">{p.priceFrom}€<span className="text-xs font-normal text-[#9B8A74]">/nuit</span></span>
                ) : (
                  <span className="text-[#9B8A74] text-xs italic">Sur demande</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
