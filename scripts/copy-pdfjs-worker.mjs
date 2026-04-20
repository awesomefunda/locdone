#!/usr/bin/env node
/**
 * Copies the pdfjs-dist worker into /public so it's served at /pdf.worker.min.mjs
 *
 * pdfjs-dist ships the worker as a separate file that must be available at a URL
 * the main thread can fetch. We serve ours from /public to keep everything on
 * the same origin — no CDN dependency, no cross-origin hiccups, no uploads.
 *
 * Resilient to pdfjs-dist version differences: checks several known filenames.
 */

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const pdfjsBuildDir = join(projectRoot, 'node_modules', 'pdfjs-dist', 'build');

// Known worker filenames across pdfjs-dist versions. First existing wins.
const candidates = [
  'pdf.worker.min.mjs',
  'pdf.worker.mjs',
  'pdf.worker.min.js',
  'pdf.worker.js',
];

if (!existsSync(pdfjsBuildDir)) {
  // pdfjs-dist isn't installed yet (first install pass). Skip silently.
  console.log('[copy-pdfjs-worker] pdfjs-dist not found yet; skipping.');
  process.exit(0);
}

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

let copied = false;
for (const name of candidates) {
  const src = join(pdfjsBuildDir, name);
  if (existsSync(src)) {
    const dest = join(publicDir, 'pdf.worker.min.mjs');
    copyFileSync(src, dest);
    console.log(`[copy-pdfjs-worker] Copied ${name} -> public/pdf.worker.min.mjs`);
    copied = true;
    break;
  }
}

if (!copied) {
  console.error(
    '[copy-pdfjs-worker] Could not find a pdf.worker file in pdfjs-dist/build. ' +
      'Compress, Organize, and Redact tools will not work without it.'
  );
  // Exit 0 to avoid breaking install; the dev/build script will also retry.
  process.exit(0);
}
