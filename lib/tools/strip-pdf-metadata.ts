/**
 * PDF metadata stripper.
 *
 * Removes all identifying metadata from a PDF:
 *   - Document Info dictionary (title, author, subject, keywords,
 *     creator, producer, creation date, modification date)
 *   - XMP metadata stream embedded in the document catalog
 *
 * Everything runs in-browser; the file is never sent anywhere.
 */

import { PDFDocument, PDFName, PDFDict } from 'pdf-lib';

export type MetadataSnapshot = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  hasXmp: boolean;
};

/** Read current metadata from a PDF for display before stripping. */
export async function readPdfMetadata(file: File): Promise<MetadataSnapshot> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

  const title = pdf.getTitle();
  const author = pdf.getAuthor();
  const subject = pdf.getSubject();
  const keywords = pdf.getKeywords();
  const creator = pdf.getCreator();
  const producer = pdf.getProducer();
  const creationDate = pdf.getCreationDate();
  const modificationDate = pdf.getModificationDate();

  // Check for XMP stream in catalog
  let hasXmp = false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const catalog = (pdf as any).catalog as PDFDict;
    hasXmp = catalog.has(PDFName.of('Metadata'));
  } catch {
    // ignore
  }

  return {
    title: title || undefined,
    author: author || undefined,
    subject: subject || undefined,
    keywords: keywords || undefined,
    creator: creator || undefined,
    producer: producer || undefined,
    creationDate: creationDate ? creationDate.toISOString().split('T')[0] : undefined,
    modificationDate: modificationDate
      ? modificationDate.toISOString().split('T')[0]
      : undefined,
    hasXmp,
  };
}

/** Strip all metadata and return the cleaned PDF bytes. */
export async function stripPdfMetadata(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

  // 1. Clear XMP metadata stream from the document catalog
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const catalog = (pdf as any).catalog as PDFDict;
    const metaKey = PDFName.of('Metadata');
    if (catalog.has(metaKey)) {
      catalog.delete(metaKey);
    }
  } catch {
    // If internal access fails, proceed without XMP removal
  }

  // 2. Wipe all fields in the document Info dictionary
  //    Access the raw dict so we can delete *every* key (including custom ones)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context = (pdf as any).context;
    const infoRef = context.trailerInfo?.Info;
    if (infoRef) {
      const infoDict = context.lookup(infoRef);
      if (infoDict instanceof PDFDict) {
        for (const key of infoDict.keys()) {
          infoDict.delete(key);
        }
      }
    }
  } catch {
    // Fall back to the high-level setters
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('');
    pdf.setCreator('');
  }

  return await pdf.save({ updateFieldAppearances: false });
}
