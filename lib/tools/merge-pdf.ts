/**
 * PDF merger.
 *
 * Reads multiple PDF files in order, copies every page into a new document,
 * returns the merged bytes. All in-browser.
 */

import { PDFDocument } from 'pdf-lib';

export type MergeProgress = {
  current: number;
  total: number;
  filename: string;
};

export async function mergePdfs(
  files: File[],
  onProgress?: (p: MergeProgress) => void
): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error('Merging needs at least two files.');
  }

  const merged = await PDFDocument.create();
  merged.setCreator('Locdone');
  merged.setProducer('Locdone (locally processed)');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ current: i + 1, total: files.length, filename: file.name });

    const bytes = await file.arrayBuffer();
    let src: PDFDocument;
    try {
      src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    } catch {
      throw new Error(
        `"${file.name}" couldn't be read. It may be corrupt or password-protected.`
      );
    }

    const pageIndices = src.getPageIndices();
    const copied = await merged.copyPages(src, pageIndices);
    copied.forEach((p) => merged.addPage(p));
  }

  return await merged.save();
}
