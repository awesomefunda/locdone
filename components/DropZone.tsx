'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { UploadCloud, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type DropZoneProps = {
  accept: string[];
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title?: string;
  hint?: string;
  dragTitle?: string;
  dragHint?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

/**
 * The DropZone is Locdone's signature UX moment.
 *
 * When a file is dragged over the window, the whole page dims except for
 * the zone, which brightens, develops a signal-green solid border, and
 * reveals the line "It stays here." — the first time users FEEL the
 * privacy promise instead of reading it abstractly.
 */
export function DropZone({
  accept,
  multiple = false,
  onFiles,
  title = 'Drop a file, or click to browse',
  hint = 'Nothing gets uploaded. This runs in your browser.',
  dragTitle = 'Drop it. It stays here.',
  dragHint = 'Your file will be processed on this device.',
  children,
  disabled = false,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [pageHasDrag, setPageHasDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Track drag on entire document to dim the page around the zone.
  useEffect(() => {
    function onDragEnter(e: DragEvent) {
      if (!e.dataTransfer?.types.includes('Files')) return;
      dragCounterRef.current++;
      setPageHasDrag(true);
    }
    function onDragLeave() {
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) setPageHasDrag(false);
    }
    function onDrop() {
      dragCounterRef.current = 0;
      setPageHasDrag(false);
    }
    function onDragOver(e: DragEvent) {
      // Prevent the browser from opening the file when dropped outside the zone.
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
      }
    }

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    window.addEventListener('dragover', onDragOver);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('dragover', onDragOver);
    };
  }, []);

  const validateAndEmit = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const valid: File[] = [];
      for (const f of files) {
        const ext = '.' + (f.name.split('.').pop() ?? '').toLowerCase();
        const typeMatch = accept.some(
          (a) => a === ext || f.type === a || f.type.startsWith(a.replace('/*', '/'))
        );
        if (typeMatch) valid.push(f);
      }

      if (valid.length === 0) {
        setIsInvalid(true);
        setTimeout(() => setIsInvalid(false), 500);
        return;
      }

      onFiles(multiple ? valid : [valid[0]]);
    },
    [accept, multiple, onFiles]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files.length > 0) {
      validateAndEmit(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndEmit(e.target.files);
    // Reset so the same file can be reselected later.
    e.target.value = '';
  };

  return (
    <>
      {/* Page dim overlay when dragging anywhere on the page */}
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-30 bg-bg-base transition-opacity duration-200',
          pageHasDrag ? 'opacity-40' : 'opacity-0'
        )}
        aria-hidden
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-label={title}
        className={cn(
          'relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-lg border-[1.5px] border-dashed px-6 py-12 transition-all duration-200 ease-out-expo',
          'bg-bg-raised border-border',
          !disabled && 'hover:border-text-tertiary',
          isDragOver &&
            'z-40 scale-[1.01] border-solid border-accent bg-bg-elevated shadow-glow-strong',
          isInvalid && 'animate-shake border-error',
          disabled && 'cursor-not-allowed opacity-50',
          pageHasDrag && 'z-40'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {isDragOver ? (
          <DragState title={dragTitle} hint={dragHint} />
        ) : isInvalid ? (
          <InvalidState accept={accept} />
        ) : (
          <IdleState title={title} hint={hint}>
            {children}
          </IdleState>
        )}
      </div>
    </>
  );
}

function IdleState({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <UploadCloud
        size={38}
        strokeWidth={1.25}
        className="mb-4 text-text-tertiary transition-colors"
        aria-hidden
      />
      <h2 className="mb-1.5 text-center font-display text-2xl italic text-text-primary">
        {title}
      </h2>
      <p className="mb-5 max-w-xs text-center text-sm text-text-secondary">{hint}</p>
      {children}
    </>
  );
}

function DragState({ title, hint }: { title: string; hint: string }) {
  return (
    <>
      <div className="mb-4 flex h-10 w-10 animate-pulse-soft items-center justify-center rounded-full bg-accent/10 text-accent">
        <Lock size={20} strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="mb-1.5 text-center font-display text-2xl italic text-accent">
        {title}
      </h2>
      <p className="max-w-xs text-center text-sm text-text-secondary">{hint}</p>
    </>
  );
}

function InvalidState({ accept }: { accept: string[] }) {
  const formatted = accept.join(', ').replace(/image\//g, '').toUpperCase();
  return (
    <>
      <UploadCloud
        size={44}
        strokeWidth={1.25}
        className="mb-5 text-error"
        aria-hidden
      />
      <h2 className="mb-2 text-center font-display text-2xl italic text-error">
        That's not a file I can handle.
      </h2>
      <p className="max-w-xs text-center text-sm text-text-secondary">
        Try {formatted}.
      </p>
    </>
  );
}
