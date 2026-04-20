'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

type ErrorPanelProps = {
  message: string;
  onReset: () => void;
};

export function ErrorPanel({ message, onReset }: ErrorPanelProps) {
  return (
    <div className="animate-fade-up rounded-lg border border-error/30 bg-bg-raised p-6">
      <div className="mb-5 flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-error/10 text-error"
          aria-hidden
        >
          <AlertCircle size={16} strokeWidth={2} />
        </div>
        <div>
          <h2 className="mb-1 font-display text-xl italic text-error">
            Didn't work.
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-pill border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-border hover:bg-bg-raised hover:text-text-primary"
      >
        <RotateCcw size={14} strokeWidth={2} />
        Try again
      </button>
    </div>
  );
}
