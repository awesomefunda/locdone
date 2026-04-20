'use client';

import { clamp } from '@/lib/utils';

type ProcessingPanelProps = {
  /** 0..1 */
  progress: number;
  stageLabel: string;
  detail?: string;
  /** Live count of network requests during processing — should be 0 */
  networkCount: number;
  files?: { name: string; size?: string; done?: boolean }[];
};

export function ProcessingPanel({
  progress,
  stageLabel,
  detail,
  networkCount,
  files,
}: ProcessingPanelProps) {
  const pct = Math.round(clamp(progress, 0, 1) * 100);

  return (
    <div
      className="animate-fade-up rounded-lg border border-border bg-bg-raised p-6"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-5 flex items-center gap-2.5 text-sm text-text-primary">
        <span
          className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-border border-t-accent"
          aria-hidden
        />
        <span>Processing on this device</span>
      </div>

      <div
        className="mb-2.5 h-1 overflow-hidden rounded-pill bg-bg-elevated"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-pill bg-gradient-to-r from-accent-dim to-accent transition-[width] duration-300 ease-out-expo"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mb-5 flex justify-between font-mono text-xs text-text-secondary">
        <span>
          {stageLabel}
          {detail && <span className="ml-2 text-text-tertiary">· {detail}</span>}
        </span>
        <span className="font-medium tabular-nums text-accent">{pct}%</span>
      </div>

      {files && files.length > 0 && (
        <ul className="mb-5">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 border-b border-border-subtle py-2 text-sm text-text-secondary last:border-b-0"
            >
              <span
                className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                  f.done ? 'bg-accent shadow-[0_0_6px_rgba(124,255,178,0.5)]' : 'bg-border'
                }`}
                aria-hidden
              />
              <span className="flex-1 truncate">{f.name}</span>
              {f.size && (
                <span className="font-mono text-xs text-text-tertiary">
                  {f.size}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <NetworkReadout count={networkCount} />
    </div>
  );
}

export function NetworkReadout({ count }: { count: number }) {
  const isZero = count === 0;
  return (
    <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-elevated px-4 py-3 font-mono text-xs">
      <span className="text-text-secondary">Network activity</span>
      <span
        className={`flex items-center gap-2 font-medium ${
          isZero ? 'text-accent' : 'text-warning'
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            isZero ? 'bg-accent shadow-[0_0_6px_rgba(124,255,178,0.6)]' : 'bg-warning'
          }`}
          aria-hidden
        />
        {count} request{count === 1 ? '' : 's'}
      </span>
    </div>
  );
}
