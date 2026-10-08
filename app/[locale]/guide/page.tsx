import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import GuideClient from './GuideClient';
import PageHero from '@/components/PageHero';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('guide_title') };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'guide' });

  return (
    <>
      <PageHero
        tag={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        compact
      />
      <GuideClient />
    </>
  );
}
