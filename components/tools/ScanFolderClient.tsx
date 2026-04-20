'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  CheckSquare,
  Download,
  FileText,
  FolderSearch,
  GitMerge,
  RotateCcw,
  Search,
  Square,
  X,
} from 'lucide-react';
import { cn, formatBytes, downloadBlob } from '@/lib/utils';
import { mergePdfs } from '@/lib/tools/merge-pdf';
import { ProcessingPanel } from '@/components/ProcessingPanel';
import { SuccessPanel } from '@/components/SuccessPanel';
import { ErrorPanel } from '@/components/ErrorPanel';
import { usePrivacyProof } from '@/lib/use-privacy-proof';
import { markDownload } from '@/lib/first-download';

// ─── Types ─────────────────────────────────────────────────────────────────────

type ScannedPdf = {
  id: string;
  file: File;
  /** Path relative to the scanned folder root, e.g. "docs/report.pdf" */
  relativePath: string;
  selected: boolean;
};

type ScanState =
  | { kind: 'idle' }
  | { kind: 'scanning' }
  | { kind: 'results'; folderName: string; pdfs: ScannedPdf[] }
  | { kind: 'merging' }
  | { kind: 'done'; blob: Blob; filename: string; folderName: string }
  | { kind: 'error'; message: string };

// ─── Directory-walking helpers ──────────────────────────────────────────────

/** Recursively walk a FileSystemEntry, collecting every file with its path. */
async function walkEntry(
  entry: FileSystemEntry,
  pathPrefix: string,
): Promise<{ file: File; relativePath: string }[]> {
  if (entry.isFile) {
    const file = await new Promise<File>((res, rej) =>
      (entry as FileSystemFileEntry).file(res, rej),
    );
    return [{ file, relativePath: pathPrefix || entry.name }];
  }

  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    const collected: { file: File; relativePath: string }[] = [];

    // readEntries delivers results in batches — keep reading until empty.
    let batch: FileSystemEntry[];
    do {
      batch = await new Promise<FileSystemEntry[]>((res, rej) =>
        reader.readEntries(res, rej),
      );
      for (const child of batch) {
        const childPath = pathPrefix ? `${pathPrefix}/${child.name}` : child.name;
        const sub = await walkEntry(child, childPath);
        collected.push(...sub);
      }
    } while (batch.length > 0);

    return collected;
  }

  return [];
}

/** Filter to PDFs, sort by path, assign stable IDs. */
function buildScannedPdfs(
  entries: { file: File; relativePath: string }[],
): ScannedPdf[] {
  return entries
    .filter((e) => e.file.name.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath))
    .map((e, i) => ({
      id: `${i}-${e.relativePath}-${e.file.size}`,
      file: e.file,
      relativePath: e.relativePath,
      selected: true,
    }));
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ScanFolderClient() {
  const [state, setState] = useState<ScanState>({ kind: 'idle' });
  const [progress, setProgress] = useState(0);
  const [mergeStage, setMergeStage] = useState('');
  const [query, setQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { processingCount, startProcessing, stopProcessing } = usePrivacyProof();

  // ── webkitdirectory input ───────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length === 0) return;

      setState({ kind: 'scanning' });

      // webkitRelativePath: "folder-name/subdir/file.pdf"
      const folderName = files[0].webkitRelativePath.split('/')[0] ?? 'folder';
      const entries = files.map((f) => ({
        file: f,
        // Strip the top folder name so relativePath is relative to it
        relativePath: f.webkitRelativePath.split('/').slice(1).join('/'),
      }));

      const pdfs = buildScannedPdfs(entries);

      if (pdfs.length === 0) {
        setState({ kind: 'error', message: `No PDF files found in "${folderName}".` });
      } else {
        setState({ kind: 'results', folderName, pdfs });
      }

      e.target.value = '';
    },
    [],
  );

  // ── Folder drag-and-drop ────────────────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const items = Array.from(e.dataTransfer.items);
    const folderEntries = items
      .filter((item) => item.kind === 'file')
      .map((item) => item.webkitGetAsEntry?.())
      .filter((entry): entry is FileSystemDirectoryEntry => !!entry?.isDirectory);

    if (folderEntries.length === 0) {
      // Maybe they dropped files directly — handle as individual PDFs
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.toLowerCase().endsWith('.pdf'),
      );
      if (files.length > 0) {
        const pdfs = buildScannedPdfs(
          files.map((f) => ({ file: f, relativePath: f.name })),
        );
        setState({ kind: 'results', folderName: 'dropped files', pdfs });
      }
      return;
    }

    setState({ kind: 'scanning' });

    try {
      const allEntries: { file: File; relativePath: string }[] = [];
      const folderName = folderEntries[0].name;

      for (const entry of folderEntries) {
        // Walk children directly so the folder name itself isn't in the path
        const reader = entry.createReader();
        let batch: FileSystemEntry[];
        do {
          batch = await new Promise<FileSystemEntry[]>((res, rej) =>
            reader.readEntries(res, rej),
          );
          for (const child of batch) {
            const sub = await walkEntry(child, child.name);
            allEntries.push(...sub);
          }
        } while (batch.length > 0);
      }

      const pdfs = buildScannedPdfs(allEntries);

      if (pdfs.length === 0) {
        setState({ kind: 'error', message: `No PDF files found in "${folderName}".` });
      } else {
        setState({ kind: 'results', folderName, pdfs });
      }
    } catch {
      setState({
        kind: 'error',
        message: 'Could not read the folder. Try using the button instead.',
      });
    }
  }, []);

  // ── Selection ───────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setState((prev) => {
      if (prev.kind !== 'results') return prev;
      return {
        ...prev,
        pdfs: prev.pdfs.map((p) =>
          p.id === id ? { ...p, selected: !p.selected } : p,
        ),
      };
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setState((prev) => {
      if (prev.kind !== 'results') return prev;
      const allSelected = prev.pdfs.every((p) => p.selected);
      return {
        ...prev,
        pdfs: prev.pdfs.map((p) => ({ ...p, selected: !allSelected })),
      };
    });
  }, []);

  // ── Merge ───────────────────────────────────────────────────────────────────
  const mergeSelected = useCallback(async () => {
    if (state.kind !== 'results') return;
    const selected = state.pdfs.filter((p) => p.selected);
    if (selected.length < 2) return;
    const { folderName } = state;

    setState({ kind: 'merging' });
    setProgress(0);
    startProcessing();

    try {
      const bytes = await mergePdfs(
        selected.map((p) => p.file),
        (p) => {
          setMergeStage(p.filename);
          setProgress(p.current / p.total);
        },
      );
      stopProcessing();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const safeName = folderName.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
      setState({
        kind: 'done',
        blob,
        filename: `${safeName}-merged.pdf`,
        folderName,
      });
    } catch (err) {
      stopProcessing();
      setState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Merge failed.',
      });
    }
  }, [state, startProcessing, stopProcessing]);

  const reset = useCallback(() => {
    setState({ kind: 'idle' });
    setQuery('');
    setProgress(0);
  }, []);

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filteredPdfs = useMemo(() => {
    if (state.kind !== 'results') return [];
    if (!query.trim()) return state.pdfs;
    const q = query.toLowerCase();
    return state.pdfs.filter(
      (p) =>
        p.file.name.toLowerCase().includes(q) ||
        p.relativePath.toLowerCase().includes(q),
    );
  }, [state, query]);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (state.kind === 'merging') {
    return (
      <ProcessingPanel
        progress={progress}
        stageLabel="merging"
        detail={mergeStage}
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
        savingsLabel={`from ${state.folderName}`}
      />
    );
  }

  if (state.kind === 'error') {
    return <ErrorPanel message={state.message} onReset={reset} />;
  }

  if (state.kind === 'scanning') {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-border bg-bg-raised">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-[1.5px] border-border border-t-accent" />
          <p className="text-sm text-text-secondary">Scanning for PDFs…</p>
        </div>
      </div>
    );
  }

  if (state.kind === 'results') {
    const { folderName, pdfs } = state;
    const selected = pdfs.filter((p) => p.selected);
    const allSelected = pdfs.length > 0 && pdfs.every((p) => p.selected);
    const totalSize = pdfs.reduce((s, p) => s + p.file.size, 0);
    const selectedSize = selected.reduce((s, p) => s + p.file.size, 0);
    const canMerge = selected.length >= 2;

    return (
      <div className="animate-fade-up space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-text-tertiary">{folderName}/</div>
            <div className="mt-0.5 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
                {pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''}
              </span>{' '}
              found · {formatBytes(totalSize)} total
            </div>
          </div>
          <button
            onClick={reset}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-text-tertiary transition-colors hover:bg-bg-raised hover:text-text-secondary"
          >
            <RotateCcw size={12} />
            Scan another
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
              aria-hidden
            />
            <input
              type="text"
              placeholder="Filter by name or path…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-bg-raised py-2 pl-8 pr-8 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
                aria-label="Clear filter"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={toggleSelectAll}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-border-subtle bg-bg-raised px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-elevated"
          >
            {allSelected ? (
              <CheckSquare size={13} className="text-accent" />
            ) : (
              <Square size={13} />
            )}
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        </div>

        {/* PDF list */}
        {filteredPdfs.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-border-subtle bg-bg-raised text-sm text-text-tertiary">
            No PDFs match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto rounded-lg border border-border-subtle bg-bg-raised">
            <ul className="divide-y divide-border-subtle/50">
              {filteredPdfs.map((pdf) => {
                const parts = pdf.relativePath.split('/');
                const filename = parts[parts.length - 1];
                const dirPath = parts.slice(0, -1).join('/');

                return (
                  <li
                    key={pdf.id}
                    className={cn(
                      'group flex items-center gap-3 px-4 py-2.5 transition-colors',
                      pdf.selected
                        ? 'hover:bg-bg-elevated'
                        : 'opacity-50 hover:opacity-70',
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(pdf.id)}
                      className="shrink-0 text-text-tertiary transition-colors hover:text-accent"
                      aria-label={
                        pdf.selected
                          ? `Deselect ${filename}`
                          : `Select ${filename}`
                      }
                    >
                      {pdf.selected ? (
                        <CheckSquare size={14} className="text-accent" />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>

                    {/* File icon */}
                    <FileText
                      size={13}
                      strokeWidth={1.5}
                      className="shrink-0 text-text-tertiary"
                      aria-hidden
                    />

                    {/* Name + path */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate text-sm text-text-primary"
                        title={pdf.relativePath}
                      >
                        {filename}
                      </div>
                      {dirPath && (
                        <div className="truncate font-mono text-[10px] leading-tight text-text-tertiary">
                          /{dirPath}/
                        </div>
                      )}
                    </div>

                    {/* Size */}
                    <span className="shrink-0 font-mono text-xs text-text-tertiary">
                      {formatBytes(pdf.file.size)}
                    </span>

                    {/* Individual download */}
                    <button
                      onClick={() => {
                        downloadBlob(pdf.file, filename);
                        markDownload();
                      }}
                      className="shrink-0 rounded p-1.5 text-text-tertiary opacity-0 transition-all group-hover:opacity-100 hover:bg-bg-elevated hover:text-text-primary"
                      aria-label={`Download ${filename}`}
                    >
                      <Download size={13} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="font-mono text-xs text-text-tertiary">
            {selected.length} of {pdfs.length} selected
            {selected.length > 0 && (
              <span className="ml-1.5">· {formatBytes(selectedSize)}</span>
            )}
          </p>

          <button
            onClick={mergeSelected}
            disabled={!canMerge}
            className={cn(
              'inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition-all duration-200',
              canMerge
                ? 'bg-accent text-bg-base hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow'
                : 'cursor-not-allowed bg-bg-elevated text-text-tertiary',
            )}
          >
            <GitMerge size={14} strokeWidth={2} />
            {canMerge ? `Merge ${selected.length} PDFs` : 'Select 2+ to merge'}
          </button>
        </div>
      </div>
    );
  }

  // ── Idle state ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* Dim overlay when dragging over the page */}
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-30 bg-bg-base transition-opacity duration-200',
          isDragOver ? 'opacity-40' : 'opacity-0',
        )}
        aria-hidden
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative z-40 flex min-h-[300px] flex-col items-center justify-center rounded-lg border-[1.5px] border-dashed px-6 py-12 transition-all duration-200',
          isDragOver
            ? 'border-solid border-accent bg-bg-elevated shadow-glow-strong'
            : 'border-border bg-bg-raised',
        )}
      >
        {/* Hidden directory input */}
        <input
          ref={inputRef}
          type="file"
          // @ts-expect-error — webkitdirectory is not typed in React but is supported in all modern browsers
          webkitdirectory=""
          multiple
          className="sr-only"
          onChange={handleInputChange}
        />

        {isDragOver ? (
          <>
            <div className="mb-4 flex h-12 w-12 animate-pulse-soft items-center justify-center rounded-full bg-accent/10 text-accent">
              <FolderSearch size={22} strokeWidth={1.5} aria-hidden />
            </div>
            <p className="font-display text-2xl italic text-accent">Drop the folder.</p>
            <p className="mt-1.5 text-sm text-text-secondary">
              It stays here.
            </p>
          </>
        ) : (
          <>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-bg-elevated ring-1 ring-border-subtle">
              <FolderSearch
                size={24}
                strokeWidth={1.25}
                className="text-text-tertiary"
                aria-hidden
              />
            </div>
            <h2 className="mb-1.5 font-display text-2xl italic">
              Scan a folder for PDFs
            </h2>
            <p className="mb-6 max-w-xs text-center text-sm text-text-secondary">
              Pick any folder — your project, repo, or Downloads. Nothing leaves
              your device.
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-2.5 text-sm font-medium text-bg-base transition-all duration-200 hover:-translate-y-px hover:bg-accent-dim hover:shadow-glow"
            >
              <FolderSearch size={15} strokeWidth={2} aria-hidden />
              Pick a folder
            </button>
            <p className="mt-5 font-mono text-[11px] text-text-tertiary">
              or drag a folder onto this page
            </p>
          </>
        )}
      </div>
    </>
  );
}
