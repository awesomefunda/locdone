'use client';

/**
 * Minimal event bus for the first-download celebration toast.
 * Triggered by any tool's download action; listened to by <FirstDownloadToast />.
 */

const FIRST_DOWNLOAD_KEY = 'locdone:first-download';
const FIRST_DOWNLOAD_EVENT = 'locdone:first-download';

export function markDownload(): void {
  if (typeof window === 'undefined') return;
  const already = localStorage.getItem(FIRST_DOWNLOAD_KEY);
  if (already) return;
  localStorage.setItem(FIRST_DOWNLOAD_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent(FIRST_DOWNLOAD_EVENT));
}

export function onFirstDownload(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => cb();
  window.addEventListener(FIRST_DOWNLOAD_EVENT, handler);
  return () => window.removeEventListener(FIRST_DOWNLOAD_EVENT, handler);
}
