import type { Metadata } from 'next';
import { ScanFolderClient } from '@/components/tools/ScanFolderClient';
import { PrivacyStrip } from '@/components/PrivacyStrip';

export const metadata: Metadata = {
  title: 'Scan Folder for PDFs',
  description:
    'Scan any local folder or repo for PDF files. Find, filter, download, and merge PDFs — all in your browser, nothing uploaded.',
};

const HOW_IT_WORKS = [
  {
    title: 'Pick a folder',
    body: 'Click the button or drag any folder onto the page. Your browser reads the directory tree locally — no files are uploaded, ever.',
  },
  {
    title: 'Review your PDFs',
    body: 'Every PDF found is listed with its path and size. Filter by name, select the ones you need, or download any file individually.',
  },
  {
    title: 'Merge or download',
    body: 'Download files one at a time, or select multiple and merge them into a single PDF — all processed right here, in this tab.',
  },
];

const FAQ = [
  {
    q: 'Which browsers support folder scanning?',
    a: 'The folder picker (webkitdirectory) works in Chrome, Firefox, Edge, and Safari. Folder drag-and-drop works in all Chromium-based browsers. If drag-and-drop doesn\'t work for you, use the button instead.',
  },
  {
    q: 'Does this upload my files?',
    a: "No. Everything happens in your browser tab. To verify: close your WiFi/internet, drop a folder, scan and merge some PDFs. Open DevTools (F12) and check the Network tab — it stays empty the whole time. That's the guarantee.",
  },
  {
    q: 'How large can the folder be?',
    a: 'There is no hard limit. The browser reads files directly from disk so even large repos scan quickly. Merging many large PDFs may take a few seconds depending on total size.',
  },
  {
    q: 'Can I merge PDFs from different subfolders?',
    a: 'Yes. All PDFs in the folder are listed regardless of how deep they are. Use the filter to find what you need, select across any subdirectory, and merge in one step.',
  },
];

export default function ScanFolderPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 pb-10 pt-14 text-center md:px-6 md:pt-20">
        <h1 className="text-balance font-display text-[clamp(34px,6vw,54px)] italic leading-[1.05] tracking-tight">
          Scan a folder{' '}
          <em className="text-accent">for PDFs</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          Point at any folder — a repo, your Downloads, a project directory — and
          see every PDF inside it. Filter, download, or merge them. Nothing is
          uploaded.
        </p>
      </section>

      {/* Tool surface */}
      <section className="mx-auto max-w-2xl px-5 pb-8 md:px-6">
        <ScanFolderClient />
        <div className="mt-7">
          <PrivacyStrip />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-6">
        <h2 className="mb-2.5 text-center font-display text-[1.75rem] italic">
          How it works
        </h2>
        <p className="mb-10 text-center text-sm text-text-tertiary">
          No servers. No uploads. Just your browser reading your disk.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
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
          {FAQ.map((item, i) => (
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
    </div>
  );
}
