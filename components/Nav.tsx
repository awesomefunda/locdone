'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { TOOLS } from '@/lib/tools-registry';
import { BrandMark } from './BrandMark';
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
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Locdone home"
        >
          <BrandMark size={24} />
          <span className="font-display text-xl italic leading-none">
            Loc<em className="not-italic font-normal text-accent">done</em>
          </span>
        </Link>

        {/* Desktop nav — minimal: just Tools + Privacy */}
        <nav className="hidden items-center gap-0.5 md:flex">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-raised hover:text-text-primary"
              aria-expanded={open}
              aria-haspopup="menu"
            >
              Tools
              <ChevronDown
                size={13}
                className={cn('transition-transform duration-200', open && 'rotate-180')}
              />
            </button>

            <div
              className={cn(
                'absolute right-0 top-[calc(100%+6px)] w-[272px] rounded-lg border border-border bg-bg-elevated p-1.5 shadow-xl ring-1 ring-white/[0.04] transition-all duration-150',
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
                  className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors duration-100 hover:bg-bg-raised"
                  role="menuitem"
                >
                  <tool.Icon
                    size={16}
                    className="mt-0.5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <div>
                    <div className="text-sm font-medium text-text-primary">{tool.name}</div>
                    <div className="mt-0.5 text-xs text-text-tertiary">
                      {tool.short}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/privacy"
            className="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-raised hover:text-text-primary"
          >
            Privacy
          </Link>
        </nav>

        {/* Mobile nav button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-1.5 text-text-secondary transition-colors hover:bg-bg-raised md:hidden"
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-border-subtle bg-bg-raised/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-0.5 px-5 py-3">
            <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Tools
            </div>
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-bg-elevated"
              >
                <tool.Icon
                  size={16}
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
            <div className="mt-1.5 border-t border-border-subtle pt-1.5">
              <Link
                href="/privacy"
                className="block rounded-md px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
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
