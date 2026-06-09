import { getReviews } from '@/lib/redis';
import { getTranslations, getLocale } from 'next-intl/server';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-[#E8DCC8]'} style={{ fontSize: '0.9rem' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function formatDate(dateStr: string, locale: string) {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    // Utilise Intl.DateTimeFormat pour les noms de mois localisés
    const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-GB', de: 'de-DE' };
    const monthName = date.toLocaleString(localeMap[locale] ?? 'fr-FR', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  }
  return dateStr;
}

export default async function ReviewList({ propertyId }: { propertyId: string }) {
  const [propertyReviews, t, locale] = await Promise.all([
    getReviews(propertyId),
    getTranslations('review'),
    getLocale(),
  ]);

  if (propertyReviews.length === 0) return null;

  const avgRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length;

  return (
    <div className="mt-10">
      {/* Header avec moyenne */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2C2416] flex items-center gap-2">
            <span>⭐</span>
            <span>{t('reviews_title')}</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm font-semibold text-[#2C2416]">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-[#9B8A74]">· {t('reviews_count', { count: propertyReviews.length })}</span>
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {propertyReviews.map((review) => (
          <div key={review.id} className="bg-white border border-[#E8DCC8] rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar initiale */}
                <div className="w-9 h-9 rounded-full bg-[#C8763A]/15 flex items-center justify-center text-[#C8763A] font-bold text-sm shrink-0">
                  {review.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[#2C2416] text-sm">{review.author}</p>
                  {review.date && (
                    <p className="text-xs text-[#9B8A74]">{formatDate(review.date, locale)}</p>
                  )}
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-[#5C4F3A] text-sm leading-relaxed italic">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
