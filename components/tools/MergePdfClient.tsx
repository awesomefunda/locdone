'use client';

import { useCallback, useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import { mergePdfs } from '@/lib/tools/merge-pdf';
import { formatBytes } from '@/lib/utils';

type QueuedFile = { file: File; id: string };

type State =
  | { kind: 'collecting'; files: QueuedFile[] }
  | { kind: 'processing'; files: QueuedFile[] }
  | { kind: 'done'; blob: Blob; filename: string }
  | { kind: 'error'; message: string };

export function MergePdfClient() {
  const [state, setState] = useState<State>({ kind: 'collecting', files: [] });
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const addFiles = useCallback(
    (incoming: File[]) => {
      setState((prev) => {
        const existing = prev.kind === 'collecting' ? prev.files : [];
        const next = [
          ...existing,
          ...incoming.map((f) => ({
            file: f,
            id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
          })),
        ];
        return { kind: 'collecting', files: next };
      });
    },
    []
  );

  const removeFile = (id: string) => {
    setState((prev) => {
      if (prev.kind !== 'collecting') return prev;
      return { kind: 'collecting', files: prev.files.filter((f) => f.id !== id) };
    });
  };

  const reorder = (from: number, to: number) => {
    setState((prev) => {
      if (prev.kind !== 'collecting') return prev;
      const copy = [...prev.files];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return { kind: 'collecting', files: copy };
    });
  };

  const merge = async () => {
    if (state.kind !== 'collecting' || state.files.length < 2) return;
    const queue = state.files;
    setState({ kind: 'processing', files: queue });
    setProgress(0);
    startProcessing();

    try {
      const bytes = await mergePdfs(
        queue.map((q) => q.file),
        (p) => {
          setCurrentFile(p.filename);
          setProgress(p.current / p.total);
        }
      );
      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setState({ kind: 'done', blob, filename: 'merged.pdf' });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Merge failed.',
      });
    }
  };

  const reset = () => {
    setState({ kind: 'collecting', files: [] });
    setProgress(0);
  };

  if (state.kind === 'processing') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel="merging"
        detail={currentFile}
        networkCount={processingCount}
        files={state.files.map((f) => ({
          name: f.file.name,
          size: formatBytes(f.file.size),
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

  const fileCount = state.files.length;
  const canMerge = fileCount >= 2;

  return (
    <div className="space-y-4">
      <DropZone
        accept={['application/pdf', '.pdf']}
        multiple
        onFiles={addFiles}
        title={fileCount === 0 ? 'Drop PDFs, or click to browse' : 'Add more PDFs'}
        hint={
          fileCount === 0
            ? 'Drop at least two PDFs to merge.'
            : 'Drag to reorder. Click to remove.'
        }
        dragTitle="Drop them. They stay here."
      />

      {fileCount > 0 && (
        <div className="rounded-lg border border-border-subtle bg-bg-raised p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium">
              {fileCount} {fileCount === 1 ? 'file' : 'files'}
            </span>
            <span className="font-mono text-xs text-text-tertiary">
              drag to reorder
            </span>
          </div>

          <ul className="space-y-2">
            {state.files.map((qf, i) => (
              <li
                key={qf.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== i) {
                    reorder(dragIndex, i);
                  }
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`flex cursor-grab items-center gap-3 rounded-md border border-border-subtle bg-bg-elevated px-3.5 py-3 ${
                  dragIndex === i ? 'opacity-40' : ''
                }`}
              >
                <GripVertical
                  size={16}
                  className="shrink-0 text-text-tertiary"
                  aria-hidden
                />
                <span className="w-6 shrink-0 text-center font-mono text-xs text-text-tertiary">
                  {i + 1}
                </span>
                <span
                  className="min-w-0 flex-1 truncate text-sm"
                  title={qf.file.name}
                >
                  {qf.file.name}
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  {formatBytes(qf.file.size)}
                </span>
                <button
                  onClick={() => removeFile(qf.id)}
                  className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-raised hover:text-error"
                  aria-label={`Remove ${qf.file.name}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={merge}
            disabled={!canMerge}
            className="mt-5 w-full rounded-pill bg-accent px-5 py-3 text-sm font-medium text-bg-base transition-all hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow-strong disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-tertiary disabled:shadow-none disabled:hover:translate-y-0"
          >
            {canMerge
              ? `Merge ${fileCount} PDFs`
              : fileCount === 1
              ? 'Add one more to merge'
              : 'Add PDFs to merge'}
          </button>
        </div>
      )}
    </div>
  );
}
