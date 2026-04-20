import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — free forever, Pro is $29 once',
  description:
    'Locdone is free. Pro is a one-time $29 unlock for batch processing, larger files, and advanced features. No subscription.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 font-display text-[clamp(36px,6vw,56px)] italic leading-[1.05]">
          Free forever. <em className="text-accent">Pro once.</em>
        </h1>
        <p className="text-balance text-lg text-text-secondary">
          Locdone is a tool you own, not a service you rent. The free tier is
          the whole tool. Pro is a thank-you that unlocks nice-to-haves.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-5 md:grid-cols-2">
        {/* Free tier */}
        <div className="rounded-lg border border-border-subtle bg-bg-raised p-7">
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-text-tertiary">
            Free
          </div>
          <div className="mb-5 font-display text-4xl italic">$0</div>
          <p className="mb-6 text-sm text-text-secondary">
            Forever. No trial. No daily limits. Not a loss-leader.
          </p>
          <FeatureList
            items={[
              'All five tools, no time limits',
              'Files up to 100 MB',
              'Unlimited conversions per day',
              'Entirely on-device — always',
              'No watermarks on output',
              'No account required',
            ]}
          />
          <Link
            href="/"
            className="mt-7 inline-flex w-full items-center justify-center rounded-pill border border-border bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-tertiary"
          >
            Start using Locdone
          </Link>
        </div>

        {/* Pro tier */}
        <div className="relative rounded-lg border-[1.5px] border-accent bg-bg-raised p-7 shadow-glow">
          <div className="absolute -top-3 right-6 rounded-pill bg-accent px-3 py-1 font-mono text-[11px] font-medium text-bg-base">
            Buy once
          </div>
          <div className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">
            Pro
          </div>
          <div className="mb-5 font-display text-4xl italic">
            $29<span className="ml-1 align-middle text-sm text-text-tertiary not-italic font-mono">one time</span>
          </div>
          <p className="mb-6 text-sm text-text-secondary">
            Lifetime access. No subscription. No auto-renewal.
          </p>
          <FeatureList
            accent
            items={[
              'Everything in Free',
              'Files up to 2 GB',
              'Batch processing (drop 50 files, download a .zip)',
              'Advanced redaction (email, phone, SSN auto-detection)',
              'Metadata stripping on save',
              'Priority support email',
              'Early access to new tools',
            ]}
          />
          <button
            disabled
            className="mt-7 inline-flex w-full cursor-not-allowed items-center justify-center rounded-pill bg-bg-elevated px-5 py-3 text-sm font-medium text-text-tertiary"
            aria-label="Pro unlock coming soon"
          >
            Pro unlock — coming soon
          </button>
          <p className="mt-3 text-center font-mono text-[11px] text-text-tertiary">
            Payment handled by Lemon Squeezy
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="mb-10 text-center font-display text-3xl italic">
          Questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border-subtle bg-bg-raised p-5 open:bg-bg-elevated"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
                <span>{item.q}</span>
                <span className="ml-3 font-mono text-text-tertiary transition-transform group-open:rotate-45">
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

function FeatureList({
  items,
  accent,
}: {
  items: string[];
  accent?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <Check
            size={16}
            strokeWidth={2.25}
            className={`mt-0.5 shrink-0 ${accent ? 'text-accent' : 'text-text-secondary'}`}
          />
          <span className="text-text-primary">{item}</span>
        </li>
      ))}
    </ul>
  );
}

const FAQ = [
  {
    q: 'Why buy-once instead of a subscription?',
    a: "Subscriptions imply ongoing service. Locdone is a tool, not a service — once you have the license, it runs on your device without us. Subscriptions would also contradict the privacy story: if Locdone disappears, Pro still works forever.",
  },
  {
    q: 'What happens if I don\'t buy Pro?',
    a: "Nothing. The free tier isn't a crippled demo — it's the real tool. Pro unlocks conveniences (batching, larger files), not the core capability.",
  },
  {
    q: 'Does Pro validate online?',
    a: "No. Your license key is checked client-side, stored in your browser. This means Pro works offline and continues to work even if locdone.com goes down.",
  },
  {
    q: 'Can I use Locdone for commercial work?',
    a: "Yes. No commercial-use restriction on either tier. The processing core is MIT-licensed.",
  },
  {
    q: 'Is there a team plan?',
    a: "Not yet. If you need multiple seats, email us and we'll work something out.",
  },
];
