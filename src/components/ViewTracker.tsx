'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { useConsent } from './consent/ConsentProvider';

/** Stuurt detailpagina-events zodra (en alleen als) er analytics-toestemming is. */
function useViewEvent(event: 'service_view' | 'case_view', slug: string) {
  const { consent } = useConsent();
  const allowed = Boolean(consent?.analytics);
  useEffect(() => {
    if (allowed) track(event, { slug });
  }, [allowed, event, slug]);
}

export function ServiceViewTracker({ slug }: { slug: string }) {
  useViewEvent('service_view', slug);
  return null;
}

export function CaseViewTracker({ slug }: { slug: string }) {
  useViewEvent('case_view', slug);
  return null;
}
