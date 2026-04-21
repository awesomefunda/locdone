import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import { TOOLS } from '@/lib/tools-registry';

export default function HomePage() {
  return (
    <div>
      {/* Hero — compact, one screenful */}
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center md:px-6 md:pt-20">
        <div className="mb-7 inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-raised px-3.5 py-1.5 font-mono text-[11px] text-text-secondary">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent shadow-[0_0_6px_rgba(124,255,178,0.6)]" />
          free · open source · 0 uploads · 0 tracking
        </div>

        <h1 className="text-balance font-display text-[clamp(36px,6.5vw,60px)] italic leading-[1.05] tracking-tight">
          <em className="text-accent">Your files never leave this device.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-balance text-base leading-relaxed text-text-secondary">
          Free PDF tools — convert, merge, compress, organize, and redact right
          in your browser. No uploads, no signup, no watermarks.
        </p>

      </section>

      {/* Tool grid — the primary door into the product */}
      <section id="tools" className="mx-auto max-w-5xl scroll-mt-20 px-5 pt-14 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group relative flex items-start gap-4 overflow-hidden rounded-lg border border-border-subtle bg-bg-raised p-5 shadow-card transition-all duration-200 hover:-translate-y-px hover:border-accent/60 hover:bg-bg-elevated"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bg-elevated ring-1 ring-border-subtle transition-all group-hover:ring-accent/30">
                <tool.Icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-accent"
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg italic leading-tight">
                    {tool.name}
                  </h3>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-text-tertiary transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                    aria-hidden
                  />
                </div>
                <p className="mt-1 text-sm leading-snug text-text-secondary">
                  {tool.short}
                </p>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* Brand story — name meaning, architecture in one breath */}
      <section className="mx-auto max-w-5xl px-5 pt-8 md:px-6">
        <p className="text-center text-sm text-text-tertiary">
          Why &ldquo;Locdone&rdquo;?{' '}
          <strong className="text-text-secondary font-medium">
            <span className="text-accent">Loc</span>al processing.{' '}
            <span className="text-accent">Done</span> instantly.
          </strong>{' '}
          The name is the architecture.
        </p>
      </section>

      {/* Compact "why" row — three benefits, one strip */}
      <section className="mx-auto max-w-5xl px-5 pt-6 md:px-6">
        <div className="grid rounded-lg border border-border-subtle bg-bg-raised sm:grid-cols-3 sm:divide-x sm:divide-border-subtle">
          <Feature
            Icon={ShieldCheck}
            title="Truly private"
            body="Close your WiFi. Drop a file. Watch DevTools (F12) Network tab stay empty while processing — that's the guarantee."
          />
          <Feature
            Icon={Zap}
            title="Instant"
            body="No upload queue, no waiting room. Drop a file, get a file."
          />
          <Feature
            Icon={InfinityIcon}
            title="Free, no catch"
            body="No watermarks, no signup, no daily limits. Every tool, every feature."
          />
        </div>
      </section>

      {/* Verify — compact, single block */}
      <section className="mx-auto max-w-3xl px-5 pt-10 md:px-6">
        <div className="rounded-lg border border-border-subtle bg-bg-raised p-6 md:p-8">
          <h2 className="mb-2.5 font-display text-2xl italic md:text-[1.75rem]">
            Don't take our word for it.
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary md:text-base">
            Press{' '}
            <kbd className="rounded border border-border bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px]">
              F12
            </kbd>{' '}
            to open devtools, switch to the Network tab, then drop any file into
            any Locdone tool. Watch it stay empty while your PDF is processed —
            that's the whole trust model.
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

      {/* SEO / FAQ — light content for search visibility, compact accordion */}
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
        <p className="mt-1 text-sm leading-snug text-text-secondary">
          {body}
        </p>
      </div>
    </div>
  );
}

const FAQ = [
  {
    q: 'Is Locdone really free?',
    a: "Yes — every tool is free, with no daily limits, no watermarks, and no signup. Locdone runs in your browser, so there are no servers to pay for.",
  },
  {
    q: 'Are my PDFs uploaded to a server?',
    a: "No. All processing happens locally in your browser using open-source libraries (pdf-lib and pdf.js). You can verify this yourself — open your browser's Network tab and you'll see zero requests while a file is being processed.",
  },
  {
    q: 'Do I need to create an account?',
    a: "No account, no email, no sign-up. Open the site, drop a file, download the result.",
  },
  {
    q: 'What file types are supported?',
    a: "PDF files for merge, compress, organize, and redact; JPG and PNG images for conversion to PDF. Most browsers handle files up to around 100 MB smoothly.",
  },
  {
    q: 'How is Locdone different from other online PDF tools?',
    a: "Most \"online PDF\" tools upload your file to a server, process it there, then send it back. Locdone never uploads anything — your file stays in your browser tab from start to finish. That means it's private by design, works offline once loaded, and stays fast even for sensitive documents.",
  },
  {
    q: 'Does it work on mobile?',
    a: "Yes. Locdone works in any modern browser on desktop, iOS, and Android. It's also installable as a PWA.",
  },
];
