import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TOOLS, type Tool } from '@/lib/tools-registry';
import { PrivacyStrip } from './PrivacyStrip';

type ToolPageLayoutProps = {
  tool: Tool;
  children: React.ReactNode;
  howItWorks: { title: string; body: string }[];
  faq: { q: string; a: string }[];
};

export function ToolPageLayout({
  tool,
  children,
  howItWorks,
  faq,
}: ToolPageLayoutProps) {
  const relatedTools = TOOLS.filter((t) => t.slug !== tool.slug);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 pb-12 pt-12 text-center md:px-6 md:pt-16">
        <h1 className="text-balance font-display text-[clamp(36px,6vw,56px)] italic leading-[1.05] tracking-tight">
          {tool.taglineLead}{' '}
          <em className="text-accent">{tool.taglineAccent}</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base text-text-secondary">
          {tool.description}
        </p>
      </section>

      {/* Tool surface — the live interaction area */}
      <section className="mx-auto max-w-2xl px-5 pb-6 md:px-6">
        {children}
        <div className="mt-6">
          <PrivacyStrip />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-6">
        <h2 className="mb-3 text-center font-display text-3xl italic">
          How Locdone does this
        </h2>
        <p className="mb-10 text-center text-sm text-text-secondary">
          No servers. No uploads. Just your browser's own abilities.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {howItWorks.map((step, i) => (
            <div
              key={i}
              className="rounded-lg border border-border-subtle bg-bg-raised p-7"
            >
              <div className="mb-3 font-mono text-xs text-accent">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-2 font-display text-xl italic">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-5 py-16 md:px-6">
        <h2 className="mb-10 text-center font-display text-3xl italic">
          Questions
        </h2>
        <div className="space-y-2">
          {faq.map((item, i) => (
            <details
              key={i}
              className="group rounded-lg border border-border-subtle bg-bg-raised p-5 open:bg-bg-elevated"
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
      </section>

      {/* Related tools */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-6">
        <h2 className="mb-2 text-center font-display text-3xl italic">
          More tools
        </h2>
        <p className="mb-8 text-center text-sm text-text-secondary">
          All of them run on your device. None of them upload your files.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="group flex items-start gap-3 rounded-lg border border-border-subtle bg-bg-raised p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-bg-elevated"
            >
              <t.Icon
                size={20}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{t.name}</span>
                  <ArrowRight
                    size={14}
                    className="text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </div>
                <div className="mt-0.5 text-xs text-text-tertiary">{t.short}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
