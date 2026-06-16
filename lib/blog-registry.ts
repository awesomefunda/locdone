export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'redact-pdf-before-uploading-to-ai',
    title: 'How to Redact a PDF Before Uploading to ChatGPT or Any AI Tool',
    description: 'Millions of people share medical records, financial statements, and legal documents with AI tools. Here is how to remove sensitive information first — locally, free, and verifiably private.',
    date: '2025-06-14',
    readingTime: '5 min read',
    tags: ['redaction', 'ai', 'privacy'],
  },
  {
    slug: 'oci-card-pdf-documents',
    title: 'How to Prepare PDF Documents for Your OCI Card Application',
    description: 'A step-by-step guide to merging, converting, and organising the PDF documents required for an OCI card application — without uploading your passport scans to a third-party server.',
    date: '2025-06-14',
    readingTime: '4 min read',
    tags: ['oci', 'merge', 'jpg-to-pdf'],
  },
  {
    slug: 'how-to-merge-pdfs-without-uploading',
    title: 'How to Merge PDFs Without Uploading to a Server',
    description: 'Most free PDF merge tools upload your files to their servers. Here is why that matters and how to combine PDFs entirely in your browser with no data leaving your device.',
    date: '2025-06-14',
    readingTime: '4 min read',
    tags: ['merge', 'privacy'],
  },
  {
    slug: 'hipaa-compliant-pdf-tools',
    title: 'HIPAA-Compliant PDF Tools That Are Actually Free',
    description: 'Most free online PDF tools are incompatible with HIPAA because they upload files to third-party servers. Here is what healthcare workers need and how browser-only tools solve it.',
    date: '2025-06-14',
    readingTime: '5 min read',
    tags: ['hipaa', 'compliance', 'healthcare'],
  },
  {
    slug: 'remove-pdf-metadata-before-sharing',
    title: 'How to Remove Hidden Metadata from a PDF Before Sharing',
    description: 'Every PDF you create contains hidden metadata — your name, your organisation, the software you used, and timestamps. Here is how to find it and strip it before sharing.',
    date: '2025-06-14',
    readingTime: '4 min read',
    tags: ['metadata', 'privacy'],
  },
  {
    slug: 'bates-numbering-pdf-free',
    title: 'How to Add Bates Numbers to a PDF for Free',
    description: 'Bates numbering is required for legal discovery and court filings. Here is what Bates numbers are, when you need them, and how to add them free without uploading your documents.',
    date: '2025-06-14',
    readingTime: '4 min read',
    tags: ['bates', 'legal'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
