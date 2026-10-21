import type { ContentMode } from '@/content/types';

export function getContentMode(): ContentMode {
  return process.env.NEXT_PUBLIC_CONTENT_MODE === 'production' ? 'production' : 'staging';
}

/**
 * Basis-URL voor canonicals, sitemap en OG. Volgorde: expliciet ingesteld → het
 * productiedomein dat Vercel tijdens de build meegeeft → lokaal.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'http://localhost:3000';
}
