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

export const metadata: Metadata = {
  metadataBase: new URL('https://locdone.com'),
  title: {
    default: 'Locdone — Locally processed. Instantly done.',
    template: '%s | Locdone',
  },
  description:
    'PDF tools that run entirely in your browser. Convert, merge, compress, organize, redact — your files never leave this device.',
  keywords: [
    'pdf tools',
    'private pdf',
    'offline pdf',
    'jpg to pdf',
    'merge pdf',
    'compress pdf',
    'redact pdf',
    'organize pdf',
    'client-side pdf',
  ],
  authors: [{ name: 'Locdone' }],
  creator: 'Locdone',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://locdone.com',
    siteName: 'Locdone',
    title: 'Locdone — Locally processed. Instantly done.',
    description:
      'PDF tools that run entirely in your browser. Files never leave this device.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locdone — Locally processed. Instantly done.',
    description:
      'PDF tools that run entirely in your browser. Files never leave this device.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
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
