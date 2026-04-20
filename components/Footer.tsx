import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';
import { BrandMark } from './BrandMark';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border-subtle bg-bg-raised/30">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark size={22} />
              <span className="font-display text-xl italic">
                Loc<em className="not-italic font-normal text-accent">done</em>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-text-secondary">
              Free, private PDF tools that run entirely in your browser — so
              your files never leave your device.
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

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border-subtle pt-6 text-xs text-text-tertiary md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Locdone. MIT licensed core.</div>
          <div className="font-mono">
            No cookies · No tracking · No uploads
          </div>
        </div>
      </div>
    </footer>
  );
}
