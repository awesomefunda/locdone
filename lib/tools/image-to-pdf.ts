/**
 * Image → PDF converter.
 *
 * Runs entirely on-device. Grep this file for `fetch(` — you will find nothing.
 * Takes an array of image Files (JPG/PNG), embeds them as pages in a new PDF,
 * preserving aspect ratio, fitting each image to Letter-sized page centered.
 */

import { PDFDocument } from 'pdf-lib';

export type ImageToPdfProgress = {
  stage: 'reading' | 'embedding' | 'finalizing';
  current: number;
  total: number;
};

export type PageSize = 'fit' | 'letter' | 'a4';

const LETTER: [number, number] = [612, 792];
const A4: [number, number] = [595.28, 841.89];

export async function imagesToPdf(
  files: File[],
  opts: {
    pageSize?: PageSize;
    onProgress?: (p: ImageToPdfProgress) => void;
  } = {}
): Promise<Uint8Array> {
  const { pageSize = 'fit', onProgress } = opts;
  if (files.length === 0) throw new Error('No images provided.');

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setCreator('Locdone');
  pdfDoc.setProducer('Locdone (locally processed)');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ stage: 'reading', current: i + 1, total: files.length });

    const bytes = await file.arrayBuffer();
    const type = file.type.toLowerCase();

    onProgress?.({ stage: 'embedding', current: i + 1, total: files.length });

    let image;
    if (type.includes('png')) {
      image = await pdfDoc.embedPng(bytes);
    } else if (type.includes('jpeg') || type.includes('jpg')) {
      image = await pdfDoc.embedJpg(bytes);
    } else {
      // Attempt JPG fallback; pdf-lib will throw with a clear error if incompatible.
      try {
        image = await pdfDoc.embedJpg(bytes);
      } catch {
        throw new Error(
          `"${file.name}" isn't a JPG or PNG. Locdone handles those; convert it first.`
        );
      }
    }

    const imgW = image.width;
    const imgH = image.height;

    let pageW: number, pageH: number, drawW: number, drawH: number, x: number, y: number;

    if (pageSize === 'fit') {
      // Page matches the image exactly. No scaling, no letterboxing.
      pageW = imgW;
      pageH = imgH;
      drawW = imgW;
      drawH = imgH;
      x = 0;
      y = 0;
    } else {
      const [fixedW, fixedH] = pageSize === 'a4' ? A4 : LETTER;
      pageW = fixedW;
      pageH = fixedH;
      const scale = Math.min(fixedW / imgW, fixedH / imgH);
      drawW = imgW * scale;
      drawH = imgH * scale;
      x = (fixedW - drawW) / 2;
      y = (fixedH - drawH) / 2;
    }

    const page = pdfDoc.addPage([pageW, pageH]);
    page.drawImage(image, { x, y, width: drawW, height: drawH });
  }

  onProgress?.({ stage: 'finalizing', current: files.length, total: files.length });
  return await pdfDoc.save();
}
