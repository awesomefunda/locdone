import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogLayout } from '@/app/blog/BlogLayout';

export const metadata: Metadata = {
  title: 'How to Redact a PDF Before Uploading to ChatGPT or Any AI Tool | Locdone',
  description: 'Millions of people share medical records, financial statements, and legal documents with AI tools. Here is how to remove sensitive information first — locally, free, and verifiably private.',
  alternates: { canonical: 'https://locdone.com/blog/redact-pdf-before-uploading-to-ai' },
  openGraph: {
    title: 'How to Redact a PDF Before Uploading to ChatGPT or Any AI Tool',
    description: 'Remove sensitive info from your PDF locally before sharing it with AI. Free, no upload required.',
  },
};

export default function Post() {
  return (
    <BlogLayout
      title="How to Redact a PDF Before Uploading to ChatGPT or Any AI Tool"
      description="Millions of people share medical records, financial statements, and legal documents with AI tools. Here is how to remove sensitive information first — locally, free, and verifiably private."
      date="2025-06-14"
      readingTime="5 min read"
      tags={['redaction', 'ai', 'privacy']}
    >
      <div className="space-y-5 text-sm leading-relaxed text-text-secondary md:text-base">
        <p>
          People are uploading sensitive documents to AI tools every day. Medical test results to
          understand a diagnosis. Bank statements to ask for budgeting advice. Legal contracts to
          check for unfavourable clauses. Tax returns to find deductions.
        </p>
        <p>
          This is genuinely useful. But it also means your most sensitive personal information —
          Social Security numbers, account numbers, diagnoses, names, addresses — is being sent to a
          third-party server and processed by a model whose data retention policy you probably
          have not read.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          What actually happens when you upload a PDF to an AI tool
        </h2>
        <p>
          When you attach a document to ChatGPT, Claude, Gemini, or any other AI assistant, the
          entire file is sent to that company's servers. The text is extracted, processed, and used
          to generate a response. Depending on the platform and your account settings, that content
          may be retained, used for model training, or accessible to support staff.
        </p>
        <p>
          OpenAI's default settings, for example, allow conversation content to be used to improve
          models unless you opt out. Most people never change the defaults.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          What you should redact before uploading
        </h2>
        <p>
          The goal is not to make the document useless to the AI — it is to remove the specific
          identifiers that create risk if they end up somewhere they should not.
        </p>
        <ul className="ml-4 list-disc space-y-1 text-text-secondary">
          <li>Social Security or National Insurance numbers</li>
          <li>Bank account and credit card numbers</li>
          <li>Full names (replace with initials or a placeholder if the AI does not need them)</li>
          <li>Dates of birth</li>
          <li>Home addresses</li>
          <li>Medical record numbers or patient IDs</li>
          <li>Passport or driving licence numbers</li>
          <li>Employer identification numbers</li>
        </ul>
        <p>
          In most cases, the AI does not need these identifiers to help you. It can summarise a
          medical report without knowing your patient ID. It can review a contract without knowing
          the precise home addresses of the parties.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          How to redact a PDF locally before uploading
        </h2>
        <p>
          True redaction means the text is permanently removed from the file — not just covered by a
          black box. A black annotation box in Preview or Adobe Reader leaves the underlying text
          intact and selectable. Anyone (or any AI) parsing the raw file can still read it.
        </p>
        <p>
          Locdone's{' '}
          <Link href="/redact-pdf" className="text-accent hover:underline">
            Redact PDF tool
          </Link>{' '}
          burns the redacted areas directly into the page as rendered pixels. The text is gone from
          the file structure, not just visually hidden.
        </p>
        <p>
          Critically, the redaction happens entirely in your browser. The original file — with the
          sensitive content still present — is never sent anywhere. You select the areas to redact,
          the tool processes the file locally, and you download a clean version.
        </p>
        <ol className="ml-4 list-decimal space-y-1 text-text-secondary">
          <li>
            Open{' '}
            <Link href="/redact-pdf" className="text-accent hover:underline">
              locdone.com/redact-pdf
            </Link>
          </li>
          <li>Drop your PDF in</li>
          <li>Draw boxes over every piece of information you want to remove</li>
          <li>Click Redact and download the clean file</li>
          <li>Upload the redacted version to ChatGPT, Claude, or wherever you need</li>
        </ol>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Should you also strip metadata?
        </h2>
        <p>
          Yes. PDF files carry hidden metadata that most people never see — the author name, the
          software used to create the document, creation and modification timestamps, and sometimes
          GPS coordinates or organisational information embedded by enterprise software.
        </p>
        <p>
          When you upload a document to an AI tool, that metadata is included. Use Locdone's{' '}
          <Link href="/strip-pdf-metadata" className="text-accent hover:underline">
            Strip PDF Metadata tool
          </Link>{' '}
          to remove it before uploading.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          The bottom line
        </h2>
        <p>
          AI tools are genuinely useful for understanding complex documents. Redacting the sensitive
          identifiers first takes about two minutes and meaningfully reduces the risk. The AI gets
          enough context to help you. The account number, SSN, and patient ID stay on your device.
        </p>
      </div>
    </BlogLayout>
  );
}
