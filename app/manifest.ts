import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Locdone — Private PDF Tools',
    short_name: 'Locdone',
    description:
      'PDF tools that run entirely in your browser. Files never leave your device.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0E0E10',
    theme_color: '#0E0E10',
    orientation: 'portrait',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
