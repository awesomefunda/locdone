import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle bg-bg-raised/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="brand-mark" aria-hidden />
              <span className="font-display text-xl italic">
                Loc<em className="not-italic font-normal text-accent">done</em>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-text-secondary">
              Locally processed. Instantly done. PDF tools that never upload your
              files — because the files never leave your device.
            </p>
            <p className="mt-4 font-mono text-xs text-text-tertiary">
              Locally processed since 2026.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-text-tertiary">
              Tools
            </h3>
            <ul className="space-y-2">
              {TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}`}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-text-tertiary">
              Locdone
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/locdone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-6 text-xs text-text-tertiary md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Locdone. MIT licensed core.</div>
          <div className="font-mono">
            No cookies · No tracking · No uploads
          </div>
        </div>
      </div>
    </footer>
  );
}
