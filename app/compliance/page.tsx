import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF Tools for Legal & Healthcare Compliance | Locdone',
  description:
    'True PDF redaction, metadata stripping, and Bates numbering — free, browser-based, no upload. Built for professionals who cannot send documents to a cloud service.',
  alternates: { canonical: '/compliance' },
  openGraph: {
    title: 'PDF Compliance Tools — No Upload | Locdone',
    description:
      'Permanent redaction, metadata removal, and Bates numbering. Runs in your browser. Files never leave your device.',
    url: 'https://locdone.com/compliance',
  },
};

const TOOLS = [
  {
    slug: 'redact-pdf',
    name: 'Redact PDF',
    tagline: 'Permanent redaction',
    description:
      'Text is burned out of the page — not overlaid with a box. Redacted content cannot be extracted by copy-paste or PDF parsers. Essential before sharing any document containing PHI, PII, or privileged content.',
    why: 'True pixel removal, not an overlay',
  },
  {
    slug: 'strip-pdf-metadata',
    name: 'Strip PDF Metadata',
    tagline: 'Remove hidden author & software data',
    description:
      'PDFs silently carry the author\'s name, the software used to create them, creation timestamps, and an XMP metadata packet. Locdone shows you what\'s present, then wipes it all — Info dictionary and XMP stream.',
    why: 'Required for anonymous or court-filed docs',
  },
  {
    slug: 'bates-number-pdf',
    name: 'Bates Number PDF',
    tagline: 'Sequential page stamps for legal sets',
    description:
      'Stamp every page with a configurable Bates label (e.g. SMITH000042). Set the prefix, start number, digit padding, font size, and position. Labels are drawn into page content — they print and copy correctly.',
    why: 'Standard requirement for litigation document sets',
  },
];

const FAQ = [
  {
    q: 'Why can\'t I just use iLovePDF or Smallpdf?',
    a: 'Those services upload your file to their servers for processing. For documents covered by HIPAA, attorney-client privilege, or court protective orders, transferring files to a third-party cloud service may be a compliance violation — regardless of that service\'s privacy policy. Locdone processes everything locally in your browser: the file never leaves your device.',
  },
  {
    q: 'How can I verify that nothing is uploaded?',
    a: 'Open your browser\'s developer tools (F12 → Network tab), then drop a file and process it. You\'ll see zero network requests made to any external server during processing. You can also disconnect from the internet after the page loads — the tools still work.',
  },
  {
    q: 'Is Locdone HIPAA compliant?',
    a: 'HIPAA compliance is a property of an organisation\'s practices, not a single tool. What Locdone provides is the technical foundation: no PHI ever leaves your device, no BAA is required because no data is transmitted, and no audit logs are kept. Your organisation\'s policies determine compliance — Locdone removes the cloud-upload risk from the equation.',
  },
  {
    q: 'Do I need to redact AND strip metadata?',
    a: 'For thorough preparation: yes. Redaction removes visible content from pages. Metadata stripping removes hidden identifying information embedded in the file itself — author name, software, timestamps. A fully redacted document can still reveal who created it via metadata. Use both tools for complete preparation.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function CompliancePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 pb-10 pt-14 text-center md:px-6 md:pt-20">
        <div className="mb-7 inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-raised px-3.5 py-1.5 font-mono text-[11px] text-text-secondary">
          <ShieldCheck size={12} className="text-accent" aria-hidden />
          files never leave your device
        </div>
        <h1 className="text-balance font-display text-[clamp(34px,6vw,54px)] italic leading-[1.05] tracking-tight">
          PDF tools for{' '}
          <em className="text-accent">legal &amp; healthcare</em>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-balance text-base leading-relaxed text-text-secondary">
          True redaction, metadata removal, and Bates numbering — free, private,
          and entirely in your browser. No uploads. No third-party servers. No BAA required.
        </p>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-4xl px-5 pb-16 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group flex flex-col rounded-lg border border-border-subtle bg-bg-raised p-6 shadow-card transition-all duration-200 hover:-translate-y-px hover:border-accent/60 hover:bg-bg-elevated"
            >
              <div className="mb-1 font-mono text-[11px] text-accent">{tool.tagline}</div>
              <h2 className="mb-3 font-display text-xl italic leading-snug">
                {tool.name}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                {tool.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="rounded border border-border-subtle bg-bg-elevated px-2.5 py-1 font-mono text-[10px] text-text-tertiary">
                  {tool.why}
                </span>
                <ArrowRight
                  size={14}
                  className="text-text-tertiary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                  aria-hidden
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why no-upload matters */}
      <section className="mx-auto max-w-2xl px-5 pb-14 md:px-6">
        <h2 className="mb-2 text-center font-display text-[1.75rem] italic">
          Why the upload question matters
        </h2>
        <p className="mb-8 text-center text-sm text-text-tertiary">
          For most PDF tools, your file travels to a server. For compliance work, that's the problem.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              heading: 'HIPAA covered entities',
              body: 'PHI uploaded to a cloud PDF tool may constitute an unauthorized disclosure. Without a signed BAA with that vendor, the upload itself is a violation — regardless of the redaction done after.',
            },
            {
              heading: 'Attorney-client privilege',
              body: 'Transmitting privileged documents through a third-party service introduces questions about waiver. Local processing eliminates the third party entirely.',
            },
            {
              heading: 'Court protective orders',
              body: 'Confidential documents subject to protective orders often cannot be shared with parties not named in the order. A cloud service may qualify as such a party.',
            },
            {
              heading: 'Government & export controls',
              body: 'Documents subject to CUI, ITAR, or similar controls may face restrictions on where they can be transmitted. Browser-local processing keeps them on the authorised device.',
            },
          ].map((item) => (
            <div
              key={item.heading}
              className="rounded-lg border border-border-subtle bg-bg-raised p-5"
            >
              <h3 className="mb-2 text-sm font-medium">{item.heading}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-5 pb-16 md:px-6">
        <h2 className="mb-8 text-center font-display text-[1.75rem] italic">
          Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border-subtle bg-bg-raised px-5 py-4 open:border-border open:bg-bg-elevated open:pb-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-text-primary">
                <span>{item.q}</span>
                <span
                  className="ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-subtle font-mono text-[11px] text-text-tertiary transition-all group-open:rotate-45 group-open:border-border group-open:text-text-secondary"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3.5 text-sm leading-relaxed text-text-secondary">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
