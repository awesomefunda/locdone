import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { JpgToPdfClient } from '@/components/tools/JpgToPdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('jpg-to-pdf')!;

export const metadata: Metadata = {
  title: 'JPG to PDF — Convert Images Locally',
  description:
    'Convert JPG and PNG images to PDF in your browser. Files never leave your device. Free, no signup, no uploads — at locdone.com.',
  alternates: { canonical: '/jpg-to-pdf' },
  openGraph: {
    title: 'JPG to PDF — Convert Images Locally | Locdone',
    description:
      'Convert JPG and PNG images to PDF in your browser. Files never leave your device.',
    url: 'https://locdone.com/jpg-to-pdf',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Drop your images',
          body: 'JPG or PNG, single or batch. Your browser reads them directly off your disk — no upload happens, because there is no server to upload to.',
        },
        {
          title: 'Locdone embeds them',
          body: "pdf-lib runs as JavaScript in your browser's tab. It embeds each image into a new PDF document entirely in your computer's memory.",
        },
        {
          title: 'Download the PDF',
          body: 'The finished file is generated as a Blob and handed to your browser via the standard download mechanism. Nothing travels over the network.',
        },
      ]}
      faq={[
        {
          q: 'Are my images really not uploaded?',
          a: 'Really. Open your browser\'s Network tab before dropping a file. You\'ll see zero requests during processing. Locdone has no servers that could receive your images.',
        },
        {
          q: 'What image formats work?',
          a: 'JPG and PNG. For HEIC (iPhone), convert to JPG first using your phone\'s export options.',
        },
        {
          q: 'Is there a file size limit?',
          a: 'The practical limit is your browser\'s available memory — a few gigabytes on most devices. Locdone itself imposes no cap.',
        },
        {
          q: 'Does this work offline?',
          a: 'Yes, after the first visit. Locdone caches itself as a PWA; once loaded, it runs with the network turned off.',
        },
        {
          q: 'Is this tool free?',
          a: 'Free forever. The Locdone Pro upgrade unlocks batch convenience features and larger file handling. The core tool is unconditional.',
        },
      ]}
    >
      <JpgToPdfClient />
    </ToolPageLayout>
  );
}
