'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

type ErrorPanelProps = {
  message: string;
  onReset: () => void;
};

export function ErrorPanel({ message, onReset }: ErrorPanelProps) {
  return (
    <div className="animate-fade-up rounded-lg border border-error/40 bg-bg-raised p-7">
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-error/15 text-error"
          aria-hidden
        >
          <AlertCircle size={18} />
        </div>
        <div>
          <h2 className="mb-1 font-display text-2xl italic text-error">
            Didn't work.
          </h2>
          <p className="text-sm text-text-secondary">{message}</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-elevated px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-tertiary hover:bg-bg-raised"
      >
        <RotateCcw size={16} />
        Try again
      </button>
    </div>
  );
}
