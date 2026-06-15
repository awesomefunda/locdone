/**
 * Bates numbering for PDFs.
 *
 * Stamps a sequential identifier (e.g. "SMITH000042") on every page.
 * Uses pdf-lib's native text drawing — pages remain text-searchable.
 * Everything runs in-browser; the file is never sent anywhere.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type BatesPosition =
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'top-right'
  | 'top-center'
  | 'top-left';

export type BatesOptions = {
  prefix: string;          // e.g. "SMITH-" or "DOC"
  startNumber: number;     // e.g. 1
  digits: number;          // zero-pad width, e.g. 6 → "000001"
  position: BatesPosition;
  fontSize: number;        // pt, e.g. 9
  margin: number;          // pt from edge, e.g. 20
};

export const BATES_DEFAULTS: BatesOptions = {
  prefix: '',
  startNumber: 1,
  digits: 6,
  position: 'bottom-right',
  fontSize: 9,
  margin: 18,
};

/** Format a single Bates label. */
export function formatBatesLabel(opts: BatesOptions, pageIndex: number): string {
  const n = opts.startNumber + pageIndex;
  return `${opts.prefix}${String(n).padStart(opts.digits, '0')}`;
}

/** Stamp Bates numbers on every page and return new PDF bytes. */
export async function applyBatesNumbers(
  file: File,
  opts: BatesOptions
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Courier);

  const pages = pdf.getPages();
  const { position, fontSize, margin } = opts;
  const black = rgb(0, 0, 0);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const label = formatBatesLabel(opts, i);
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    let x: number;
    let y: number;

    switch (position) {
      case 'bottom-right':
        x = width - textWidth - margin;
        y = margin;
        break;
      case 'bottom-center':
        x = (width - textWidth) / 2;
        y = margin;
        break;
      case 'bottom-left':
        x = margin;
        y = margin;
        break;
      case 'top-right':
        x = width - textWidth - margin;
        y = height - margin - textHeight;
        break;
      case 'top-center':
        x = (width - textWidth) / 2;
        y = height - margin - textHeight;
        break;
      case 'top-left':
        x = margin;
        y = height - margin - textHeight;
        break;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: black,
      opacity: 1,
    });
  }

  return await pdf.save();
}
