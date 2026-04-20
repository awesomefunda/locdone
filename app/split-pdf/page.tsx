import type { Metadata } from 'next';
import { SplitPdfClient } from '@/components/tools/SplitPdfClient';
import { PrivacyStrip } from '@/components/PrivacyStrip';

export const metadata: Metadata = {
  title: 'Split PDF — Extract Pages',
  description:
    'Extract specific pages from a PDF or split into separate documents. Fast, private, in-browser processing. Files never uploaded.',
};

const HOW_IT_WORKS = [
  {
    title: 'Upload your PDF',
    body: 'Drop a PDF or click to browse. Your browser reads it locally — nothing is uploaded, ever.',
  },
  {
    title: 'Select pages',
    body: 'Click individual pages or use a range (e.g. "1-5, 7, 9"). Preview your selection before extracting.',
  },
  {
    title: 'Download',
    body: 'Extract your selected pages into a new PDF. Processed right here in your browser, fast and private.',
  },
];

const FAQ = [
  {
    q: 'Does splitting upload my PDF?',
    a: 'No. Everything happens in your browser. To verify: close your WiFi/internet, drop a PDF, and watch the Network tab in DevTools (F12) stay empty while processing.',
  },
  {
    q: 'Can I edit the page range after selecting?',
    a: 'Yes. Use the range input to type a new selection like "1-5, 7, 10-12". Or click the "Show list" button to manually toggle pages.',
  },
  {
    q: 'What file size limit is there?',
    a: "There's no hard limit, but very large PDFs (100+ MB) may take longer. Your browser's memory is the limit.",
  },
  {
    q: 'Can I remove pages instead of extracting?',
    a: 'Not directly in this tool. Instead, select all pages *except* the ones you want to remove, then extract.',
  },
  {
    q: 'What formats does this support?',
    a: 'Only standard PDFs. Encrypted or heavily corrupted files may fail to load.',
  },
];

export default function SplitPdfPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-2xl px-5 pb-10 pt-14 text-center md:px-6 md:pt-20">
        <h1 className="text-balance font-display text-[clamp(34px,6vw,54px)] italic leading-[1.05] tracking-tight">
          Split PDFs,{' '}
          <em className="text-accent">extract pages</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          Extract specific pages from your PDF. Use a range or click individually.
          All processing happens on your device.
        </p>
      </section>

      {/* Tool surface */}
      <section className="mx-auto max-w-2xl px-5 pb-8 md:px-6">
        <SplitPdfClient />
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
          No servers. No uploads. Just your browser processing your PDF.
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
