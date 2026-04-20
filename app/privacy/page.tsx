import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy — the architecture, not the promise',
  description:
    "How Locdone works: every byte of processing happens in your browser. No uploads. No servers. Verifiable in your own Network tab.",
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-6 md:py-24">
      <h1 className="mb-4 font-display text-[clamp(36px,6vw,56px)] italic leading-[1.05]">
        <em className="text-accent">Privacy</em>, verifiable.
      </h1>
      <p className="mb-10 text-lg text-text-secondary">
        Locdone's first line of its privacy policy is this: we don't collect,
        store, or process your files on any server. Below is why that's a
        structural fact, not a promise.
      </p>

      <Section title="The short version">
        <p>
          Every PDF tool on Locdone runs as JavaScript in your browser tab.
          Your files are read by your browser, manipulated in your browser's
          memory, and handed back to you through your browser's standard
          download mechanism. There are no file uploads, anywhere, ever.
        </p>
      </Section>

      <Section title="Verify it yourself">
        <p>
          Open your browser's devtools (<kbd className="rounded-sm border border-border bg-bg-elevated px-2 py-0.5 font-mono text-xs">F12</kbd>{' '}
          on most desktop browsers). Click the Network tab. Come back to
          Locdone, pick any tool, and drop a file. Watch the Network tab stay
          empty while processing runs.
        </p>
        <p>
          That's not a marketing screenshot. It's a thing you can do right now,
          from this page.
        </p>
      </Section>

      <Section title="What we do collect">
        <p>
          Page views. That's it. Collected via{' '}
          <a
            href="https://plausible.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Plausible Analytics
          </a>
          , which uses no cookies and stores no personal data. The aggregate
          numbers help us know which tools get used; they don't tell us anything
          about who used them or what files went through them.
        </p>
        <p>
          No Google Analytics. No Facebook Pixel. No trackers of any kind. There
          are also no cookies on locdone.com — Plausible doesn't set any, and
          we don't add our own.
        </p>
      </Section>

      <Section title="What about the Pro upgrade?">
        <p>
          When (eventually) you buy Locdone Pro, you'll receive a license key.
          Your browser stores it locally. Pro features check the key client-side
          — there's no server validation that could otherwise create a network
          dependency. This means Pro continues to work offline, indefinitely,
          even if Locdone the company vanishes tomorrow.
        </p>
        <p>
          Payment is processed by Lemon Squeezy. Their privacy policy covers the
          transaction. Locdone never sees your card details.
        </p>
      </Section>

      <Section title="What we don't have, on purpose">
        <ul className="ml-5 list-disc space-y-2">
          <li>No user accounts (there's no login)</li>
          <li>No cookies (there's nothing to track across sessions)</li>
          <li>No file-processing servers (there's no infrastructure to audit)</li>
          <li>No third-party scripts (no AdSense, no Intercom, no Hotjar)</li>
          <li>No CDN-level request logging tied to your files</li>
        </ul>
      </Section>

      <Section title="Open source">
        <p>
          The processing layer — every function that touches your file — is
          open source under MIT at{' '}
          <a
            href="https://github.com/locdone"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            github.com/locdone
          </a>
          . Read it. Grep for <code className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-xs">fetch(</code> in the
          tool files. You'll find zero matches.
        </p>
      </Section>

      <div className="mt-16 rounded-lg border border-border bg-bg-raised p-8">
        <h2 className="mb-3 font-display text-2xl italic">Ready to try it?</h2>
        <p className="mb-6 text-sm text-text-secondary">
          Pick a tool. Open your Network tab first if you want to watch the
          proof live.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-pill bg-accent px-5 py-2.5 text-sm font-medium text-bg-base transition-all hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow-strong"
        >
          Back to the tools <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-2xl italic">{title}</h2>
      <div className="space-y-4 text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  );
}
