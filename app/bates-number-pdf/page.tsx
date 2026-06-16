import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { BatesNumberPdfClient } from '@/components/tools/BatesNumberPdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('bates-number-pdf')!;

export const metadata: Metadata = {
  title: 'Bates Number PDF — Add Bates Stamps Free, No Upload',
  description:
    'Add Bates numbers to a PDF in your browser. Set your prefix, starting number, digit count, and position. Free, private, no upload required.',
  alternates: { canonical: '/bates-number-pdf' },
  openGraph: {
    title: 'Bates Number PDF — Free Bates Stamp Tool | Locdone',
    description:
      'Stamp sequential Bates numbers on every page of a PDF. Configurable prefix, position, and padding. Nothing uploaded.',
    url: 'https://locdone.com/bates-number-pdf',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Configure your stamp',
          body: 'Set the prefix (e.g. SMITH or DEF-), starting number, digit count, font size, and page position. A live preview shows exactly how the label will look.',
        },
        {
          title: 'Drop your PDF',
          body: 'Locdone reads the file locally — no upload. It counts the pages and shows you the first and last Bates label that will be applied.',
        },
        {
          title: 'Download the stamped PDF',
          body: 'Every page gets its Bates label drawn directly into the page content using Courier, the standard legal font. Pages stay text-searchable.',
        },
      ]}
      faq={[
        {
          q: 'What is a Bates number?',
          a: 'A Bates number (or Bates stamp) is a sequential identifier stamped on each page of a legal document set. It lets attorneys, courts, and parties reference exact pages — e.g. "see SMITH000042". The format is typically a prefix followed by a zero-padded page number.',
        },
        {
          q: 'Does the PDF get uploaded to a server?',
          a: 'No. The stamping runs entirely in your browser using pdf-lib. The file never leaves your device. Open DevTools → Network and you\'ll see no requests during processing.',
        },
        {
          q: 'Will the Bates numbers be part of the page content?',
          a: 'Yes. Locdone draws the label directly into each page\'s content stream, not as an annotation overlay. This means it prints correctly and cannot be accidentally hidden.',
        },
        {
          q: 'What font is used?',
          a: 'Courier — the conventional choice for legal documents, and a standard PDF font that does not need to be embedded.',
        },
        {
          q: 'Can I choose where on the page the stamp appears?',
          a: 'Yes. You can place the stamp at any of six positions: bottom-right, bottom-center, bottom-left, top-right, top-center, or top-left.',
        },
        {
          q: 'What if my document set spans multiple PDFs?',
          a: 'Set the starting number on each PDF to continue from where the previous one ended. For example, if the first PDF has 47 pages starting at 1, set the second PDF\'s starting number to 48.',
        },
      ]}
    
      relatedArticles={[
        { slug: 'bates-numbering-pdf-free', title: 'How to Add Bates Numbers to a PDF for Free' },
      ]}
    >
      <BatesNumberPdfClient />
    </ToolPageLayout>
  );
}
