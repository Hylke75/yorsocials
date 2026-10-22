'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Cookieloze analytics. Plausible telt paginaweergaven zelf; CTA-kliks (elementen met data-track)
 * worden hier gedelegeerd doorgegeven. Zonder NEXT_PUBLIC_PLAUSIBLE_DOMAIN wordt er niets geladen.
 */
export function Analytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      track(el.dataset.track === 'booking' ? 'booking_click' : 'cta_click', {
        destination: el.dataset.destination,
        placement: el.dataset.placement,
      });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!PLAUSIBLE_DOMAIN) return null;
  return <Script src="https://plausible.io/js/script.js" data-domain={PLAUSIBLE_DOMAIN} strategy="afterInteractive" />;
}
