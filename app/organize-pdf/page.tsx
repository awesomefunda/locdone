import type { Metadata } from 'next';
import { ToolPageLayout } from '@/components/ToolPageLayout';
import { OrganizePdfClient } from '@/components/tools/OrganizePdfClient';
import { getTool } from '@/lib/tools-registry';

const tool = getTool('organize-pdf')!;

export const metadata: Metadata = {
  title: 'Organize PDF — Reorder, Delete, Rotate Pages',
  description:
    'Drag to reorder, click to delete, rotate pages — all in your browser. Locdone runs locally at locdone.com.',
  alternates: { canonical: '/organize-pdf' },
  openGraph: {
    title: 'Organize PDF — Reorder, Delete, Rotate Pages | Locdone',
    description:
      'Drag to reorder, click to delete, rotate pages — all in your browser.',
    url: 'https://locdone.com/organize-pdf',
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      howItWorks={[
        {
          title: 'Drop a PDF',
          body: 'Locdone renders every page as a thumbnail in your browser. The file stays in your tab\'s memory, never on a server.',
        },
        {
          title: 'Rearrange visually',
          body: 'Drag pages to reorder them. Hover to reveal rotation and delete controls. Work as long as you need — nothing is saved anywhere yet.',
        },
        {
          title: 'Save when ready',
          body: 'Locdone rebuilds the PDF from your arrangement. The source file was never touched or transmitted.',
        },
      ]}
      faq={[
        {
          q: 'Does this tool upload my PDF?',
          a: 'No. Everything happens in your browser. Verify by disabling WiFi/internet, then drop a PDF and make changes. Open DevTools (F12) Network tab—zero requests during processing.',
        },
        {
          q: 'Will I lose quality when I save?',
          a: 'No. Locdone copies the original pages byte-for-byte into the new order. Only pages you rotate or delete change; everything else stays exact.',
        },
        {
          q: 'Can I undo a delete?',
          a: 'Start over by reloading the original file — nothing is saved until you click "Save PDF". Think of the workspace as a scratchpad.',
        },
        {
          q: 'How many pages can I organize at once?',
          a: 'Hundreds on a modern laptop. Very large PDFs may take longer to thumbnail on entry-level devices.',
        },
        {
          q: 'Does this work on mobile?',
          a: 'Yes. Thumbnails reflow to a smaller grid and long-press works as drag on touch devices in most browsers.',
        },
      ]}
    >
      <OrganizePdfClient />
    </ToolPageLayout>
  );
}
