import type { MetadataRoute } from 'next';
import { getEditions, getEdition } from '@/lib/content';
import { SECTIONS } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalbook.avolta.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const editions = getEditions();
  const entries: MetadataRoute.Sitemap = [];

  for (const editionSlug of editions) {
    const edition = getEdition(editionSlug);
    if (!edition) continue;

    // Edition homepage
    entries.push({
      url: `${BASE_URL}/${editionSlug}`,
      lastModified: new Date(edition.date),
      changeFrequency: 'monthly',
      priority: 0.9,
    });

    // Section pages
    for (const section of SECTIONS) {
      entries.push({
        url: `${BASE_URL}/${editionSlug}/${section.slug}`,
        lastModified: new Date(edition.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
