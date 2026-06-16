import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TOOLS, type Tool } from '@/lib/tools-registry';
import { PrivacyStrip } from './PrivacyStrip';

type RelatedArticle = { title: string; slug: string };

type ToolPageLayoutProps = {
  tool: Tool;
  children: React.ReactNode;
  howItWorks: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  relatedArticles?: RelatedArticle[];
};

export function ToolPageLayout({
  tool,
  children,
  howItWorks,
  faq,
  relatedArticles,
}: ToolPageLayoutProps) {
  const relatedTools = TOOLS.filter((t) => t.slug !== tool.slug);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 pb-10 pt-14 text-center md:px-6 md:pt-20">
        <h1 className="text-balance font-display text-[clamp(34px,6vw,54px)] italic leading-[1.05] tracking-tight">
          {tool.taglineLead}{' '}
          <em className="text-accent">{tool.taglineAccent}</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          {tool.description}
        </p>
      </section>

      {/* Tool surface */}
      <section className="mx-auto max-w-2xl px-5 pb-8 md:px-6">
        {children}
        <div className="mt-7">
          <PrivacyStrip />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-6">
        <h2 className="mb-2.5 text-center font-display text-[1.75rem] italic">
          How Locdone does this
        </h2>
        <p className="mb-10 text-center text-sm text-text-tertiary">
          No servers. No uploads. Just your browser's own abilities.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, i) => (
            <div
              key={i}
              className="rounded-lg border border-border-subtle bg-bg-raised p-6 shadow-card"
            >
              <div className="mb-3 font-mono text-xs font-medium text-accent">
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
      <section className="mx-auto max-w-2xl px-5 pb-12 pt-0 md:px-6">
        <h2 className="mb-8 text-center font-display text-[1.75rem] italic">
          Questions
        </h2>
        <div className="space-y-2">
          {faq.map((item, i) => (
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

      {/* Related articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mx-auto max-w-2xl px-5 pb-10 pt-0 md:px-6">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            From the blog
          </div>
          <div className="space-y-2">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-raised px-4 py-3 transition-all hover:border-accent/40 hover:bg-bg-elevated"
              >
                <span className="text-sm text-text-secondary group-hover:text-text-primary">
                  {a.title}
                </span>
                <ArrowRight
                  size={13}
                  className="shrink-0 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related tools */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-4 md:px-6">
        <h2 className="mb-2 text-center font-display text-[1.75rem] italic">
          More tools
        </h2>
        <p className="mb-8 text-center text-sm text-text-tertiary">
          Every one runs on your device. Nothing is uploaded.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {relatedTools.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="group flex items-start gap-3 rounded-lg border border-border-subtle bg-bg-raised p-5 shadow-card transition-all duration-200 hover:-translate-y-px hover:border-accent/60 hover:bg-bg-elevated"
            >
              <t.Icon
                size={18}
                strokeWidth={1.5}
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{t.name}</span>
                  <ArrowRight
                    size={13}
                    className="text-text-tertiary transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
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
