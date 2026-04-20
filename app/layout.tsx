import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FirstDownloadToast } from '@/components/FirstDownloadToast';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const SITE_TITLE =
  'Locdone — Free PDF Tools That Run in Your Browser. No Uploads.';
const SITE_DESCRIPTION =
  'Free, private PDF tools. Convert JPG to PDF, merge, compress, organize, and redact PDFs right in your browser — no uploads, no signup, no watermarks. Your files never leave your device.';

export const metadata: Metadata = {
  metadataBase: new URL('https://locdone.com'),
  title: {
    default: SITE_TITLE,
    template: '%s | Locdone',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Locdone',
  keywords: [
    'free pdf tools',
    'online pdf editor',
    'private pdf tools',
    'pdf tools no upload',
    'pdf tools in browser',
    'offline pdf tools',
    'client-side pdf',
    'jpg to pdf',
    'png to pdf',
    'image to pdf converter',
    'merge pdf free',
    'combine pdf online',
    'compress pdf',
    'reduce pdf size',
    'organize pdf pages',
    'reorder pdf pages',
    'rotate pdf',
    'redact pdf',
    'black out pdf',
    'pdf tools without signup',
    'pdf tools without watermark',
    'secure pdf tools',
  ],
  authors: [{ name: 'Locdone' }],
  creator: 'Locdone',
  publisher: 'Locdone',
  category: 'productivity',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logo-32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo-32.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://locdone.com',
    siteName: 'Locdone',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/logo-512.png',
        width: 512,
        height: 512,
        alt: 'Locdone — Free PDF Tools',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/logo-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://locdone.com/#website',
        url: 'https://locdone.com',
        name: 'Locdone',
        description: SITE_DESCRIPTION,
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://locdone.com/#app',
        name: 'Locdone',
        url: 'https://locdone.com',
        applicationCategory: 'Productivity',
        operatingSystem: 'Web Browser',
        description:
          'Free in-browser PDF tools: convert JPG/PNG to PDF, merge, compress, organize, and redact PDFs. Nothing is uploaded — every file is processed on your device.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'JPG to PDF',
          'Merge PDF',
          'Compress PDF',
          'Organize PDF',
          'Redact PDF',
          '100% client-side',
          'No account required',
          'No watermarks',
        ],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <div className="relative z-10 flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FirstDownloadToast />
      </body>
    </html>
  );
}
