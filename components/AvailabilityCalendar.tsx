/**
 * Calendrier de disponibilité — lecture seule pour les visiteurs
 * Affiche 6 mois avec navigation avant/arrière
 */
import { getBlocks } from '@/lib/availability';
import { getTranslations, getLocale } from 'next-intl/server';
import AvailabilityCalendarClient from './AvailabilityCalendarClient';

export default async function AvailabilityCalendar({ propertyId }: { propertyId: string }) {
  const [blocks, t, locale] = await Promise.all([
    getBlocks(propertyId),
    getTranslations('availability'),
    getLocale(),
  ]);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const futureBlocks = blocks.filter((b) => b.end >= todayStr);

  return (
    <AvailabilityCalendarClient
      blocks={futureBlocks}
      todayStr={todayStr}
      locale={locale}
      labels={{
        title: t('title'),
        has_blocks: t('has_blocks'),
        no_blocks: t('no_blocks'),
        available: t('available'),
        booked: t('booked'),
        today: t('today'),
        prev: t('prev'),
        next: t('next'),
      }}
    />
  );
}
