'use client';

import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import {
  applyRedactions,
  renderPdfForRedact,
  type RedactRect,
  type RedactRenderedPage,
} from '@/lib/tools/redact-pdf';
import { stripExt } from '@/lib/utils';

type State =
  | { kind: 'idle' }
  | { kind: 'loading'; filename: string }
  | {
      kind: 'editing';
      filename: string;
      sourceBytes: ArrayBuffer;
      pages: RedactRenderedPage[];
      currentPage: number;
      rects: RedactRect[];
    }
  | { kind: 'saving' }
  | { kind: 'done'; blob: Blob; filename: string }
  | { kind: 'error'; message: string };

export function RedactPdfClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [progress, setProgress] = useState(0);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  const stageRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState<{
    startX: number;
    startY: number;
    curX: number;
    curY: number;
  } | null>(null);

  const load = useCallback(
    async (file: File) => {
      setState({ kind: 'loading', filename: file.name });
      startProcessing();
      setProgress(0.1);
      try {
        const { pages, sourceBytes } = await renderPdfForRedact(file);
        setProgress(1);
        stopProcessing();
        setState({
          kind: 'editing',
          filename: file.name,
          sourceBytes,
          pages,
          currentPage: 0,
          rects: [],
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
    const { sourceBytes, rects, pages, filename } = state;
    setState({ kind: 'saving' });
    setProgress(0.3);
    startProcessing();
    try {
      const bytes = await applyRedactions(sourceBytes, rects, pages);
      setProgress(1);
      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setState({
        kind: 'done',
        blob,
        filename: `${stripExt(filename)}-redacted.pdf`,
      });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Redaction failed.',
      });
    }
  };

  const reset = () => setState({ kind: 'idle' });

  if (state.kind === 'loading' || state.kind === 'saving') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel={state.kind === 'loading' ? 'rendering' : 'flattening'}
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
        savingsLabel="Redacted areas flattened"
      />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  if (state.kind === 'editing') {
    const { pages, currentPage, rects, filename } = state;
    const page = pages[currentPage];
    const rectsOnPage = rects.filter((r) => r.pageIndex === currentPage);

    const goPrev = () => {
      if (currentPage === 0) return;
      setState({ ...state, currentPage: currentPage - 1 });
    };
    const goNext = () => {
      if (currentPage >= pages.length - 1) return;
      setState({ ...state, currentPage: currentPage + 1 });
    };

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setDrawing({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        curX: e.clientX - rect.left,
        curY: e.clientY - rect.top,
      });
    };
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!drawing) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setDrawing({
        ...drawing,
        curX: e.clientX - rect.left,
        curY: e.clientY - rect.top,
      });
    };
    const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!drawing) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x0 = Math.min(drawing.startX, drawing.curX);
      const y0 = Math.min(drawing.startY, drawing.curY);
      const x1 = Math.max(drawing.startX, drawing.curX);
      const y1 = Math.max(drawing.startY, drawing.curY);
      const width = rect.width;
      const height = rect.height;
      const w = x1 - x0;
      const h = y1 - y0;
      // Ignore clicks / tiny rects
      if (w > 6 && h > 6) {
        const newRect: RedactRect = {
          pageIndex: currentPage,
          x: x0 / width,
          y: y0 / height,
          w: w / width,
          h: h / height,
        };
        setState({ ...state, rects: [...rects, newRect] });
      }
      setDrawing(null);
      e.preventDefault();
    };
    const onMouseLeave = () => setDrawing(null);

    const removeRect = (index: number) => {
      const filtered = rects.filter((_, i) => i !== index);
      setState({ ...state, rects: filtered });
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-bg-raised p-4 text-sm">
          <span className="flex-1 min-w-0 truncate">
            <span className="font-medium">{filename}</span>
            <span className="ml-2 text-text-tertiary">
              · {rects.length} redaction{rects.length === 1 ? '' : 's'}
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
            disabled={rects.length === 0}
            className="rounded-pill bg-accent px-5 py-2 text-xs font-medium text-bg-base transition-all hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow-strong disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-tertiary disabled:shadow-none disabled:hover:translate-y-0"
          >
            Save redacted PDF
          </button>
        </div>

        <p className="font-mono text-xs text-text-tertiary">
          Click and drag to redact. Redacted areas are flattened — the text is
          removed, not just covered.
        </p>

        <div className="rounded-md border border-border bg-bg-elevated p-4">
          <div
            ref={stageRef}
            className="relative mx-auto"
            style={{ maxWidth: page.width }}
          >
            <div
              className="relative w-full cursor-crosshair"
              style={{
                aspectRatio: `${page.width} / ${page.height}`,
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              <img
                src={page.dataUrl}
                alt={`Page ${currentPage + 1}`}
                className="h-full w-full select-none shadow-xl"
                draggable={false}
              />

              {/* Existing redactions */}
              {rectsOnPage.map((r, i) => {
                const globalIndex = rects.findIndex((gr) => gr === r);
                return (
                  <div
                    key={i}
                    className="absolute bg-black"
                    style={{
                      left: `${r.x * 100}%`,
                      top: `${r.y * 100}%`,
                      width: `${r.w * 100}%`,
                      height: `${r.h * 100}%`,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRect(globalIndex);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] text-white shadow-md hover:bg-red-500"
                      aria-label="Remove redaction"
                    >
                      <X size={10} />
                    </button>
                  </div>
                );
              })}

              {/* Live drawing preview */}
              {drawing && (() => {
                const rect = stageRef.current?.getBoundingClientRect();
                if (!rect) return null;
                const x0 = Math.min(drawing.startX, drawing.curX);
                const y0 = Math.min(drawing.startY, drawing.curY);
                const w = Math.abs(drawing.curX - drawing.startX);
                const h = Math.abs(drawing.curY - drawing.startY);
                return (
                  <div
                    className="pointer-events-none absolute border border-dashed border-accent bg-black/90"
                    style={{
                      left: x0,
                      top: y0,
                      width: w,
                      height: h,
                    }}
                  />
                );
              })()}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 border-t border-border-subtle pt-3 font-mono text-xs text-text-secondary">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-sm border border-border bg-bg-raised px-3 py-1.5 text-text-primary transition-colors hover:border-text-tertiary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <span>
              page {currentPage + 1} of {pages.length}
            </span>
            <button
              onClick={goNext}
              disabled={currentPage >= pages.length - 1}
              className="flex items-center gap-1 rounded-sm border border-border bg-bg-raised px-3 py-1.5 text-text-primary transition-colors hover:border-text-tertiary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropZone
      accept={['application/pdf', '.pdf']}
      onFiles={(files) => load(files[0])}
      title="Drop a PDF to redact"
      hint="Draw black boxes over sensitive info. Text is removed, not just covered."
      dragTitle="Drop it. It stays here."
    />
  );
}
