import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { RedactPdfClient } from '@/components/tools/RedactPdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('redact-pdf')!;

export const metadata: Metadata = {
  title: 'Redact PDF — Black Out Sensitive Info Locally',
  description:
    'Draw redactions over sensitive content in PDFs. Nothing uploaded, nothing tracked — at locdone.com.',
  alternates: { canonical: '/redact-pdf' },
  openGraph: {
    title: 'Redact PDF — Black Out Sensitive Info Locally | Locdone',
    description:
      'Draw redactions over sensitive content in PDFs. Nothing uploaded, nothing tracked.',
    url: 'https://locdone.com/redact-pdf',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Drop a PDF',
          body: 'Locdone renders each page in your browser. You stay in control — the file never leaves this tab.',
        },
        {
          title: 'Draw over what to hide',
          body: 'Click and drag to cover sensitive info. Add as many redactions as you need across any page.',
        },
        {
          title: 'Save a flattened PDF',
          body: 'Locdone rebuilds pages with redactions as part of the image. The text underneath is removed, not just covered.',
        },
      ]}
      faq={[
        {
          q: 'Is my PDF secure? Does it upload anywhere?',
          a: 'Your PDF never leaves your device. Verify by closing your internet connection, then drop a PDF and apply redactions. Open DevTools (F12) Network tab and watch it stay empty during processing.',
        },
        {
          q: 'Does "removed" really mean removed?',
          a: 'Yes, within the redacted regions. Locdone rasterizes pages with redactions burned in — the original text isn\'t part of the output file anymore. You can confirm by trying to copy-paste from the redacted PDF.',
        },
        {
          q: 'Is this court-grade redaction?',
          a: 'For legal redaction workflows, pair Locdone with a specialized tool that also scrubs metadata and hidden layers. Locdone handles the visible content thoroughly, which covers the large majority of practical cases.',
        },
        {
          q: 'Will pages without redactions stay text-searchable?',
          a: 'Yes. Locdone copies untouched pages verbatim. Only pages with redactions are flattened.',
        },
        {
          q: 'Can I redact on mobile?',
          a: 'Touch drawing works in most mobile browsers. Precision is easier on a trackpad or mouse.',
        },
      ]}
    >
      <RedactPdfClient />
    </ToolPageLayout>
  );
}
