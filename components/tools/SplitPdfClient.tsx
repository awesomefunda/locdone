'use client';

import { useCallback, useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { DropZone } from '@/components/DropZone';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import { splitPdf, parsePageRange } from '@/lib/tools/split-pdf';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { formatBytes } from '@/lib/utils';

// Worker setup
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type State =
  | { kind: 'idle' }
  | { kind: 'preview'; file: File; pageCount: number; selected: Set<number> }
  | { kind: 'processing'; file: File; pageCount: number }
  | { kind: 'done'; blob: Blob; filename: string }
  | { kind: 'error'; message: string };

export function SplitPdfClient() {
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [progress, setProgress] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [showPageList, setShowPageList] = useState(false);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  // Load PDF and count pages
  const handleFileSelected = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const pdf = await getDocument(await file.arrayBuffer()).promise;
      setState({
        kind: 'preview',
        file,
        pageCount: pdf.numPages,
        selected: new Set(Array.from({ length: pdf.numPages }, (_, i) => i)),
      });
      setRangeInput('');
      setRangeError('');
    } catch {
      setState({
        kind: 'error',
        message: 'Failed to load PDF.',
      });
    }
  }, []);

  const togglePage = (index: number) => {
    setState((prev) => {
      if (prev.kind !== 'preview') return prev;
      const copy = new Set(prev.selected);
      if (copy.has(index)) {
        copy.delete(index);
      } else {
        copy.add(index);
      }
      return { ...prev, selected: copy };
    });
  };

  const selectAll = () => {
    setState((prev) => {
      if (prev.kind !== 'preview') return prev;
      return {
        ...prev,
        selected: new Set(Array.from({ length: prev.pageCount }, (_, i) => i)),
      };
    });
  };

  const selectNone = () => {
    setState((prev) => {
      if (prev.kind !== 'preview') return prev;
      return { ...prev, selected: new Set() };
    });
  };

  const applyRange = () => {
    setState((prev) => {
      if (prev.kind !== 'preview') return prev;

      try {
        const indices = parsePageRange(rangeInput, prev.pageCount);
        setRangeError('');
        return { ...prev, selected: new Set(indices) };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Invalid range.';
        setRangeError(msg);
        return prev;
      }
    });
  };

  const performSplit = async () => {
    if (state.kind !== 'preview' || state.selected.size === 0) return;

    const pageIndices = Array.from(state.selected).sort((a, b) => a - b);
    const { file } = state;

    setState({ kind: 'processing', file, pageCount: state.pageCount });
    setProgress(0);
    startProcessing();

    try {
      const bytes = await splitPdf(file, pageIndices, (p) => {
        if (p.stage === 'reading') {
          setProgress(0.1);
        } else if (p.stage === 'extracting' && p.currentPage && p.totalPages) {
          setProgress(0.1 + (p.currentPage / p.totalPages) * 0.7);
        } else if (p.stage === 'building') {
          setProgress(0.8);
        }
      });

      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const baseName = file.name.replace(/\.pdf$/i, '');
      const newName = pageIndices.length === 1 
        ? `${baseName}-page${pageIndices[0] + 1}.pdf`
        : `${baseName}-extracted.pdf`;
      setState({ kind: 'done', blob, filename: newName });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Split failed.',
      });
    }
  };

  const reset = () => {
    setState({ kind: 'idle' });
    setRangeInput('');
    setRangeError('');
  };

  if (state.kind === 'processing') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel="extracting"
        detail={`${state.pageCount} pages analyzed`}
        networkCount={processingCount}
        files={[
          {
            name: state.file.name,
            size: formatBytes(state.file.size),
          },
        ]}
      />
    );
  }

  if (state.kind === 'done') {
    return (
      <SuccessPanel filename={state.filename} blob={state.blob} onReset={reset} />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  if (state.kind === 'idle') {
    return (
      <DropZone
        accept={['application/pdf', '.pdf']}
        onFiles={handleFileSelected}
        title="Drop a PDF, or click to browse"
        hint="Select the PDF you want to split or extract pages from."
        dragTitle="Drop it here."
      />
    );
  }

  // Preview state
  const { pageCount, selected } = state;
  const selectedCount = selected.size;
  const canSplit = selectedCount > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-subtle bg-bg-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {state.file.name} — {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </p>
            <p className="text-xs text-text-tertiary">
              {selectedCount} selected • {formatBytes(state.file.size)}
            </p>
          </div>
          <button
            onClick={() => setState({ kind: 'idle' })}
            className="rounded p-1 text-text-tertiary transition-colors hover:bg-bg-elevated hover:text-error"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Range input */}
      <div className="space-y-2">
        <label className="block text-sm">
          <span className="mb-2 inline-block font-medium">
            Page range (optional)
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder='e.g. "1-5, 7, 9" or "1-3"'
              value={rangeInput}
              onChange={(e) => {
                setRangeInput(e.target.value);
                setRangeError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyRange();
              }}
              className="flex-1 rounded border border-border-subtle bg-bg-elevated px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <button
              onClick={applyRange}
              disabled={!rangeInput.trim()}
              className="rounded border border-border-subtle px-3 py-2 text-sm font-medium transition-colors hover:bg-bg-elevated disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          {rangeError && (
            <p className="mt-1 text-xs text-error">{rangeError}</p>
          )}
        </label>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={selectAll}
          className="rounded border border-border-subtle px-3 py-2 transition-colors hover:bg-bg-elevated"
        >
          Select All
        </button>
        <button
          onClick={selectNone}
          className="rounded border border-border-subtle px-3 py-2 transition-colors hover:bg-bg-elevated"
        >
          Select None
        </button>
        <button
          onClick={() => setShowPageList(!showPageList)}
          className="ml-auto flex items-center gap-1 rounded border border-border-subtle px-3 py-2 transition-colors hover:bg-bg-elevated"
        >
          {showPageList ? (
            <>
              <ChevronUp size={14} /> Hide list
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Show list
            </>
          )}
        </button>
      </div>

      {/* Page list */}
      {showPageList && (
        <div className="rounded-lg border border-border-subtle bg-bg-raised p-4">
          <div className="mb-3 text-xs font-medium text-text-secondary">
            Click a page to toggle
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => togglePage(i)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  selected.has(i)
                    ? 'bg-primary text-white'
                    : 'border border-border-subtle bg-bg-elevated hover:bg-bg-raised'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={performSplit}
        disabled={!canSplit}
        className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-opacity disabled:opacity-50 hover:opacity-90"
      >
        Extract {selectedCount} {selectedCount === 1 ? 'page' : 'pages'}
      </button>
    </div>
  );
}
