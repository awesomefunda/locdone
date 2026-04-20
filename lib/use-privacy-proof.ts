'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * usePrivacyProof
 *
 * Observes all network requests the page makes via PerformanceObserver.
 * Separates "page-load" requests (fonts, JS, analytics) from
 * "processing" requests (which should always be zero, ever, period).
 *
 * This is the product's entire moat, rendered as pixels.
 * Users can cross-check this against their own Network tab.
 */
export function usePrivacyProof() {
  const [pageLoadCount, setPageLoadCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const isProcessingRef = useRef(false);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;

    // Count existing entries at mount.
    const existing = performance.getEntriesByType('resource');
    setPageLoadCount(existing.length);

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (isProcessingRef.current) {
        // This should always be 0. If it isn't, the user deserves to know.
        setProcessingCount((n) => n + entries.length);
      } else {
        setPageLoadCount((n) => n + entries.length);
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
      observerRef.current = observer;
    } catch {
      // Older browsers — fail silently, the counter just won't update.
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const startProcessing = () => {
    isProcessingRef.current = true;
    setProcessingCount(0);
  };
  const stopProcessing = () => {
    isProcessingRef.current = false;
  };

  return { pageLoadCount, processingCount, startProcessing, stopProcessing };
}
