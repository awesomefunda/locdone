'use client';

import { useEffect, useState } from 'react';
import { onFirstDownload } from '@/lib/first-download';

export function FirstDownloadToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const unsub = onFirstDownload(() => {
      setVisible(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 5500);
    });

    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 transition-all duration-500 ease-out-expo ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-md rounded-lg border border-accent bg-bg-elevated px-5 py-4 shadow-glow-strong">
        <p className="font-display text-base italic leading-snug">
          That file never left your computer.
          <br />
          Not this time, not ever.
        </p>
        <p className="mt-1.5 font-mono text-xs text-accent">— Locdone</p>
      </div>
    </div>
  );
}
