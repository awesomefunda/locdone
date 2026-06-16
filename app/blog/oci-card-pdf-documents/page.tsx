import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogLayout } from '@/app/blog/BlogLayout';

export const metadata: Metadata = {
  title: 'How to Prepare PDF Documents for Your OCI Card Application | Locdone',
  description: 'A step-by-step guide to merging, converting, and organising the PDF documents required for an OCI card application — without uploading your passport scans to a third-party server.',
  alternates: { canonical: 'https://locdone.com/blog/oci-card-pdf-documents' },
  openGraph: {
    title: 'How to Prepare PDF Documents for Your OCI Card Application',
    description: 'Merge, convert and organise OCI card documents locally — no server upload for your passport scans.',
  },
};

export default function Post() {
  return (
    <BlogLayout
      title="How to Prepare PDF Documents for Your OCI Card Application"
      description="A step-by-step guide to merging, converting, and organising the PDF documents required for an OCI card application — without uploading your passport scans to a third-party server."
      date="2025-06-14"
      readingTime="4 min read"
      tags={['oci', 'merge', 'jpg-to-pdf']}
    >
      <div className="space-y-5 text-sm leading-relaxed text-text-secondary md:text-base">
        <p>
          The OCI (Overseas Citizen of India) card application requires a significant number of
          supporting documents — and the way they need to be submitted has changed over the years.
          Most applicants now submit through the online portal and need PDF files that meet specific
          size and format requirements.
        </p>
        <p>
          The catch: many of these documents are passport scans, birth certificates, and marriage
          certificates — exactly the kind of documents you do not want to upload to a random PDF
          tool on the internet.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Common documents required for OCI applications
        </h2>
        <p>
          Requirements vary based on your category (OCI for yourself, for a minor, renunciation
          proof, etc.), but most applicants need:
        </p>
        <ul className="ml-4 list-disc space-y-1 text-text-secondary">
          <li>Current foreign passport (all pages with data)</li>
          <li>Previous Indian passport or renunciation certificate</li>
          <li>Parents&apos; passports (both current and old Indian passports if applicable)</li>
          <li>Birth certificate</li>
          <li>Proof of current address</li>
          <li>Marriage certificate (if applying for spouse)</li>
          <li>Proof of Indian origin for parents/grandparents</li>
        </ul>
        <p>
          Several of these need to be submitted as a single merged PDF — for example, all pages of a
          passport combined into one file — or converted from JPEG scans into PDF format.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Step 1: Convert JPEG scans to PDF
        </h2>
        <p>
          If you have photographed your documents with a phone or scanned them as JPEG files, you
          need to convert them to PDF first. Use Locdone&apos;s{' '}
          <Link href="/jpg-to-pdf" className="text-accent hover:underline">
            JPG to PDF tool
          </Link>
          . Drop in your JPEG files, arrange them in the correct order, and download the PDF. No
          upload, no account.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Step 2: Merge multiple PDFs into one
        </h2>
        <p>
          The OCI portal often requires all passport pages as a single PDF. If you have scanned each
          page separately, use the{' '}
          <Link href="/merge-pdf" className="text-accent hover:underline">
            Merge PDF tool
          </Link>{' '}
          to combine them. Drag to reorder the pages, then download the merged file.
        </p>
        <p>
          This is also useful when combining a current passport scan with a previous passport scan
          into one document.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Step 3: Check file size
        </h2>
        <p>
          The OCI portal typically has a file size limit per document (often 1MB or 2MB). High-resolution
          scans can easily exceed this. If your merged PDF is too large, run it through the{' '}
          <Link href="/compress-pdf" className="text-accent hover:underline">
            Compress PDF tool
          </Link>{' '}
          to bring the size down while keeping it legible.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Why not just use iLovePDF or Smallpdf?
        </h2>
        <p>
          Those tools work, but they upload your file to their servers to process it. That means
          your passport scan — with your full name, date of birth, passport number, and photograph —
          passes through a third-party computer you know nothing about.
        </p>
        <p>
          Locdone processes everything in your browser. The passport scan never leaves your machine.
          You can verify this: open DevTools in your browser, go to the Network tab, and watch it
          stay empty while the tool processes your file.
        </p>

        <h2 className="pt-2 font-display text-xl italic text-text-primary">
          Quick checklist
        </h2>
        <ul className="ml-4 list-disc space-y-1 text-text-secondary">
          <li>Convert all JPEGs to PDF using the JPG to PDF tool</li>
          <li>Merge multi-page documents into single PDFs using the Merge PDF tool</li>
          <li>Compress files that exceed the portal&apos;s size limit</li>
          <li>Double-check page order before submitting</li>
          <li>Keep the originals — only upload the processed copies</li>
        </ul>

        <p>
          The whole process takes under ten minutes and your documents never leave your device.
        </p>
      </div>
    </BlogLayout>
  );
}
