import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-registry';

export const metadata: Metadata = {
  title: 'Blog — PDF Privacy, Compliance & How-To Guides | Locdone',
  description: 'Practical guides on PDF privacy, HIPAA compliance, legal document tools, and how to process sensitive documents without uploading them to a server.',
  alternates: { canonical: 'https://locdone.com/blog' },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <div className="mb-2 font-mono text-[11px] text-accent uppercase tracking-widest">
        Locdone Blog
      </div>
      <h1 className="font-display text-[clamp(28px,4.5vw,42px)] italic leading-[1.1] tracking-tight">
        PDF privacy, compliance &amp; how-to guides.
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
        Practical articles on handling sensitive documents, HIPAA compliance, legal PDF workflows,
        and why where your files go matters.
      </p>

      <div className="mt-10 space-y-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-bg-raised p-5 transition-all hover:-translate-y-px hover:border-accent/40 hover:bg-bg-elevated"
          >
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-pill border border-border-subtle px-2 py-0.5 font-mono text-[10px] text-text-tertiary"
                >
                  {t}
                </span>
              ))}
              <span className="font-mono text-[10px] text-text-tertiary">{post.readingTime}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg italic leading-snug transition-colors group-hover:text-accent">
                {post.title}
              </h2>
              <ArrowRight
                size={15}
                className="mt-1 shrink-0 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
