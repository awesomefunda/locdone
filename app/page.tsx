import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import { TOOLS } from '@/lib/tools-registry';

const COMPLIANCE_SLUGS = new Set(['redact-pdf', 'strip-pdf-metadata', 'bates-number-pdf']);

const PERSONAS = [
  {
    label: 'Attorneys',
    detail:
      'Client files are privileged. Uploading them to iLovePDF, Smallpdf, or any cloud PDF tool is a professional ethics risk. Locdone processes entirely in your browser -- nothing ever leaves your machine.',
  },
  {
    label: 'Healthcare workers',
    detail:
      "PHI belongs in your hands. Most online PDF tools store files on their servers, which means a BAA, a data processing agreement, or a breach notice waiting to happen. Locdone doesn't touch your files.",
  },
  {
    label: 'Anyone who reads the fine print',
    detail:
      "Most free PDF tools monetize by processing your files on their servers. Locdone runs on open-source libraries in your browser tab. You can verify it -- open DevTools, watch the Network tab stay empty.",
  },
];

const FAQ = [
  {
    q: 'Why should I trust that nothing is uploaded?',
    a: "You shouldn't have to take our word for it. Press F12, open the Network tab, then drop a file and process it. You'll see zero outbound requests while your PDF is being handled. The processing code is open source and runs entirely in your browser using pdf-lib and pdf.js.",
  },
  {
    q: 'Is Locdone really free?',
    a: "Yes -- every tool is free, with no daily limits, no watermarks, and no signup. Locdone runs in your browser, so there are no servers to pay for.",
  },
  {
    q: 'How is Locdone different from iLovePDF or Smallpdf?',
    a: 'Those tools upload your file to their servers, process it there, then send it back. That model works, but it means your file touched a third-party computer. Locdone uses your browser as the processing engine -- the file never leaves your tab.',
  },
  {
    q: 'Is it safe to use before uploading documents to AI tools like ChatGPT?',
    a: "Yes -- that's one of the most common reasons people use Locdone. Redact the sensitive parts (SSN, account numbers, names, diagnoses) locally first, then share the cleaned version with an AI. Since nothing is uploaded to Locdone's servers, your original document stays private throughout.",
  },
  {
    q: 'Are my PDFs uploaded to a server?',
    a: "No. All processing happens locally in your browser using open-source libraries (pdf-lib and pdf.js). You can verify this yourself -- open your browser's Network tab and you'll see zero requests while a file is being processed.",
  },
  {
    q: 'Do I need to create an account?',
    a: "No account, no email, no sign-up. Open the site, drop a file, download the result.",
  },
  {
    q: 'Does it work on mobile?',
    a: "Yes. Locdone works in any modern browser on desktop, iOS, and Android.",
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

export default function HomePage() {
  const generalTools = TOOLS.filter((t) => !COMPLIANCE_SLUGS.has(t.slug));
  const complianceTools = TOOLS.filter((t) => COMPLIANCE_SLUGS.has(t.slug));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center md:px-6 md:pt-20">
        <div className="mb-7 inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-raised px-3.5 py-1.5 font-mono text-[11px] text-text-secondary">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent shadow-[0_0_6px_rgba(124,255,178,0.6)]" />
          free · local PDF tools · 0 uploads · 0 tracking
        </div>
        <h1 className="text-balance font-display text-[clamp(32px,5.5vw,54px)] italic leading-[1.08] tracking-tight">
          <em className="text-accent">Locdone</em> is a free PDF toolkit
          that runs in your browser, not ours.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-text-secondary">
          Merge, compress, redact, split, Bates-number &mdash; all processed
          locally on your device. No uploads. No account. No one else sees
          your files.
        </p>
        <p className="mt-3 font-mono text-xs text-text-tertiary">
          <span className="text-accent">Loc</span>al processing.{' '}
          <span className="text-accent">Done</span> instantly. That&rsquo;s
          the name. That&rsquo;s the architecture.
        </p>
      </section>

      {/* ── AI use case callout ──────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pt-10 md:px-6">
        <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-raised p-6 md:p-8">
          <div className="mb-1 font-mono text-[11px] text-accent uppercase tracking-widest">
            New use case
          </div>
          <h2 className="font-display text-xl italic leading-snug md:text-2xl">
            Sharing documents with AI? Redact first.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
            Millions of people now upload medical records, financial statements,
            and legal documents to ChatGPT, Claude, and other AI tools for
            analysis. Before you do &mdash; redact what doesn&rsquo;t need to be
            there. SSNs, account numbers, diagnoses, names. Gone from the file
            before it leaves your hands. Locally. Free.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/redact-pdf"
              className="inline-flex items-center gap-1.5 rounded-pill bg-accent px-5 py-2.5 text-sm font-medium text-bg-base transition-all hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow-strong"
            >
              Redact PDF before sharing
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/strip-pdf-metadata"
              className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-bg-elevated px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
            >
              Strip hidden metadata
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Persona strip ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pt-6 md:px-6">
        <div className="grid gap-px rounded-xl border border-border-subtle bg-border-subtle overflow-hidden sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <div key={p.label} className="bg-bg-raised p-5">
              <div className="mb-2 font-mono text-xs text-accent">{p.label}</div>
              <p className="text-xs leading-relaxed text-text-secondary">{p.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── General tools grid ───────────────────────────────────── */}
      <section id="tools" className="mx-auto max-w-5xl scroll-mt-20 px-5 pt-10 md:px-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-widest">General tools</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {generalTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group relative flex items-start gap-4 overflow-hidden rounded-lg border border-border-subtle bg-bg-raised p-5 shadow-card transition-all duration-200 hover:-translate-y-px hover:border-accent/60 hover:bg-bg-elevated"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bg-elevated ring-1 ring-border-subtle transition-all group-hover:ring-accent/30">
                <tool.Icon size={18} strokeWidth={1.5} className="text-accent" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg italic leading-tight">{tool.name}</h3>
                  <ArrowRight size={14} className="shrink-0 text-text-tertiary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent" aria-hidden />
                </div>
                <p className="mt-1 text-sm leading-snug text-text-secondary">{tool.short}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Compliance spotlight ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pt-10 md:px-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-accent uppercase tracking-widest">Compliance tools</span>
          <div className="h-px flex-1 bg-accent/20" />
        </div>
        <div className="rounded-xl border border-accent/25 bg-bg-raised overflow-hidden">
          <div className="flex flex-col gap-1 border-b border-border-subtle bg-bg-elevated px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl italic leading-snug">
                Built for professionals who legally can&rsquo;t click &ldquo;upload.&rdquo;
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary">
                HIPAA, attorney-client privilege, court protective orders &mdash; some documents
                cannot touch a third-party server. These tools don&rsquo;t.
              </p>
            </div>
            <Link
              href="/compliance"
              className="mt-3 inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-accent/40 px-4 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/10 sm:mt-0"
            >
              Why it matters
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid gap-px bg-border-subtle sm:grid-cols-3">
            {complianceTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="group flex flex-col gap-2 bg-bg-raised p-5 transition-colors hover:bg-bg-elevated"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-bg-elevated ring-1 ring-border-subtle transition-all group-hover:ring-accent/30">
                    <tool.Icon size={16} strokeWidth={1.5} className="text-accent" aria-hidden />
                  </div>
                  <ArrowRight size={13} className="text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                </div>
                <div>
                  <div className="font-display text-base italic leading-tight">{tool.name}</div>
                  <p className="mt-0.5 text-xs leading-snug text-text-secondary">{tool.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Locdone strip ────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pt-10 md:px-6">
        <div className="grid rounded-lg border border-border-subtle bg-bg-raised sm:grid-cols-3 sm:divide-x sm:divide-border-subtle">
          <Feature
            Icon={ShieldCheck}
            title="Private by architecture"
            body="The processing code runs inside your browser tab -- not on a server you're trusting blindly. Close your WiFi and it still works."
          />
          <Feature
            Icon={Zap}
            title="No queue. No wait."
            body="No upload progress bar. No 'your file is being processed' spinner. Drop a file, get a file."
          />
          <Feature
            Icon={InfinityIcon}
            title="Free forever, no catch"
            body="No watermarks, no daily limits, no signup. There's no server to pay for, so there's nothing to charge you for."
          />
        </div>
      </section>

      {/* ── Verification block ───────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pt-10 md:px-6">
        <div className="rounded-lg border border-border-subtle bg-bg-raised p-6 md:p-8">
          <h2 className="mb-2.5 font-display text-2xl italic md:text-[1.75rem]">
            Don&rsquo;t take our word for it.
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary md:text-base">
            Press{' '}
            <kbd className="rounded border border-border bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px]">F12</kbd>{' '}
            to open DevTools, switch to the Network tab, then drop any file into any Locdone tool.
            Watch it stay empty while your PDF is processed &mdash; that&rsquo;s the whole trust model.
          </p>
          <Link
            href="/privacy"
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-accent-dim hover:underline"
          >
            Read the privacy architecture
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 pb-20 pt-12 md:px-6">
        <h2 className="mb-2 text-center font-display text-2xl italic md:text-[1.75rem]">
          Frequently asked
        </h2>
        <p className="mb-8 text-center text-sm text-text-tertiary">
          Common questions, honest answers.
        </p>
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
              <p className="mt-3.5 text-sm leading-relaxed text-text-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({
  Icon,
  title,
  body,
}: {
  Icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3.5 p-5 sm:p-6">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg-elevated ring-1 ring-border-subtle">
        <Icon size={15} strokeWidth={1.75} className="text-accent" aria-hidden />
      </div>
      <div>
        <div className="text-sm font-medium text-text-primary">{title}</div>
        <p className="mt-1 text-sm leading-snug text-text-secondary">{body}</p>
      </div>
    </div>
  );
}
