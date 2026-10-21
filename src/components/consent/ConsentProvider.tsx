'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  createConsent,
  readConsentCookie,
  serializeConsent,
  type ConsentState,
} from '@/lib/consent';
import type { GlobalContent } from '@/content/types';
import { ConsentBanner } from './ConsentBanner';
import { ConsentDialog } from './ConsentDialog';

interface ConsentContextValue {
  /** undefined = nog niet gelezen (SSR), null = onbekend/geen keuze. */
  consent: ConsentState | null | undefined;
  save: (choice: { analytics: boolean; marketing: boolean }) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openPreferences: () => void;
  texts: ConsentTexts;
}

export interface ConsentTexts {
  banner: GlobalContent['consentBanner'];
  preferences: GlobalContent['consentPreferences'];
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent moet binnen <ConsentProvider> gebruikt worden');
  return ctx;
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`];
  for (const c of document.cookie.split('; ')) {
    const name = c.split('=')[0] ?? '';
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
      for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
    }
  }
}

/**
 * Consentmanager: geen analytics vóór geldige opt-in; toestemming is te wijzigen en in te trekken.
 * De keuze (met versie en tijdstip) staat in een first-party cookie.
 */
export function ConsentProvider({ children, texts }: { children: ReactNode; texts: ConsentTexts }) {
  const [consent, setConsent] = useState<ConsentState | null | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Cookie kan pas na hydratie gelezen worden; SSR rendert de "onbekend"-toestand niet.
    const stored = readConsentCookie(document.cookie);
    // Vlag direct zetten, zodat child-effects in dezelfde commit al de juiste waarde zien.
    window.__ysAnalyticsConsent = Boolean(stored?.analytics);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
  }, []);

  const analyticsAllowed = Boolean(consent?.analytics);

  useEffect(() => {
    window.__ysAnalyticsConsent = analyticsAllowed;
    if (!analyticsAllowed && consent !== undefined) {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      clearAnalyticsCookies();
    }
  }, [analyticsAllowed, consent]);

  useEffect(() => {
    if (analyticsAllowed) track('page_view', { path: pathname });
  }, [pathname, analyticsAllowed]);

  // Gedelegeerde kliktracking voor CTA's met data-track.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      const kind = el.dataset.track === 'booking' ? 'booking_click' : 'cta_click';
      track(kind, { destination: el.dataset.destination, placement: el.dataset.placement });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const save = useCallback((choice: { analytics: boolean; marketing: boolean }) => {
    const state = createConsent(choice);
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE}=${serializeConsent(state)}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
    window.__ysAnalyticsConsent = state.analytics;
    setConsent(state);
    setDialogOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      save,
      acceptAll: () => save({ analytics: true, marketing: false }),
      rejectAll: () => save({ analytics: false, marketing: false }),
      openPreferences: () => setDialogOpen(true),
      texts,
    }),
    [consent, save, texts],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {consent === null && !dialogOpen && <ConsentBanner content={texts.banner} />}
      <ConsentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      {analyticsAllowed && GA_ID && (
        <>
          <Script id="ga-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false,anonymize_ip:true});`}
          </Script>
        </>
      )}
    </ConsentContext.Provider>
  );
}
