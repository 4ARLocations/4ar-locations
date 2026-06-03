import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { properties } from '@/lib/properties';
import PropertyGallery from '@/components/PropertyGallery';

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

function PropertyDetail({ locale, property }: { locale: string; property: (typeof properties)[0] }) {
  const t = useTranslations();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#9B8A74] mb-6 flex items-center gap-2">
        <Link href={`/${locale}/biens`} className="hover:text-[#C8763A] transition-colors">
          ← {t('properties.title')}
        </Link>
        <span>/</span>
        <span className="text-[#2C2416] font-medium">{t(property.nameKey)}</span>
      </nav>

      {/* Titre */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-1">{t(property.nameKey)}</h1>
          <p className="text-[#9B8A74] flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t(property.locationKey)}
          </p>
        </div>
        <div className="text-right">
          <div>
            {property.priceOnRequest ? (
              <div>
                <div>
                  <span className="text-sm text-[#9B8A74]">Entre </span>
                  <span className="text-3xl font-bold text-[#C8763A]">{property.priceFrom}€</span>
                  <span className="text-sm text-[#9B8A74]"> et </span>
                  <span className="text-3xl font-bold text-[#C8763A]">{property.priceTo}€</span>
                  <span className="text-sm text-[#9B8A74]">/nuit</span>
                </div>
                <div className="text-sm text-[#C8763A] font-medium mt-1">Nous contacter pour les tarifs</div>
              </div>
            ) : property.priceFrom > 0 ? (
              <div>
                <span className="text-sm text-[#9B8A74]">{t('home.from_price')} </span>
                <span className="text-3xl font-bold text-[#C8763A]">{property.priceFrom}€</span>
                <span className="text-sm text-[#9B8A74]">/nuit</span>
                <div className="flex flex-wrap gap-3 mt-2">
                  {property.cleaningFee && (
                    <span className="text-xs bg-[#FAF7F2] border border-[#E8DCC8] rounded-full px-3 py-1 text-[#5C4F3A]">
                      🧹 {property.cleaningFee}€ de ménage
                    </span>
                  )}
                  {property.minNights && (
                    <span className="text-xs bg-[#FAF7F2] border border-[#E8DCC8] rounded-full px-3 py-1 text-[#5C4F3A]">
                      📅 Min. {property.minNights} nuits
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-lg font-semibold text-[#9B8A74] italic">Sur demande</span>
            )}
          </div>
        </div>
      </div>

      {/* Galerie */}
      <PropertyGallery images={property.images} name={t(property.nameKey)} />

      {/* Infos + Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-[#2C2416] mb-3">À propos</h2>
          <p className="text-[#5C4F3A] leading-relaxed text-lg">{t(property.descriptionKey)}</p>

          {/* Caractéristiques */}
          <div className="grid grid-cols-3 gap-4 mt-8 p-5 bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl">
            <div className="text-center">
              <div className="text-3xl mb-1">👥</div>
              <div className="text-2xl font-bold text-[#2C2416]">{property.guests}</div>
              <div className="text-xs text-[#9B8A74]">{t('properties.guests')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🛏</div>
              <div className="text-2xl font-bold text-[#2C2416]">{property.bedrooms}</div>
              <div className="text-xs text-[#9B8A74]">{t('properties.bedrooms')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🚿</div>
              <div className="text-2xl font-bold text-[#2C2416]">{property.bathrooms}</div>
              <div className="text-xs text-[#9B8A74]">{t('properties.bathrooms')}</div>
            </div>
          </div>
        </div>

        {/* Sidebar réservation */}
        <div className="space-y-3">
          <div className="bg-white border border-[#E8DCC8] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-[#2C2416]">Réserver</h3>
            <Link
              href={`/${locale}/contact?bien=${property.id}`}
              className="block w-full bg-[#C8763A] hover:bg-[#A85E28] text-white text-center font-bold py-3 rounded-xl transition-colors"
            >
              {t('home.book_direct')}
            </Link>
            {property.airbnbUrl !== '#' && (
              <a
                href={property.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border border-[#C8763A] text-[#C8763A] text-center font-semibold py-3 rounded-xl hover:bg-[#C8763A] hover:text-white transition-colors"
              >
                Voir sur Airbnb
              </a>
            )}
            {property.abritelUrl && (
              <a
                href={property.abritelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border border-[#9B8EC4] text-[#9B8EC4] text-center font-semibold py-3 rounded-xl hover:bg-[#9B8EC4] hover:text-white transition-colors"
              >
                Voir sur Abritel
              </a>
            )}
          </div>
          <div className="bg-[#C8763A]/10 border border-[#C8763A]/20 rounded-xl p-4 text-center">
            <p className="text-xs text-[#5C4F3A] mb-1">Contact direct</p>
            <a href="mailto:loc4ar@gmail.com" className="text-[#C8763A] font-bold text-sm hover:underline">
              loc4ar@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
