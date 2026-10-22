'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Stuurt detailpagina-events (cookieloos, zie lib/analytics). */
export function ServiceViewTracker({ slug }: { slug: string }) {
  useEffect(() => track('service_view', { slug }), [slug]);
  return null;
}

export function CaseViewTracker({ slug }: { slug: string }) {
  useEffect(() => track('case_view', { slug }), [slug]);
  return null;
}
