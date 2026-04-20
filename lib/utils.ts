import { clsx, type ClassValue } from 'clsx';

/**
 * Tailwind-safe class name combiner.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format bytes into a human-readable string.
 * 1234 → "1.21 KB", 1234567 → "1.18 MB"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );
  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
}

/**
 * Trigger a download of a Blob as a given filename.
 * No network involved — pure browser mechanism.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on next tick so the download actually kicks off first.
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Read a File as ArrayBuffer. Single promise wrapper, no fluff.
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}

/**
 * Strip the extension from a filename. "doc.pdf" → "doc"
 */
export function stripExt(name: string): string {
  const i = name.lastIndexOf('.');
  return i === -1 ? name : name.slice(0, i);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
