import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools-registry';
import { PrivacyStrip } from '@/components/PrivacyStrip';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-5 pt-14 text-center md:px-6 md:pt-20">
        <div className="mb-7 inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-raised px-3.5 py-1.5 font-mono text-xs text-text-secondary">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent shadow-[0_0_6px_rgba(124,255,178,0.6)]" />
          0 uploads · 0 accounts · 0 tracking
        </div>

        <h1 className="text-balance font-display text-[clamp(40px,7vw,68px)] italic leading-[1.03] tracking-tight">
          Your documents
          <br />
          <em className="text-accent">never leave</em> this device.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-[17px] text-text-secondary">
          PDF tools that run entirely in your browser. No uploads. No servers.
          No accounts. Locally processed, instantly done.
        </p>
      </section>

      {/* Tool grid — the primary way into the product */}
      <section className="mx-auto max-w-4xl px-5 pt-12 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border-subtle bg-bg-raised p-6 transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-bg-elevated ${
                i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div>
                <tool.Icon
                  size={22}
                  strokeWidth={1.5}
                  className="mb-4 text-accent"
                  aria-hidden
                />
                <h3 className="mb-1.5 font-display text-2xl italic">
                  {tool.name}
                </h3>
                <p className="text-sm text-text-secondary">{tool.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-mono text-xs text-text-tertiary transition-colors group-hover:text-accent">
                open
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <PrivacyStrip />
        </div>
      </section>

      {/* The three pillars */}
      <section className="mx-auto max-w-5xl px-5 py-24 md:px-6">
        <h2 className="mb-3 text-center font-display text-4xl italic">
          Why Locdone is different
        </h2>
        <p className="mb-14 text-center text-sm text-text-secondary">
          Not a promise in a privacy policy. A consequence of the architecture.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          <Pillar
            num="01"
            title="Loc — local"
            body="Every byte of processing happens on your CPU, in your browser tab. pdf-lib and pdf.js are JavaScript libraries running as part of this page. There's no server to send your files to, even if we wanted one."
          />
          <Pillar
            num="02"
            title="Done — actually"
            body="No file size games. No waiting in a queue. No ad wall between you and your download. You drop a file, Locdone processes it, you download. That's it."
          />
          <Pillar
            num="03"
            title="Verifiable"
            body="Open your browser's Network tab. Drop a file. Watch it stay empty during processing. The proof is a single keyboard shortcut away — you don't have to trust us, because there's no "us" in the data flow."
          />
        </div>
      </section>

      {/* Verify CTA */}
      <section className="mx-auto max-w-3xl px-5 pb-24 md:px-6">
        <div className="rounded-lg border border-border bg-bg-raised p-8 md:p-10">
          <h2 className="mb-3 font-display text-3xl italic">
            Don't take our word for it.
          </h2>
          <p className="mb-6 text-text-secondary">
            Press <kbd className="rounded-sm border border-border bg-bg-elevated px-2 py-0.5 font-mono text-xs">F12</kbd>{' '}
            to open your browser's devtools. Go to the Network tab. Come back here,
            pick any tool, drop a file. Watch the network tab stay empty while Locdone
            processes your document.
          </p>
          <p className="mb-6 text-text-secondary">
            That's the moat. It's not a claim — it's a thing you can see.
          </p>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
          >
            Read the privacy architecture
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Pillar({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-raised p-7">
      <div className="mb-3 font-mono text-xs text-accent">{num}</div>
      <h3 className="mb-3 font-display text-2xl italic">{title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
    </div>
  );
}
