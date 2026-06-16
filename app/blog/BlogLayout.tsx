import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function BlogLayout({
  title,
  description,
  date,
  readingTime,
  tags,
  children,
}: {
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  children: React.ReactNode;
}) {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-6 md:py-16">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-text-tertiary transition-colors hover:text-accent"
      >
        <ArrowLeft size={12} />
        All articles
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-pill border border-border-subtle px-2.5 py-0.5 font-mono text-[11px] text-text-tertiary"
          >
            {t}
          </span>
        ))}
      </div>

      <h1 className="font-display text-[clamp(26px,4vw,38px)] italic leading-[1.1] tracking-tight">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">{description}</p>

      <div className="mt-4 flex items-center gap-3 font-mono text-xs text-text-tertiary">
        <span>{formatted}</span>
        <span>&middot;</span>
        <span>{readingTime}</span>
      </div>

      <hr className="my-8 border-border-subtle" />

      <div className="prose-locdone">{children}</div>

      <hr className="my-10 border-border-subtle" />

      <div className="rounded-lg border border-border-subtle bg-bg-raised p-5">
        <div className="mb-1 font-mono text-[11px] text-accent uppercase tracking-widest">
          Try it now
        </div>
        <p className="text-sm text-text-secondary">
          All Locdone tools are free and run entirely in your browser. No uploads, no account, no watermarks.
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-accent px-4 py-2 text-sm font-medium text-bg-base transition-all hover:-translate-y-px hover:shadow-glow-strong"
        >
          Browse all tools
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
