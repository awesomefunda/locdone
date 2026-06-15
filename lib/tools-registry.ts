import {
  FileImage,
  FileStack,
  FileMinus2,
  LayoutGrid,
  Square,
  Scissors,
  ShieldOff,
  Hash,
  type LucideIcon,
} from 'lucide-react';

export type Tool = {
  slug: string;
  name: string;
  short: string;
  taglineLead: string;
  taglineAccent: string;
  description: string;
  Icon: LucideIcon;
  keywords: string[];
};

export const TOOLS: readonly Tool[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDFs',
    short: 'Combine PDFs — nothing uploaded, no watermark',
    taglineLead: 'Merge PDFs',
    taglineAccent: 'without uploading anything',
    description: 'Combine PDFs in your browser. Fast, free, and your files never leave this device.',
    Icon: FileStack,
    keywords: ['merge pdf', 'combine pdf', 'join pdfs'],
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    short: 'Smaller file — stays on your device',
    taglineLead: 'Compress PDFs',
    taglineAccent: 'without uploading them',
    description: 'Shrink PDFs in your browser without uploading them anywhere. Private, fast, free.',
    Icon: FileMinus2,
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf'],
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    short: 'Pull specific pages — files never leave your browser',
    taglineLead: 'Split PDFs,',
    taglineAccent: 'extract pages',
    description: 'Extract specific pages from a PDF or split into separate documents. Fast, private, all processing in your browser.',
    Icon: Scissors,
    keywords: ['split pdf', 'extract pages', 'pdf splitter', 'page extraction'],
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    short: 'Turn photos and scans into a PDF, offline',
    taglineLead: 'JPG to PDF,',
    taglineAccent: 'on your device',
    description: 'Convert JPG and PNG images to PDF in your browser. Files never leave your device.',
    Icon: FileImage,
    keywords: ['jpg to pdf', 'png to pdf', 'image to pdf', 'convert images'],
  },
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    short: 'Reorder, rotate, delete pages — no cloud required',
    taglineLead: 'Organize PDF pages',
    taglineAccent: 'visually',
    description: 'Drag to reorder, click to delete, rotate pages - all in your browser.',
    Icon: LayoutGrid,
    keywords: ['organize pdf', 'reorder pdf pages', 'delete pdf pages', 'rotate pdf'],
  },
  {
    slug: 'redact-pdf',
    name: 'Redact PDF',
    short: 'True redaction — text is gone, not just covered',
    taglineLead: 'Redact PDFs,',
    taglineAccent: 'on your device',
    description: 'True redaction: text is burned out of the page, not just covered. Nothing uploaded, nothing tracked.',
    Icon: Square,
    keywords: [
      'redact pdf',
      'black out pdf',
      'hide text in pdf',
      'permanent pdf redaction',
      'hipaa pdf redaction',
      'legal redaction',
      'court filing redaction',
      'remove text from pdf permanently',
      'redact pdf before uploading to ai',
      'redact pdf before chatgpt',
      'remove personal info from pdf before ai',
      'redact medical records before ai',
      'redact financial documents ai',
      'remove ssn from pdf',
      'privacy ai document upload',
    ],
  },
  {
    slug: 'strip-pdf-metadata',
    name: 'Strip PDF Metadata',
    short: 'Erase who made it, when, and with what — before you share',
    taglineLead: 'Remove PDF metadata',
    taglineAccent: 'before you share',
    description: 'See and erase hidden metadata from any PDF: author name, software used, creation date, and XMP data. All in your browser.',
    Icon: ShieldOff,
    keywords: [
      'remove pdf metadata',
      'strip pdf metadata',
      'pdf metadata remover',
      'remove author from pdf',
      'pdf privacy',
      'hipaa pdf metadata',
      'clean pdf metadata',
    ],
  },
  {
    slug: 'bates-number-pdf',
    name: 'Bates Number PDF',
    short: 'Court-ready sequential page stamps — free, no account',
    taglineLead: 'Bates-number a PDF',
    taglineAccent: 'free, no upload',
    description: 'Add sequential Bates stamps to every page. Set your prefix, starting number, and position. Runs in your browser.',
    Icon: Hash,
    keywords: [
      'bates number pdf',
      'bates stamp pdf',
      'add bates numbers',
      'bates numbering online',
      'legal bates stamp',
      'bates label pdf free',
    ],
  },
] as const;

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
