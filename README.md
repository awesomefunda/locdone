# Locdone

**Locally processed. Instantly done. Free and open source (MIT).**

PDF tools that run entirely in your browser — at [locdone.com](https://locdone.com).

> Every function that touches your file is in this repo. Read it.
> Grep `/lib/tools` for `fetch(`. You'll find zero matches.
> That is the product.

Convert JPG/PNG to PDF, merge, compress, organize, and redact PDFs without uploading them anywhere. Every byte of processing happens on the user's device via pdf-lib, pdf.js, and the browser's own File API. No servers, no accounts, no tracking.

## Why "Locdone"?

**Loc**al processing. **Done** instantly. The name is the architecture.

## Quick start

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

The `postinstall` hook copies the pdf.js worker from `node_modules/pdfjs-dist/build/` to `public/pdf.worker.min.mjs` so it's served same-origin. If you ever see a worker-loading error, run `npm run copy-worker` manually.

## Stack

- **Next.js 15** (App Router) — static-first, per-route code splitting
- **TypeScript** — strict mode
- **Tailwind CSS** — custom design tokens in `tailwind.config.ts`
- **pdf-lib** (MIT) — PDF creation and manipulation
- **pdfjs-dist** (Apache 2.0) — PDF rendering for thumbnails and preview
- **Lucide React** (ISC) — icon set

No backend. No database. No auth. The whole app is static assets + client JS.

## Project structure

```
locdone/
├── app/                          Next.js App Router
│   ├── layout.tsx                Root layout, fonts, metadata
│   ├── page.tsx                  Homepage
│   ├── globals.css               Design system base styles
│   ├── manifest.ts               PWA manifest
│   ├── robots.ts                 robots.txt
│   ├── sitemap.ts                sitemap.xml
│   ├── jpg-to-pdf/page.tsx       Each tool is its own route for SEO
│   ├── merge-pdf/page.tsx
│   ├── compress-pdf/page.tsx
│   ├── organize-pdf/page.tsx
│   ├── redact-pdf/page.tsx
│   ├── privacy/page.tsx
│   └── pricing/page.tsx
├── components/
│   ├── Nav.tsx                   Top nav with tools dropdown
│   ├── Footer.tsx
│   ├── DropZone.tsx              The signature UX moment
│   ├── ProcessingPanel.tsx       Live network-request counter
│   ├── SuccessPanel.tsx
│   ├── ErrorPanel.tsx
│   ├── PrivacyStrip.tsx          "0 uploads · 0 accounts · 0 tracking"
│   ├── ToolPageLayout.tsx        Shared shell for tool pages
│   ├── FirstDownloadToast.tsx    One-time celebration on first download
│   └── tools/                    One client component per tool
│       ├── JpgToPdfClient.tsx
│       ├── MergePdfClient.tsx
│       ├── CompressPdfClient.tsx
│       ├── OrganizePdfClient.tsx
│       └── RedactPdfClient.tsx
├── lib/
│   ├── tools-registry.ts         Single source of truth for tool metadata
│   ├── utils.ts                  formatBytes, downloadBlob, cn
│   ├── use-privacy-proof.ts      PerformanceObserver-based network counter
│   ├── first-download.ts         Event bus for first-download toast
│   └── tools/                    Pure processing functions — THE TRUST ANCHOR
│       ├── image-to-pdf.ts
│       ├── merge-pdf.ts
│       ├── compress-pdf.ts
│       ├── organize-pdf.ts
│       └── redact-pdf.ts
├── scripts/
│   └── copy-pdfjs-worker.mjs     Copies pdf.worker into /public on install
└── public/                       Static assets (worker, icons)
```

## The architecture, in one breath

1. User drops a file into a `<DropZone>`.
2. Browser reads it as an `ArrayBuffer` via the File API.
3. `lib/tools/*.ts` processes the bytes using pdf-lib and/or pdf.js — pure JavaScript running in the user's tab.
4. The processed `Uint8Array` becomes a `Blob`, then an object URL, then a download via a synthetic `<a>` click.
5. `URL.revokeObjectURL` frees the memory.

At no point in this pipeline is there a `fetch()`, `XMLHttpRequest`, or `WebSocket` pointed at a Locdone server. There is no Locdone server to point one at.

## Verifying the privacy claim

Open your browser's devtools (F12 on most desktop browsers). Switch to the Network tab. Drop any file into any Locdone tool. Watch the Network tab stay empty during processing.

The `<ProcessingPanel>` component shows a live `PerformanceObserver`-backed counter that mirrors what you'd see in the Network tab. If that counter is ever non-zero during processing, something has gone very wrong and we want to hear about it.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Copies pdf.js worker, starts Next.js dev server |
| `npm run build` | Copies pdf.js worker, builds for production |
| `npm run start` | Runs the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run copy-worker` | Manually copy pdf.js worker into /public |

## Design system

Defined in `tailwind.config.ts` and `app/globals.css`. The short version:

- **Dark mode first**, warm grays (not cool blue-grays)
- **Signal Green `#7CFFB2`** is the only accent color, doubling as the trust color
- **Typography**: Instrument Serif (display, italic) + Geist (body) + Geist Mono (UI labels)
- **Motion**: 150–400ms, `cubic-bezier(0.22, 1, 0.36, 1)` ease-out-expo
- **Radii**: 4/8/12/pill
- Elevation via borders, not shadows (except the drop-over glow, which is a moment)

## Roadmap

Shipped (v0.1):
- All 5 tools, client-side, functional
- Live network-request proof UI
- First-download celebration
- SEO metadata, sitemap, PWA manifest
- Privacy and Pricing pages

Next:
- PWA service worker for offline tool caching
- Locdone Pro license unlock (Lemon Squeezy + client-side JWT)
- Text-preserving compression (qpdf-wasm integration)
- Batch processing (drop N files, download .zip)

Later:
- Mobile app (Expo) with camera-to-PDF native flow
- macOS desktop app (Tauri)
- Locdone API (self-hostable Docker image)

## License

**MIT.** Use the code anywhere, including commercial products. The brand "Locdone" and the hosted locdone.com service are separate.
