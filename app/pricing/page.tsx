import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — Locdone is 100% free',
  description:
    'Locdone is completely free. Every PDF tool, every feature, no signup, no daily limits, no watermarks. No hidden costs.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-raised px-3 py-1 font-mono text-[11px] text-text-secondary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(124,255,178,0.6)]" />
          free · no signup · no limits
        </div>
        <h1 className="mb-4 font-display text-[clamp(32px,6vw,52px)] italic leading-[1.05]">
          Locdone is <em className="text-accent">free.</em>
        </h1>
        <p className="text-balance text-[15px] leading-relaxed text-text-secondary md:text-base">
          Every tool. Every feature. No accounts, no daily limits, no
          watermarks on output, no "sign up to continue". The whole thing runs
          on your device, so there's nothing to pay for.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <div className="rounded-lg border border-accent/40 bg-bg-raised p-7 shadow-glow md:p-8">
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">
            Everything
          </div>
          <div className="mb-5 font-display text-5xl italic leading-none">
            $0
          </div>
          <p className="mb-6 text-sm text-text-secondary">
            No trial, no paywall, no "upgrade for more" nagging. Just the tools.
          </p>
          <FeatureList
            items={[
              'All tools, no time limits',
              'Unlimited conversions per day',
              'No watermarks on output',
              'No account required',
              'Works offline after first load',
              'Your files never leave your device',
            ]}
          />
          <Link
            href="/"
            className="mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-pill bg-accent px-5 py-3 text-sm font-medium text-bg-base transition-opacity hover:opacity-90"
          >
            Start using Locdone
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Honest line about sustainability */}
      <p className="mx-auto mt-8 max-w-lg text-center text-[13px] leading-relaxed text-text-tertiary">
        Locdone has no servers to run, so it costs almost nothing to operate.
        If we ever introduce paid features, the current tools will stay free —
        forever.
      </p>

      {/* Small FAQ */}
      <div className="mx-auto mt-16 max-w-2xl">
        <h2 className="mb-8 text-center font-display text-2xl italic md:text-3xl">
          Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border-subtle bg-bg-raised px-5 py-4 open:bg-bg-elevated"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
                <span>{item.q}</span>
                <span
                  className="ml-3 font-mono text-text-tertiary transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <Check
            size={16}
            strokeWidth={2.25}
            className="mt-0.5 shrink-0 text-accent"
          />
          <span className="text-text-primary">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const FAQ = [
  {
    q: 'Is Locdone really completely free?',
    a: "Yes. Every tool, every feature, no signup, no daily limits, no watermarks. There's no hidden cost.",
  },
  {
    q: "What's the catch?",
    a: "There isn't one. Locdone runs entirely in your browser, so there are no server costs to offset with ads or subscriptions. You use your own device's CPU to process your own files.",
  },
  {
    q: 'Will it stay free?',
    a: "The current tools will. If we ever add advanced features (batch processing, huge files, etc.), those might be paid — but what's available today will remain free.",
  },
  {
    q: 'Can I use Locdone for commercial work?',
    a: 'Yes. No restriction on commercial use. The processing core is MIT-licensed.',
  },
  {
    q: 'Are there ads?',
    a: 'No ads, no tracking, no analytics that follow you around the web.',
  },
];
