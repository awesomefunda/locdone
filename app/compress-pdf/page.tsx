import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { CompressPdfClient } from '@/components/tools/CompressPdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('compress-pdf')!;

export const metadata: Metadata = {
  title: 'Compress PDF — Reduce File Size Locally',
  description:
    'Shrink PDF files in your browser without uploading them anywhere. Private, fast, free — at locdone.com.',
  alternates: { canonical: '/compress-pdf' },
  openGraph: {
    title: 'Compress PDF — Reduce File Size Locally | Locdone',
    description:
      'Shrink PDF files in your browser without uploading them anywhere.',
    url: 'https://locdone.com/compress-pdf',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Drop a PDF',
          body: 'Choose a compression level. Locdone reads the file directly from your disk through your browser\'s File API.',
        },
        {
          title: 'Pages are rebuilt smaller',
          body: 'Locdone renders each page with pdf.js, re-encodes it as a JPEG at your chosen quality, and assembles a new, smaller PDF.',
        },
        {
          title: 'Download the compressed file',
          body: 'The result is ready in your browser. No file ever travelled to a server — watch the Network tab if you want to verify.',
        },
      ]}
      faq={[
        {
          q: 'How much smaller will my file be?',
          a: 'For scanned documents, expect 40–70% reduction at Balanced. Text-only PDFs compress less because text is already efficiently stored.',
        },
        {
          q: 'Is the text still selectable in the compressed PDF?',
          a: 'No. Locdone rebuilds pages as images, so text becomes part of the picture. This is the honest tradeoff for working entirely in the browser without heavy WASM dependencies. A future Pro version will add text-preserving compression.',
        },
        {
          q: 'Which level should I pick?',
          a: 'Balanced suits most uses. Light keeps maximum quality for printing. Strong produces the smallest file, best when emailing scans.',
        },
        {
          q: 'Does this work for scanned documents?',
          a: 'Especially well. Scans are already image-based, so Locdone\'s approach compresses them aggressively without visible quality loss.',
        },
      ]}
    >
      <CompressPdfClient />
    </ToolPageLayout>
  );
}
