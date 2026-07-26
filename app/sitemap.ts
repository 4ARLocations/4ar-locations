import type { MetadataRoute } from 'next';
import { properties } from '@/lib/properties';

const BASE = 'https://www.4arlocations.com';
const LOCALES = ['fr', 'en', 'de'];
const STATIC_PAGES = ['', '/biens', '/carte', '/guide', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url: `${BASE}/${locale}${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
    for (const property of properties) {
      entries.push({
        url: `${BASE}/${locale}/biens/${property.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  return entries;
}
