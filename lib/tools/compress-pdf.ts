/**
 * PDF compressor.
 *
 * Strategy: rasterize each page via pdf.js → re-encode as JPEG at a chosen
 * quality → rebuild PDF via pdf-lib. This is "image-based" compression.
 * It's lossy but predictable, works in every browser, and needs no WASM.
 *
 * For production we'd add qpdf-wasm (Apache 2.0) for lossless optimization of
 * text-heavy PDFs; rasterization is the pragmatic v1 that ships today and
 * handles the common case (scanned documents, image-heavy PDFs) excellently.
 *
 * Limits:
 * - Text in the output PDF is no longer selectable. This is disclosed in the UI.
 * - Vector content is rasterized. Fine for scans, lossy for diagrams.
 *
 * All processing is client-side. Nothing uploads.
 */

import { PDFDocument } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Worker is served from /public/pdf.worker.min.mjs
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export type CompressLevel = 'light' | 'balanced' | 'strong';

export type CompressProgress = {
  stage: 'reading' | 'rendering' | 'encoding' | 'building';
  currentPage: number;
  totalPages: number;
};

const PROFILES: Record<
  CompressLevel,
  { scale: number; quality: number; label: string }
> = {
  light: { scale: 1.5, quality: 0.85, label: 'Light — best quality' },
  balanced: { scale: 1.2, quality: 0.72, label: 'Balanced — recommended' },
  strong: { scale: 1.0, quality: 0.55, label: 'Strong — smallest file' },
};

export function getCompressProfile(level: CompressLevel) {
  return PROFILES[level];
}

export async function compressPdf(
  file: File,
  level: CompressLevel,
  onProgress?: (p: CompressProgress) => void
): Promise<Uint8Array> {
  const profile = PROFILES[level];
  const bytes = await file.arrayBuffer();

  onProgress?.({ stage: 'reading', currentPage: 0, totalPages: 0 });

  // Load via pdf.js to render each page.
  // We pass a fresh Uint8Array because pdf.js takes ownership of the buffer.
  const pdf = await getDocument({ data: new Uint8Array(bytes) }).promise;
  const numPages = pdf.numPages;

  const out = await PDFDocument.create();
  out.setCreator('Locdone');
  out.setProducer('Locdone (locally processed)');

  for (let i = 1; i <= numPages; i++) {
    onProgress?.({
      stage: 'rendering',
      currentPage: i,
      totalPages: numPages,
    });

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: profile.scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context unavailable in this browser.');

    // White background so JPEG (which has no alpha) renders correctly.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    onProgress?.({
      stage: 'encoding',
      currentPage: i,
      totalPages: numPages,
    });

    // Extract as JPEG at chosen quality.
    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('JPEG encoding failed.'))),
        'image/jpeg',
        profile.quality
      );
    });
    const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());

    const embedded = await out.embedJpg(jpegBytes);
    const pageOut = out.addPage([viewport.width, viewport.height]);
    pageOut.drawImage(embedded, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });

    // Free references eagerly so Safari/iOS don't balloon.
    page.cleanup();
  }

  onProgress?.({
    stage: 'building',
    currentPage: numPages,
    totalPages: numPages,
  });

  // Clean up the source pdf.js document.
  await pdf.destroy();

  return await out.save({ useObjectStreams: true });
}
