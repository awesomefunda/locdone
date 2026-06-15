import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { StripPdfMetadataClient } from '@/components/tools/StripPdfMetadataClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('strip-pdf-metadata')!;

export const metadata: Metadata = {
  title: 'Remove PDF Metadata — Strip Author, Creator & Hidden Data',
  description:
    'See and remove all hidden metadata from a PDF — author, creator, software, dates, and XMP. Runs locally in your browser. Nothing uploaded.',
  alternates: { canonical: '/strip-pdf-metadata' },
  openGraph: {
    title: 'Remove PDF Metadata | Locdone',
    description:
      'Strip author, software name, creation date, and XMP data from any PDF — without uploading it.',
    url: 'https://locdone.com/strip-pdf-metadata',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Inspect the file',
          body: 'Locdone reads the PDF in your browser and shows you every metadata field present — author, software, creation date, XMP packet.',
        },
        {
          title: 'Review and confirm',
          body: 'You see exactly what will be removed before anything happens. No surprises.',
        },
        {
          title: 'Download the clean PDF',
          body: 'Locdone wipes the Info dictionary and the XMP metadata stream, then hands you a clean PDF. The original stays untouched on your device.',
        },
      ]}
      faq={[
        {
          q: 'What metadata does this remove?',
          a: 'All standard PDF Info dictionary fields: Title, Author, Subject, Keywords, Creator (the application that created the file), Producer (the PDF library used), creation date, and modification date. It also removes the embedded XMP metadata stream, which can carry the same information in a different format.',
        },
        {
          q: 'Why does PDF metadata matter for compliance?',
          a: 'Metadata in a PDF can reveal the author\'s name, the software they used, when the document was created, and sometimes the organisation\'s internal systems. In legal discovery, court filings, and HIPAA-covered document exchanges, this information may need to be removed before sharing.',
        },
        {
          q: 'Does my file get uploaded anywhere?',
          a: 'No. Everything runs in your browser using pdf-lib, an open-source library. You can verify by opening DevTools → Network while processing — you\'ll see zero requests.',
        },
        {
          q: 'Will this affect the document content?',
          a: 'No. Only the metadata is removed. Text, images, formatting, and all page content remain exactly as they were.',
        },
        {
          q: 'Is this the same as redacting a PDF?',
          a: 'No — they solve different problems. Redaction removes visible content from pages (text and images). Metadata stripping removes hidden identifying information embedded in the file itself. For thorough compliance prep, do both.',
        },
      ]}
    >
      <StripPdfMetadataClient />
    </ToolPageLayout>
  );
}
