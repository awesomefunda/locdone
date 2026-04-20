'use client';

import { Check, Download, RotateCcw } from 'lucide-react';
import { formatBytes, downloadBlob } from '@/lib/utils';
import { markDownload } from '@/lib/first-download';

type SuccessPanelProps = {
  filename: string;
  blob: Blob;
  originalSize?: number;
  onReset: () => void;
  savingsLabel?: string;
};

export function SuccessPanel({
  filename,
  blob,
  originalSize,
  onReset,
  savingsLabel,
}: SuccessPanelProps) {
  const size = blob.size;
  const savings =
    originalSize && originalSize > size
      ? Math.round((1 - size / originalSize) * 100)
      : null;

  const handleDownload = () => {
    downloadBlob(blob, filename);
    markDownload();
  };

  return (
    <div className="animate-fade-up rounded-lg border border-border bg-bg-raised p-6">
      <h2 className="mb-1 font-display text-3xl italic text-accent">Done.</h2>
      <p className="mb-5 text-sm text-text-secondary">
        Processed on this device. Ready to download.
      </p>

      <div className="mb-5 flex items-center gap-3 rounded-md border border-border-subtle bg-bg-elevated px-4 py-3.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent"
          aria-hidden
        >
          <Check size={16} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium" title={filename}>
            {filename}
          </div>
          <div className="mt-0.5 font-mono text-xs text-text-secondary">
            {formatBytes(size)}
            {savings !== null && savings > 0 && (
              <span className="ml-2 text-accent">
                · {savings}% smaller
              </span>
            )}
            {savingsLabel && (
              <span className="ml-2 text-text-tertiary">· {savingsLabel}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-sm font-medium text-bg-base transition-all duration-200 hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow"
        >
          <Download size={15} strokeWidth={2} />
          Download
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-border hover:bg-bg-raised hover:text-text-primary"
        >
          <RotateCcw size={15} strokeWidth={2} />
          Do another
        </button>
      </div>

      <p className="mt-5 border-t border-border-subtle pt-4 font-mono text-xs text-text-tertiary">
        Still 0 uploads. Still 0 tracking.
      </p>
    </div>
  );
}
