import type { MetadataRoute } from 'next';

const BASE = 'https://locdone.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/compliance`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/redact-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/strip-pdf-metadata`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/bates-number-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/merge-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/compress-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/split-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/jpg-to-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/organize-pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/scan-folder`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];
}
