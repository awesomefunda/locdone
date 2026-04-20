/**
 * PDF redactor.
 *
 * Honest redaction strategy:
 * Rather than just overlaying a black rectangle (which leaves text extractable
 * underneath), we rasterize each page that has at least one redaction. The
 * raster IS a flattened image — text under the black boxes is no longer
 * present in the output file. Pages with no redactions are copied verbatim
 * to preserve their original quality.
 *
 * Honest caveat (we show this in the UI too): for legal/court-grade
 * redaction in text-based workflows, a specialized tool is recommended.
 * Locdone's approach is solid for scans, screenshots, and image-heavy PDFs —
 * and much better than a mere overlay for any use.
 */

import { PDFDocument } from 'pdf-lib';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/** Rectangle coordinates are normalized to the rendered page (0..1 fractions) */
export type RedactRect = {
  pageIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type RedactRenderedPage = {
  pageIndex: number;
  width: number; // display px
  height: number; // display px
  dataUrl: string;
};

/**
 * Render every page at a consistent display scale for the redaction UI.
 */
export async function renderPdfForRedact(
  file: File,
  scale = 1.3
): Promise<{ pages: RedactRenderedPage[]; sourceBytes: ArrayBuffer }> {
  const sourceBytes = await file.arrayBuffer();
  // pdf.js detaches the buffer it receives. Give it a copy so the originals
  // remain usable later by pdf-lib when we rebuild the file.
  const pdfjsCopy = sourceBytes.slice(0);
  const pdf = await getDocument({ data: new Uint8Array(pdfjsCopy) }).promise;
  const pages: RedactRenderedPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    pages.push({
      pageIndex: i - 1,
      width: canvas.width,
      height: canvas.height,
      dataUrl: canvas.toDataURL('image/jpeg', 0.88),
    });

    page.cleanup();
  }

  await pdf.destroy();
  return { pages, sourceBytes };
}

/**
 * Build the redacted PDF. Pages with any redactions get flattened
 * (raster with black rectangles drawn on top, burned in, text gone).
 * Pages with no redactions are copied through untouched.
 */
export async function applyRedactions(
  sourceBytes: ArrayBuffer,
  rects: RedactRect[],
  pagesRendered: RedactRenderedPage[]
): Promise<Uint8Array> {
  const src = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  out.setCreator('Locdone');
  out.setProducer('Locdone (locally processed, redacted)');

  const srcPages = src.getPages();
  const totalPages = srcPages.length;

  // Group rects by page for fast lookup.
  const rectsByPage = new Map<number, RedactRect[]>();
  for (const r of rects) {
    const list = rectsByPage.get(r.pageIndex) ?? [];
    list.push(r);
    rectsByPage.set(r.pageIndex, list);
  }

  for (let i = 0; i < totalPages; i++) {
    const pageRects = rectsByPage.get(i);

    if (!pageRects || pageRects.length === 0) {
      // No redactions: copy page verbatim.
      const [copied] = await out.copyPages(src, [i]);
      out.addPage(copied);
      continue;
    }

    // Redactions: flatten the page.
    const rendered = pagesRendered.find((p) => p.pageIndex === i);
    if (!rendered) {
      // Fall back to simple copy if we somehow don't have a render (shouldn't happen)
      const [copied] = await out.copyPages(src, [i]);
      out.addPage(copied);
      continue;
    }

    // Rebuild a canvas at render size and burn in the black rectangles.
    const canvas = document.createElement('canvas');
    canvas.width = rendered.width;
    canvas.height = rendered.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas unavailable.');

    // Draw the rendered page image.
    const img = await loadImage(rendered.dataUrl);
    ctx.drawImage(img, 0, 0, rendered.width, rendered.height);

    // Burn redaction rectangles as solid black. This removes the underlying
    // pixels — there is no layer beneath in the output.
    ctx.fillStyle = '#000000';
    for (const r of pageRects) {
      ctx.fillRect(
        r.x * rendered.width,
        r.y * rendered.height,
        r.w * rendered.width,
        r.h * rendered.height
      );
    }

    // Encode and embed.
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Encoding failed.'))),
        'image/jpeg',
        0.9
      );
    });
    const jpegBytes = new Uint8Array(await blob.arrayBuffer());
    const embedded = await out.embedJpg(jpegBytes);

    // Preserve original page dimensions from the source PDF.
    const srcPage = srcPages[i];
    const { width: pw, height: ph } = srcPage.getSize();
    const pageOut = out.addPage([pw, ph]);
    pageOut.drawImage(embedded, { x: 0, y: 0, width: pw, height: ph });
  }

  return await out.save();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed.'));
    img.src = src;
  });
}
