import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import FavorisClient from './FavorisClient';
import PageHero from '@/components/PageHero';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('favoris_title') };
}

export default async function FavorisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'favorites' });

  return (
    <>
      <PageHero
        tag="Mes sélections"
        title={t('title')}
        subtitle={t('subtitle_empty')}
        compact
      />
      <FavorisClient />
    </>
  );
}
