import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import CarteClient from './CarteClient';
import PageHero from '@/components/PageHero';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('carte_title') };
}

export default async function CartePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'carte' });

  return (
    <>
      <PageHero
        tag={t('eyebrow')}
        title={t('title')}
        subtitle={`${t('subtitle')} ${t('click_hint')}`}
        compact
      />
      <CarteClient />
    </>
  );
}
