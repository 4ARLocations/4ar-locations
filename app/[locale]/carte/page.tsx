import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import CarteClient from './CarteClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('carte_title') };
}

export default function CartePage() {
  return <CarteClient />;
}
