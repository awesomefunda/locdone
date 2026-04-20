/**
 * PDF organizer.
 *
 * Renders thumbnails via pdf.js, manipulates pages via pdf-lib.
 * Supports reordering, deletion, and rotation.
 */

import { PDFDocument, degrees } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export type PageState = {
  /** Zero-based index into the ORIGINAL document */
  originalIndex: number;
  /** Rotation to apply in degrees (0, 90, 180, 270) */
  rotation: 0 | 90 | 180 | 270;
  /** Thumbnail data URL for rendering */
  thumbnail: string;
  /** Unique key for React */
  id: string;
};

/**
 * Load a PDF and render a thumbnail per page.
 */
export async function loadPdfForOrganize(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<{ pages: PageState[]; sourceBytes: ArrayBuffer }> {
  const sourceBytes = await file.arrayBuffer();

  // pdf.js takes ownership of the buffer it receives and detaches it.
  // We give it a fresh copy so sourceBytes stays intact for the pdf-lib rebuild step.
  const pdfjsCopy = sourceBytes.slice(0);
  const pdf = await getDocument({ data: new Uint8Array(pdfjsCopy) }).promise;
  const total = pdf.numPages;

  const pages: PageState[] = [];

  for (let i = 1; i <= total; i++) {
    onProgress?.(i, total);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.4 });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    pages.push({
      originalIndex: i - 1,
      rotation: 0,
      thumbnail: canvas.toDataURL('image/jpeg', 0.7),
      id: `page-${i - 1}-${Date.now()}`,
    });

    page.cleanup();
  }

  await pdf.destroy();
  return { pages, sourceBytes };
}

/**
 * Rebuild PDF from the current page state.
 */
export async function buildOrganizedPdf(
  sourceBytes: ArrayBuffer,
  pages: PageState[]
): Promise<Uint8Array> {
  if (pages.length === 0) {
    throw new Error('No pages left. Add some back before saving.');
  }

  const src = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  out.setCreator('Locdone');
  out.setProducer('Locdone (locally processed)');

  const indices = pages.map((p) => p.originalIndex);
  const copied = await out.copyPages(src, indices);

  copied.forEach((page, i) => {
    const state = pages[i];
    if (state.rotation !== 0) {
      page.setRotation(degrees(state.rotation));
    }
    out.addPage(page);
  });

  return await out.save();
}
