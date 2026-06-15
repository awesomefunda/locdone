import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { RedactPdfClient } from '@/components/tools/RedactPdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('redact-pdf')!;

export const metadata: Metadata = {
  title: 'Redact PDF -- Permanently Remove Sensitive Text, No Upload',
  description:
    'True PDF redaction: text is burned out of the page, not just covered with a black box. Free, private, runs in your browser. Nothing uploaded.',
  alternates: { canonical: '/redact-pdf' },
  openGraph: {
    title: 'Redact PDF -- Permanent Redaction, No Upload | Locdone',
    description:
      'True PDF redaction: text is removed from the page, not just overlaid. Free, private, runs in your browser.',
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
          body: 'Locdone renders each page in your browser. You stay in control -- the file never leaves this tab.',
        },
        {
          title: 'Draw over what to hide',
          body: 'Click and drag to cover sensitive info. Add as many redactions as you need across any page.',
        },
        {
          title: 'Save a flattened PDF',
          body: 'Locdone rasterizes redacted pages with the black areas burned in. The text underneath is gone from the file, not just covered.',
        },
      ]}
      faq={[
        {
          q: 'Is my PDF secure? Does it upload anywhere?',
          a: 'Your PDF never leaves your device. Verify by closing your internet connection, then drop a PDF and apply redactions. Open DevTools (F12) Network tab and watch it stay empty during processing.',
        },
        {
          q: "What's the difference between true redaction and drawing a black box?",
          a: 'Most "redact" tools layer a black rectangle on top of text -- but the original text is still in the file and can be extracted by selecting, copying, or running it through a PDF parser. Locdone rasterizes each redacted page into an image with those pixels simply gone. There is no underlying text to recover.',
        },
        {
          q: 'Is this HIPAA or court-filing compliant?',
          a: "Locdone handles the visible content properly: redacted text is gone from the page. For thorough compliance, also strip the PDF's metadata (author, software, creation date) using our Strip PDF Metadata tool -- metadata can identify who created the document even after redaction.",
        },
        {
          q: 'Will pages without redactions stay text-searchable?',
          a: 'Yes. Locdone copies untouched pages verbatim as vector content. Only pages with redactions are flattened to images.',
        },
        {
          q: 'Can I redact on mobile?',
          a: 'Touch drawing works in most mobile browsers. Precision is easier on a trackpad or mouse for small areas of text.',
        },
      ]}
    >
      <RedactPdfClient />
    </ToolPageLayout>
  );
}
