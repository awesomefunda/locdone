'use client';

import { useCallback, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import {
  applyBatesNumbers,
  formatBatesLabel,
  BATES_DEFAULTS,
  type BatesOptions,
  type BatesPosition,
} from '@/lib/tools/bates-number-pdf';
import { stripExt } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'processing'; filename: string }
  | { kind: 'done'; blob: Blob; filename: string; pageCount: number }
  | { kind: 'error'; message: string };

const POSITIONS: { value: BatesPosition; label: string }[] = [
  { value: 'bottom-right', label: 'Bottom right' },
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'top-center', label: 'Top center' },
  { value: 'top-left', label: 'Top left' },
];

export function BatesNumberPdfClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [progress, setProgress] = useState(0);
  const [opts, setOpts] = useState<BatesOptions>(BATES_DEFAULTS);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    setPendingFile(file);
    // Quick page count peek (no rendering needed)
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      setPageCount(null);
    }
  }, []);

  const run = useCallback(async () => {
    if (!pendingFile) return;
    setState({ kind: 'processing', filename: pendingFile.name });
    setProgress(0.2);
    startProcessing();
    try {
      const bytes = await applyBatesNumbers(pendingFile, opts);
      setProgress(1);
      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const pc = pageCount ?? 0;
      setState({
        kind: 'done',
        blob,
        filename: `${stripExt(pendingFile.name)}-bates.pdf`,
        pageCount: pc,
      });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Bates numbering failed.',
      });
    }
  }, [pendingFile, opts, pageCount, startProcessing, stopProcessing]);

  const reset = () => {
    setState({ kind: 'idle' });
    setPendingFile(null);
    setPageCount(null);
    setProgress(0);
  };

  const update = (patch: Partial<BatesOptions>) =>
    setOpts((o) => ({ ...o, ...patch }));

  if (state.kind === 'processing') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel="stamping"
        networkCount={processingCount}
        files={[{ name: state.filename }]}
      />
    );
  }

  if (state.kind === 'done') {
    return (
      <SuccessPanel
        filename={state.filename}
        blob={state.blob}
        onReset={reset}
        savingsLabel={`${state.pageCount} page${state.pageCount === 1 ? '' : 's'} stamped`}
      />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  // Config + optional file preview
  const previewLabel = formatBatesLabel(opts, 0);
  const lastLabel = pageCount !== null ? formatBatesLabel(opts, pageCount - 1) : null;

  return (
    <div className="space-y-4">
      {!pendingFile ? (
        <DropZone
          accept={['application/pdf', '.pdf']}
          onFiles={onDrop}
          title="Drop a PDF to Bates-number it"
          hint="Stamps sequential labels on every page — no upload, all in-browser."
          dragTitle="Drop it. It stays here."
        />
      ) : (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-bg-raised p-4 text-sm">
          <span className="flex-1 min-w-0 truncate">
            <span className="font-medium">{pendingFile.name}</span>
            {pageCount !== null && (
              <span className="ml-2 text-text-tertiary">· {pageCount} page{pageCount === 1 ? '' : 's'}</span>
            )}
          </span>
          <button
            onClick={reset}
            className="rounded-pill border border-border bg-bg-elevated px-4 py-2 text-xs text-text-secondary transition-colors hover:border-text-tertiary hover:text-text-primary"
          >
            Change file
          </button>
          <button
            onClick={run}
            className="rounded-pill bg-accent px-5 py-2 text-xs font-medium text-bg-base transition-all hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow-strong"
          >
            Stamp &amp; download
          </button>
        </div>
      )}

      {/* Configuration */}
      <div className="rounded-lg border border-border-subtle bg-bg-raised p-5 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Bates stamp options</p>
          {/* Live preview */}
          <span className="rounded border border-border-subtle bg-bg-elevated px-3 py-1 font-mono text-xs text-accent">
            {previewLabel}
            {lastLabel && lastLabel !== previewLabel && (
              <span className="text-text-tertiary"> → {lastLabel}</span>
            )}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Prefix */}
          <div>
            <label className="mb-1.5 block font-mono text-xs text-text-tertiary">
              Prefix
            </label>
            <input
              type="text"
              value={opts.prefix}
              onChange={(e) => update({ prefix: e.target.value })}
              placeholder="e.g. SMITH- or DOC"
              className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 font-mono text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent"
            />
          </div>

          {/* Start number */}
          <div>
            <label className="mb-1.5 block font-mono text-xs text-text-tertiary">
              Starting number
            </label>
            <input
              type="number"
              min={0}
              value={opts.startNumber}
              onChange={(e) =>
                update({ startNumber: Math.max(0, parseInt(e.target.value) || 0) })
              }
              className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>

          {/* Digits */}
          <div>
            <label className="mb-1.5 block font-mono text-xs text-text-tertiary">
              Digit count (zero-padding)
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={opts.digits}
              onChange={(e) =>
                update({ digits: Math.max(1, Math.min(12, parseInt(e.target.value) || 6)) })
              }
              className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>

          {/* Font size */}
          <div>
            <label className="mb-1.5 block font-mono text-xs text-text-tertiary">
              Font size (pt)
            </label>
            <input
              type="number"
              min={6}
              max={24}
              value={opts.fontSize}
              onChange={(e) =>
                update({ fontSize: Math.max(6, Math.min(24, parseInt(e.target.value) || 9)) })
              }
              className="w-full rounded-md border border-border bg-bg-elevated px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="mb-2 block font-mono text-xs text-text-tertiary">
            Stamp position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p.value}
                onClick={() => update({ position: p.value })}
                className={`rounded-md border px-3 py-2 text-xs transition-colors ${
                  opts.position === p.value
                    ? 'border-accent bg-bg-elevated text-accent'
                    : 'border-border bg-bg-elevated text-text-secondary hover:border-text-tertiary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!pendingFile && (
        <p className="font-mono text-xs text-text-tertiary text-center">
          Configure options above, then drop your PDF to stamp it.
        </p>
      )}
      </div>
  );
}
