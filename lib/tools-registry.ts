import {
  FileImage,
  FileStack,
  FileMinus2,
  LayoutGrid,
  Square,
  Scissors,
  type LucideIcon,
} from 'lucide-react';

export type Tool = {
  slug: string;
  name: string;
  short: string;
  /** Leading part of the hero headline, rendered in primary color */
  taglineLead: string;
  /** Emphasized tail of the hero headline, rendered in accent color */
  taglineAccent: string;
  description: string;
  Icon: LucideIcon;
  keywords: string[];
};

export const TOOLS: readonly Tool[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDFs',
    short: 'Combine multiple PDFs',
    taglineLead: 'Merge PDFs',
    taglineAccent: 'without uploading anything',
    description:
      'Combine PDFs in your browser. Fast, free, and your files never leave this device.',
    Icon: FileStack,
    keywords: ['merge pdf', 'combine pdf', 'join pdfs'],
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    short: 'Shrink file size',
    taglineLead: 'Compress PDFs',
    taglineAccent: 'without uploading them',
    description:
      'Shrink PDFs in your browser without uploading them anywhere. Private, fast, free.',
    Icon: FileMinus2,
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf'],
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    short: 'Extract pages',
    taglineLead: 'Split PDFs,',
    taglineAccent: 'extract pages',
    description:
      'Extract specific pages from a PDF or split into separate documents. Fast, private, all processing in your browser.',
    Icon: Scissors,
    keywords: ['split pdf', 'extract pages', 'pdf splitter', 'page extraction'],
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    short: 'Convert images to PDF',
    taglineLead: 'JPG to PDF,',
    taglineAccent: 'on your device',
    description:
      'Convert JPG and PNG images to PDF in your browser. Files never leave your device.',
    Icon: FileImage,
    keywords: ['jpg to pdf', 'png to pdf', 'image to pdf', 'convert images'],
  },
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    short: 'Reorder, delete, rotate',
    taglineLead: 'Organize PDF pages',
    taglineAccent: 'visually',
    description:
      'Drag to reorder, click to delete, rotate pages — all in your browser.',
    Icon: LayoutGrid,
    keywords: ['organize pdf', 'reorder pdf pages', 'delete pdf pages', 'rotate pdf'],
  },
  {
    slug: 'redact-pdf',
    name: 'Redact PDF',
    short: 'Black out sensitive info',
    taglineLead: 'Redact PDFs,',
    taglineAccent: 'on your device',
    description:
      'Draw redactions over sensitive content in PDFs. Nothing uploaded, nothing tracked.',
    Icon: Square,
    keywords: ['redact pdf', 'black out pdf', 'hide text in pdf'],
  },
] as const;

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
