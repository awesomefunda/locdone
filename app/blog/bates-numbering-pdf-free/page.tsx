import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogLayout } from '@/app/blog/BlogLayout';

export const metadata: Metadata = {
  title: 'How to Add Bates Numbers to a PDF for Free | Locdone',
  description: 'Bates numbering is required for legal discovery and court filings. Here is what Bates numbers are, when you need them, and how to add them free without uploading your documents.',
  alternates: { canonical: 'https://locdone.com/blog/bates-numbering-pdf-free' },
  openGraph: {
    title: 'How to Add Bates Numbers to a PDF for Free',
    description: 'Add sequential Bates stamps to any PDF — free, no upload, no account. Court-ready in minutes.',
  },
};

export default function Post() {
  return (
    <BlogLayout
      title="How to Add Bates Numbers to a PDF for Free"
      description="Bates numbering is required for legal discovery and court filings. Here is what Bates numbers are, when you need them, and how to add them free without uploading your documents."
      date="2025-06-14"
      readingTime="4 min read"
      tags={['bates', 'legal']}
    >
      <div className="space-y-5 text-sm leading-relaxed text-text-secondary md:text-base">
        <p>
          If you are involved in litigation, legal discovery, or any process that requires producing
          documents to another party or a court, you have almost certainly encountered Bates
          numbering. It is one of those legal conventions that seems obscure until you need it —
          and then it is non-negotiable.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          What are Bates numbers?
        </h2>
        <p>
          Bates numbers are sequential identifiers stamped on each page of a document set. A
          typical Bates number looks like <code className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-xs text-accent">ACME-000001</code>, where
          &quot;ACME&quot; is a prefix identifying the producing party and &quot;000001&quot; is the
          page number. Each page in a production gets a unique, sequential Bates number.
        </p>
        <p>
          The convention is named after Edwin Bates, who patented a numbering machine in the 1890s.
          The name stuck long after physical stamping machines were replaced by software.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          When are Bates numbers required?
        </h2>
        <ul className="ml-4 list-disc space-y-1 text-text-secondary">
          <li>
            <strong className="text-text-primary">Discovery in civil litigation</strong> — when
            producing documents in response to a discovery request, Bates numbers allow both parties
            to reference specific pages unambiguously (e.g., &quot;see Exhibit A at ACME-000047&quot;)
          </li>
          <li>
            <strong className="text-text-primary">Court filings</strong> — many courts require
            exhibits to be Bates-stamped for the record
          </li>
          <li>
            <strong className="text-text-primary">Due diligence</strong> — in M&amp;A transactions,
            documents shared in a data room are often Bates-numbered for audit trail purposes
          </li>
          <li>
            <strong className="text-text-primary">Regulatory submissions</strong> — some regulatory
            bodies require numbered pages for document traceability
          </li>
          <li>
            <strong className="text-text-primary">Arbitration</strong> — arbitration panels
            frequently require numbered document productions
          </li>
        </ul>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          What the stamp typically contains
        </h2>
        <p>
          A standard Bates stamp has three components:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-text-secondary">
          <li>
            <strong className="text-text-primary">Prefix</strong> — usually an abbreviation of the
            producing party&apos;s name or the case/matter number (e.g., SMITH, DEF, PLF, ACME2024)
          </li>
          <li>
            <strong className="text-text-primary">Number</strong> — a zero-padded sequential number
            (e.g., 000001, 000002) — the padding ensures alphabetical and numerical sort order match
          </li>
          <li>
            <strong className="text-text-primary">Position</strong> — typically the bottom-right
            corner of each page, though some courts or parties specify a different position
          </li>
        </ul>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Why most free tools are not suitable for legal documents
        </h2>
        <p>
          Most online PDF tools that offer Bates numbering either charge for it (it is typically a
          premium feature in tools like Adobe Acrobat Pro) or upload your document to a server. For
          documents produced in litigation — which are often subject to protective orders and
          attorney-client privilege — uploading to a third-party server is not appropriate.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          How to add Bates numbers with Locdone
        </h2>
        <p>
          Locdone&apos;s{' '}
          <Link href="/bates-number-pdf" className="text-accent hover:underline">
            Bates Number PDF tool
          </Link>{' '}
          is free, requires no account, and processes the document entirely in your browser. The
          document never leaves your machine.
        </p>
        <ol className="ml-4 list-decimal space-y-1 text-text-secondary">
          <li>
            Go to{' '}
            <Link href="/bates-number-pdf" className="text-accent hover:underline">
              locdone.com/bates-number-pdf
            </Link>
          </li>
          <li>Drop your PDF in</li>
          <li>Set your prefix (e.g., SMITH or DEF)</li>
          <li>Set the starting number (useful when continuing a numbering sequence across multiple documents)</li>
          <li>Choose the position — bottom-right is the default</li>
          <li>Click Apply and download the stamped PDF</li>
        </ol>
        <p>
          The stamps are rendered in Courier, the standard monospaced font used in legal documents.
          The output is court-ready.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Continuing numbering across multiple documents
        </h2>
        <p>
          When producing multiple documents in a single production, each document needs to pick up
          where the last one left off. For example, if the first document ends at ACME-000043, the
          second document should start at ACME-000044.
        </p>
        <p>
          Set the starting number field accordingly for each document. Keep a note of the last Bates
          number used so you can continue the sequence without gaps or overlaps.
        </p>
      </div>
    </BlogLayout>
  );
}
