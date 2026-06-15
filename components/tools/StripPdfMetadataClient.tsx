'use client';

import { useCallback, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import { readPdfMetadata, stripPdfMetadata, type MetadataSnapshot } from '@/lib/tools/strip-pdf-metadata';
import { stripExt } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'reading'; filename: string }
  | { kind: 'preview'; file: File; filename: string; meta: MetadataSnapshot }
  | { kind: 'processing' }
  | { kind: 'done'; blob: Blob; filename: string; stripped: number }
  | { kind: 'error'; message: string };

const FIELD_LABELS: [keyof MetadataSnapshot, string][] = [
  ['title', 'Title'],
  ['author', 'Author'],
  ['subject', 'Subject'],
  ['keywords', 'Keywords'],
  ['creator', 'Created with'],
  ['producer', 'PDF producer'],
  ['creationDate', 'Created'],
  ['modificationDate', 'Modified'],
];

export function StripPdfMetadataClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [progress, setProgress] = useState(0);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const load = useCallback(
    async (file: File) => {
      setState({ kind: 'reading', filename: file.name });
      startProcessing();
      try {
        const meta = await readPdfMetadata(file);
        stopProcessing();
        setState({ kind: 'preview', file, filename: file.name, meta });
      } catch (err) {
        stopProcessing();
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Could not read PDF.',
        });
      }
    },
    [startProcessing, stopProcessing]
  );

  const run = async () => {
    if (state.kind !== 'preview') return;
    const { file, filename, meta } = state;

    // Count non-empty fields
    const fieldCount = FIELD_LABELS.filter(([k]) => meta[k]).length + (meta.hasXmp ? 1 : 0);

    setState({ kind: 'processing' });
    setProgress(0.2);
    startProcessing();
    try {
      const bytes = await stripPdfMetadata(file);
      setProgress(1);
      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setState({
        kind: 'done',
        blob,
        filename: `${stripExt(filename)}-clean.pdf`,
        stripped: fieldCount,
      });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Metadata strip failed.',
      });
    }
  };

  const reset = () => setState({ kind: 'idle' });

  if (state.kind === 'reading') {
    return (
      <ProcessingPanel
        progress={0.3}
        stageLabel="reading"
        networkCount={processingCount}
      />
    );
  }

  if (state.kind === 'processing') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel="stripping"
        networkCount={processingCount}
      />
    );
  }

  if (state.kind === 'done') {
    return (
      <SuccessPanel
        filename={state.filename}
        blob={state.blob}
        onReset={reset}
        savingsLabel={`${state.stripped} metadata field${state.stripped === 1 ? '' : 's'} removed`}
      />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  if (state.kind === 'preview') {
    const { meta, filename } = state;
    const populated = FIELD_LABELS.filter(([k]) => meta[k]);
    const hasAny = populated.length > 0 || meta.hasXmp;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-bg-raised p-4 text-sm">
          <span className="flex-1 min-w-0 truncate font-medium">{filename}</span>
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
            Strip all metadata
          </button>
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-raised">
          <div className="border-b border-border-subtle px-5 py-3.5">
            <p className="text-sm font-medium">
              {hasAny
                ? `Found ${populated.length + (meta.hasXmp ? 1 : 0)} metadata field${populated.length + (meta.hasXmp ? 1 : 0) === 1 ? '' : 's'}`
                : 'No metadata found — this PDF is already clean'}
            </p>
            {hasAny && (
              <p className="mt-0.5 font-mono text-xs text-text-tertiary">
                All of the following will be permanently removed.
              </p>
            )}
          </div>
          <div className="divide-y divide-border-subtle">
            {populated.map(([key, label]) => (
              <div key={key} className="flex items-start gap-4 px-5 py-3">
                <span className="w-28 shrink-0 font-mono text-[11px] text-text-tertiary pt-0.5">
                  {label}
                </span>
                <span className="min-w-0 text-xs text-text-secondary break-all">
                  {String(meta[key])}
                </span>
              </div>
            ))}
            {meta.hasXmp && (
              <div className="flex items-start gap-4 px-5 py-3">
                <span className="w-28 shrink-0 font-mono text-[11px] text-text-tertiary pt-0.5">
                  XMP stream
                </span>
                <span className="text-xs text-text-secondary">
                  Embedded XMP metadata packet
                </span>
              </div>
            )}
          </div>
          {!hasAny && (
            <div className="px-5 py-4 text-sm text-text-tertiary">
              You can still download a stripped copy — Locdone will ensure no metadata is present.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <DropZone
      accept={['application/pdf', '.pdf']}
      onFiles={(files) => load(files[0])}
      title="Drop a PDF to inspect and clean"
      dragTitle="Drop it. It stays here."
    />
  );
}
