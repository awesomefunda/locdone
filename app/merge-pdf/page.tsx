import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { MergePdfClient } from '@/components/tools/MergePdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('merge-pdf')!;

export const metadata: Metadata = {
  title: 'Merge PDFs — Combine Files Locally',
  description:
    'Combine PDFs in your browser. Fast, free, and your files never leave this device — at locdone.com.',
  alternates: { canonical: '/merge-pdf' },
  openGraph: {
    title: 'Merge PDFs — Combine Files Locally | Locdone',
    description:
      'Combine PDFs in your browser. Your files never leave this device.',
    url: 'https://locdone.com/merge-pdf',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Drop your PDFs',
          body: 'Add as many PDFs as you want. Drag them to reorder. They live in your browser tab, not on a server.',
        },
        {
          title: 'Locdone combines them',
          body: 'pdf-lib reads each file\'s pages and copies them into a single new document — byte-level work, done on your CPU.',
        },
        {
          title: 'Download the merged PDF',
          body: 'The combined file is available for download. No file ever left your computer in the process.',
        },
      ]}
      faq={[
        {
          q: 'Can I reorder files before merging?',
          a: 'Yes. Drag the files in the list to set the order they\'ll appear in the final PDF.',
        },
        {
          q: 'What if a PDF is password-protected?',
          a: 'Locdone will let you know it can\'t read encrypted PDFs and won\'t silently strip protection. Remove the password in your PDF viewer first, then come back.',
        },
        {
          q: 'Is there a limit on how many files?',
          a: 'No fixed cap. Practical limits depend on your device\'s memory. Locdone handles dozens of typical scans without issue.',
        },
        {
          q: 'Do I need an account?',
          a: 'No. Locdone has no login system. There\'s nothing to sign up for.',
        },
      ]}
    >
      <MergePdfClient />
    </ToolPageLayout>
  );
}
