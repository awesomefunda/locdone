import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.locdone.com';
  const lastModified = new Date();

  const staticPages = [
    { url: base, priority: 1.0 },
    { url: `${base}/pricing`, priority: 0.7 },
    { url: `${base}/privacy`, priority: 0.6 },
  ];

  const toolPages = TOOLS.map((t) => ({
    url: `${base}/${t.slug}`,
    priority: 0.9,
  }));

  return [...staticPages, ...toolPages].map((p) => ({
    url: p.url,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: p.priority,
  }));
}
