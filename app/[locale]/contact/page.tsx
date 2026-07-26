import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('contact_title') };
}

export default function ContactPage() {
  return <ContactClient />;
}
