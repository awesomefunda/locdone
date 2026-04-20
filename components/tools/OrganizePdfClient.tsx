'use client';

import { useCallback, useState } from 'react';
import { RotateCw, Trash2 } from 'lucide-react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import {
  buildOrganizedPdf,
  loadPdfForOrganize,
  type PageState,
} from '@/lib/tools/organize-pdf';
import { formatBytes, stripExt } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'loading'; filename: string }
  | {
      kind: 'editing';
      filename: string;
      sourceBytes: ArrayBuffer;
      pages: PageState[];
    }
  | { kind: 'saving'; filename: string }
  | { kind: 'done'; blob: Blob; filename: string }
  | { kind: 'error'; message: string };

export function OrganizePdfClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('reading');
  const [detail, setDetail] = useState<string | undefined>();
  const [dragId, setDragId] = useState<string | null>(null);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const load = useCallback(
    async (file: File) => {
      setState({ kind: 'loading', filename: file.name });
      setProgress(0);
      setStage('rendering thumbnails');
      startProcessing();
      try {
        const { pages, sourceBytes } = await loadPdfForOrganize(
          file,
          (current, total) => {
            setProgress(current / total);
            setDetail(`page ${current} of ${total}`);
          }
        );
        stopProcessing();
        setState({
          kind: 'editing',
          filename: file.name,
          sourceBytes,
          pages,
        });
      } catch (err) {
        stopProcessing();
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Could not open PDF.',
        });
      }
    },
    [startProcessing, stopProcessing]
  );

  const save = async () => {
    if (state.kind !== 'editing') return;
    setState({ kind: 'saving', filename: state.filename });
    setProgress(0);
    setStage('building');
    startProcessing();
    try {
      const bytes = await buildOrganizedPdf(state.sourceBytes, state.pages);
      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setState({
        kind: 'done',
        blob,
        filename: `${stripExt(state.filename)}-organized.pdf`,
      });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Save failed.',
      });
    }
  };

  const updatePages = (pages: PageState[]) => {
    setState((s) => (s.kind === 'editing' ? { ...s, pages } : s));
  };

  const deletePage = (id: string) => {
    if (state.kind !== 'editing') return;
    updatePages(state.pages.filter((p) => p.id !== id));
  };

  const rotatePage = (id: string) => {
    if (state.kind !== 'editing') return;
    updatePages(
      state.pages.map((p) =>
        p.id === id
          ? { ...p, rotation: (((p.rotation + 90) % 360) as 0 | 90 | 180 | 270) }
          : p
      )
    );
  };

  const movePage = (fromId: string, toId: string) => {
    if (state.kind !== 'editing') return;
    const pages = [...state.pages];
    const fromIdx = pages.findIndex((p) => p.id === fromId);
    const toIdx = pages.findIndex((p) => p.id === toId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = pages.splice(fromIdx, 1);
    pages.splice(toIdx, 0, moved);
    updatePages(pages);
  };

  const reset = () => {
    setState({ kind: 'idle' });
    setProgress(0);
  };

  if (state.kind === 'loading' || state.kind === 'saving') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel={stage}
        detail={detail}
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
      />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  if (state.kind === 'editing') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-bg-raised p-4 text-sm">
          <span className="flex-1 min-w-0 truncate">
            <span className="font-medium">{state.filename}</span>
            <span className="ml-2 text-text-tertiary">
              · {state.pages.length} pages
            </span>
          </span>
          <button
            onClick={reset}
            className="rounded-pill border border-border bg-bg-elevated px-4 py-2 text-xs text-text-secondary transition-colors hover:border-text-tertiary hover:text-text-primary"
          >
            Start over
          </button>
          <button
            onClick={save}
            disabled={state.pages.length === 0}
            className="rounded-pill bg-accent px-5 py-2 text-xs font-medium text-bg-base transition-all hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow-strong disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-tertiary disabled:shadow-none disabled:hover:translate-y-0"
          >
            Save PDF
          </button>
        </div>

        <p className="font-mono text-xs text-text-tertiary">
          Drag pages to reorder · hover to rotate or delete
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {state.pages.map((page, idx) => (
            <div
              key={page.id}
              draggable
              onDragStart={() => setDragId(page.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId && dragId !== page.id) movePage(dragId, page.id);
                setDragId(null);
              }}
              onDragEnd={() => setDragId(null)}
              className={`group relative aspect-[0.77] cursor-grab overflow-hidden rounded-md border-[1.5px] border-border bg-bg-elevated transition-all hover:border-text-tertiary ${
                dragId === page.id ? 'opacity-30' : ''
              }`}
            >
              <img
                src={page.thumbnail}
                alt={`Page ${idx + 1}`}
                className="h-full w-full select-none object-contain bg-white"
                style={{
                  transform: `rotate(${page.rotation}deg)`,
                  transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                draggable={false}
              />

              <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-sm bg-bg-base/85 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm">
                {idx + 1}
              </span>

              <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rotatePage(page.id);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-base/85 text-text-secondary backdrop-blur-sm transition-colors hover:text-accent"
                  aria-label="Rotate 90 degrees"
                >
                  <RotateCw size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-base/85 text-text-secondary backdrop-blur-sm transition-colors hover:text-error"
                  aria-label="Delete page"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropZone
      accept={['application/pdf', '.pdf']}
      onFiles={(files) => load(files[0])}
      title="Drop a PDF to organize"
      hint="Reorder, rotate, or delete pages. Visually."
      dragTitle="Drop it. It stays here."
    />
  );
}
