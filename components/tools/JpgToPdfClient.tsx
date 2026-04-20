'use client';

import { useCallback, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import { imagesToPdf, type PageSize } from '@/lib/tools/image-to-pdf';
import { formatBytes, stripExt } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'processing'; files: File[] }
  | { kind: 'done'; blob: Blob; filename: string }
  | { kind: 'error'; message: string };

export function JpgToPdfClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [pageSize, setPageSize] = useState<PageSize>('fit');
  const [progress, setProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState('preparing');
  const [detail, setDetail] = useState<string | undefined>();
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const onFiles = useCallback(
    async (files: File[]) => {
      setState({ kind: 'processing', files });
      setProgress(0);
      setStageLabel('preparing');
      startProcessing();

      try {
        const bytes = await imagesToPdf(files, {
          pageSize,
          onProgress: (p) => {
            const frac = (p.current - 1 + stageFraction(p.stage)) / p.total;
            setProgress(Math.min(0.99, frac));
            setStageLabel(p.stage);
            setDetail(`${p.current} of ${p.total}`);
          },
        });
        setProgress(1);
        stopProcessing();
        // pdf-lib returns Uint8Array; wrap in a fresh ArrayBuffer-backed Blob
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        const baseName = files.length === 1 ? stripExt(files[0].name) : 'images';
        setState({ kind: 'done', blob, filename: `${baseName}.pdf` });
      } catch (err) {
        stopProcessing();
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    },
    [pageSize, startProcessing, stopProcessing]
  );

  const reset = () => {
    setState({ kind: 'idle' });
    setProgress(0);
  };

  if (state.kind === 'processing') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel={stageLabel}
        detail={detail}
        networkCount={processingCount}
        files={state.files.map((f) => ({
          name: f.name,
          size: formatBytes(f.size),
        }))}
      />
    );
  }

  if (state.kind === 'done') {
    return (
      <SuccessPanel
        filename={state.filename}
        blob={state.blob}
        onReset={reset}
      />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  return (
    <div className="space-y-4">
      <DropZone
        accept={['image/jpeg', 'image/png', '.jpg', '.jpeg', '.png']}
        multiple
        onFiles={onFiles}
        title="Drop images, or click to browse"
        hint="JPG or PNG. As many as you need."
        dragTitle="Drop them. They stay here."
      />

      <div className="rounded-lg border border-border-subtle bg-bg-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Page size</span>
          <span className="font-mono text-xs text-text-tertiary">optional</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['fit', 'letter', 'a4'] as PageSize[]).map((s) => (
            <button
              key={s}
              onClick={() => setPageSize(s)}
              className={`rounded-md border px-3 py-2.5 text-sm transition-colors ${
                pageSize === s
                  ? 'border-accent bg-bg-elevated text-accent'
                  : 'border-border bg-bg-elevated text-text-secondary hover:border-text-tertiary hover:text-text-primary'
              }`}
            >
              {s === 'fit' ? 'Fit to image' : s === 'letter' ? 'Letter' : 'A4'}
            </button>
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-text-tertiary">
          {pageSize === 'fit'
            ? 'Each page matches its image exactly. No letterboxing.'
            : pageSize === 'letter'
            ? 'US Letter (8.5 × 11 in). Images centered and scaled to fit.'
            : 'ISO A4 (210 × 297 mm). Images centered and scaled to fit.'}
        </p>
      </div>
    </div>
  );
}

function stageFraction(stage: 'reading' | 'embedding' | 'finalizing'): number {
  switch (stage) {
    case 'reading':
      return 0.2;
    case 'embedding':
      return 0.8;
    case 'finalizing':
      return 1;
  }
}
