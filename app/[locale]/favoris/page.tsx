import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import FavorisClient from './FavorisClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('favoris_title') };
}

export default function FavorisPage() {
  return <FavorisClient />;
}
