'use client';

import { useCallback, useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import {
  compressPdf,
  getCompressProfile,
  type CompressLevel,
} from '@/lib/tools/compress-pdf';
import { formatBytes, stripExt } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'processing'; file: File }
  | { kind: 'done'; blob: Blob; filename: string; originalSize: number }
  | { kind: 'error'; message: string };

export function CompressPdfClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [level, setLevel] = useState<CompressLevel>('balanced');
  const [progress, setProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState('reading');
  const [detail, setDetail] = useState<string | undefined>();
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const run = useCallback(
    async (file: File) => {
      setState({ kind: 'processing', file });
      setProgress(0);
      setStageLabel('reading');
      startProcessing();

      try {
        const bytes = await compressPdf(file, level, (p) => {
          if (p.totalPages > 0) {
            const base = (p.currentPage - 1) / p.totalPages;
            const offset =
              p.stage === 'rendering' ? 0 : p.stage === 'encoding' ? 0.5 / p.totalPages : 0;
            setProgress(Math.min(0.99, base + offset));
          }
          setStageLabel(p.stage);
          setDetail(
            p.totalPages > 0 ? `page ${p.currentPage} of ${p.totalPages}` : undefined
          );
        });
        setProgress(1);
        stopProcessing();
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        const filename = `${stripExt(file.name)}-compressed.pdf`;
        setState({ kind: 'done', blob, filename, originalSize: file.size });
      } catch (err) {
        stopProcessing();
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Compression failed.',
        });
      }
    },
    [level, startProcessing, stopProcessing]
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
        files={[{ name: state.file.name, size: formatBytes(state.file.size) }]}
      />
    );
  }

  if (state.kind === 'done') {
    return (
      <SuccessPanel
        filename={state.filename}
        blob={state.blob}
        originalSize={state.originalSize}
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
        accept={['application/pdf', '.pdf']}
        onFiles={(files) => run(files[0])}
        title="Drop a PDF, or click to browse"
        hint="Locdone will rebuild it smaller."
        dragTitle="Drop it. It stays here."
      />

      <div className="rounded-lg border border-border-subtle bg-bg-raised p-4">
        <div className="mb-3 text-sm font-medium">Compression</div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {(['light', 'balanced', 'strong'] as CompressLevel[]).map((lv) => {
            const profile = getCompressProfile(lv);
            const [label, rest] = profile.label.split(' — ');
            const isSel = level === lv;
            return (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                className={`rounded-md border p-4 text-left transition-colors ${
                  isSel
                    ? 'border-accent bg-bg-elevated'
                    : 'border-border bg-bg-elevated hover:border-text-tertiary'
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    isSel ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                  {label}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">{rest}</div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-xs text-text-tertiary">
          Text in the output is no longer selectable — Locdone rebuilds pages as
          images. Best for scans and image-heavy PDFs.
        </p>
      </div>
    </div>
  );
}
