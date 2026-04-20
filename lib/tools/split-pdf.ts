/**
 * PDF splitter.
 *
 * Extract specific pages from a PDF into a new document. All in-browser.
 */

import { PDFDocument } from 'pdf-lib';

export type SplitProgress = {
  stage: 'reading' | 'extracting' | 'building';
  currentPage?: number;
  totalPages?: number;
};

export async function splitPdf(
  file: File,
  pageIndices: number[], // 0-indexed page numbers to extract
  onProgress?: (p: SplitProgress) => void
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('Please select at least one page to extract.');
  }

  onProgress?.({ stage: 'reading' });

  const bytes = await file.arrayBuffer();
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch {
    throw new Error(
      `"${file.name}" couldn't be read. It may be corrupt or password-protected.`
    );
  }

  const totalPages = src.getPageCount();

  // Validate page indices
  const invalid = pageIndices.find((i) => i < 0 || i >= totalPages);
  if (invalid !== undefined) {
    throw new Error(`Invalid page number: ${invalid + 1}. File has ${totalPages} pages.`);
  }

  onProgress?.({ stage: 'extracting', totalPages });

  const newPdf = await PDFDocument.create();
  newPdf.setCreator('Locdone');
  newPdf.setProducer('Locdone (locally processed)');

  const sorted = [...pageIndices].sort((a, b) => a - b);
  const unique = Array.from(new Set(sorted));

  for (let i = 0; i < unique.length; i++) {
    onProgress?.({ stage: 'extracting', currentPage: i + 1, totalPages: unique.length });
    const pageIndex = unique[i];
    const [copiedPage] = await newPdf.copyPages(src, [pageIndex]);
    newPdf.addPage(copiedPage);
  }

  onProgress?.({ stage: 'building', totalPages: unique.length });

  return await newPdf.save();
}

/**
 * Parse a page range string like "1-5, 7, 9-11" into 0-indexed page numbers.
 * Handles various formats and validates bounds.
 */
export function parsePageRange(input: string, maxPages: number): number[] {
  const indices = new Set<number>();

  if (!input.trim()) {
    throw new Error('Page range cannot be empty.');
  }

  const parts = input.split(',');

  for (const part of parts) {
    const trimmed = part.trim();

    if (!trimmed) continue;

    // Check if it's a range like "1-5"
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map((s) => s.trim());
      const startNum = parseInt(start, 10);
      const endNum = parseInt(end, 10);

      if (isNaN(startNum) || isNaN(endNum)) {
        throw new Error(`Invalid range: "${trimmed}". Use format like "1-5" or "7".`);
      }

      if (startNum < 1 || endNum < 1) {
        throw new Error('Page numbers must be >= 1.');
      }

      if (startNum > maxPages || endNum > maxPages) {
        throw new Error(
          `Page numbers exceed file length (${maxPages} pages).`
        );
      }

      const min = Math.min(startNum, endNum);
      const max = Math.max(startNum, endNum);

      for (let i = min; i <= max; i++) {
        indices.add(i - 1); // Convert to 0-indexed
      }
    } else {
      // Single page number
      const num = parseInt(trimmed, 10);

      if (isNaN(num)) {
        throw new Error(`Invalid page number: "${trimmed}".`);
      }

      if (num < 1 || num > maxPages) {
        throw new Error(
          `Page ${num} is out of range. File has ${maxPages} pages.`
        );
      }

      indices.add(num - 1); // Convert to 0-indexed
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}
