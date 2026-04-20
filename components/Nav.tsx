'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { TOOLS } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-base/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Locdone home">
          <span className="brand-mark" aria-hidden />
          <span className="font-display text-2xl italic leading-none">
            Loc<em className="not-italic font-normal text-accent">done</em>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
              aria-expanded={open}
              aria-haspopup="menu"
            >
              Tools
              <ChevronDown
                size={14}
                className={cn('transition-transform', open && 'rotate-180')}
              />
            </button>

            <div
              className={cn(
                'absolute right-0 top-[calc(100%+8px)] w-[280px] rounded-lg border border-border bg-bg-elevated p-2 shadow-2xl transition-all',
                open
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-1 opacity-0'
              )}
              role="menu"
            >
              {TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-bg-raised"
                  role="menuitem"
                >
                  <tool.Icon
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <div>
                    <div className="text-sm font-medium">{tool.name}</div>
                    <div className="mt-0.5 text-xs text-text-tertiary">
                      {tool.short}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/pricing"
            className="rounded-md px-3.5 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
          >
            Pricing
          </Link>
          <Link
            href="/privacy"
            className="rounded-md px-3.5 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-raised hover:text-text-primary"
          >
            Privacy
          </Link>
        </nav>

        {/* Mobile nav button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-text-secondary md:hidden"
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-border-subtle bg-bg-raised md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            <div className="px-3 py-1 font-mono text-xs uppercase tracking-wider text-text-tertiary">
              Tools
            </div>
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="flex items-start gap-3 rounded-md px-3 py-3 transition-colors hover:bg-bg-elevated"
              >
                <tool.Icon
                  size={18}
                  className="mt-0.5 shrink-0 text-accent"
                  strokeWidth={1.5}
                />
                <div>
                  <div className="text-sm font-medium">{tool.name}</div>
                  <div className="mt-0.5 text-xs text-text-tertiary">{tool.short}</div>
                </div>
              </Link>
            ))}
            <div className="mt-2 border-t border-border-subtle pt-2">
              <Link
                href="/pricing"
                className="block rounded-md px-3 py-2.5 text-sm text-text-secondary"
              >
                Pricing
              </Link>
              <Link
                href="/privacy"
                className="block rounded-md px-3 py-2.5 text-sm text-text-secondary"
              >
                Privacy
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
