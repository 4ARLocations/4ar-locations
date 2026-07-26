import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DM_Serif_Display, Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '../globals.css';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const BASE = 'https://www.4arlocations.com';
const OG_LOCALES: Record<string, string> = { fr: 'fr_FR', en: 'en_GB', de: 'de_DE' };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(BASE),
    title: {
      default: t('site_title'),
      template: `%s · 4AR Locations`,
    },
    description: t('site_description'),
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      type: 'website',
      siteName: '4AR Locations',
      locale: OG_LOCALES[locale] ?? 'fr_FR',
      title: t('site_title'),
      description: t('site_description'),
      images: [{
        url: '/images/bg-lauris-panorama.jpg',
        width: 1200,
        height: 630,
        alt: '4AR Locations — Provence & Alpes',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('site_title'),
      description: t('site_description'),
      images: ['/images/bg-lauris-panorama.jpg'],
    },
    alternates: {
      languages: {
        'fr': `${BASE}/fr`,
        'en': `${BASE}/en`,
        'de': `${BASE}/de`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`h-full ${dmSerif.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#2C2416] font-sans">
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
