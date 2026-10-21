import 'server-only';
import { cache } from 'react';
import { normalizeSlug, parseCmsContent } from './parse';
import type { CmsContent, CmsPage } from './types';

export const CMS_ENDPOINT = 'https://linkandlead.nl/api/cms/content';
export const CMS_CACHE_TAG = 'cms';
/** Gelijk aan de cache van de CMS-API. */
export const CMS_REVALIDATE_SECONDS = 60;

/**
 * Haalt alle gepubliceerde CMS-inhoud in één call op (server-side; het token komt nooit in de browser).
 * Resultaat wordt 60 s gecachet (ISR) en per render gededupliceerd. Bij een fout of zonder token: null,
 * zodat de site terugvalt op de ingebouwde inhoud.
 */
export const getCmsContent = cache(async (): Promise<CmsContent | null> => {
  const token = process.env.CMS_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(CMS_ENDPOINT, {
      headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
      next: { revalidate: CMS_REVALIDATE_SECONDS, tags: [CMS_CACHE_TAG] },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(JSON.stringify({ scope: 'cms', event: 'fetch_failed', status: res.status }));
      return null;
    }
    const parsed = parseCmsContent(await res.json());
    if (!parsed) console.warn(JSON.stringify({ scope: 'cms', event: 'invalid_response' }));
    return parsed;
  } catch (err) {
    console.warn(JSON.stringify({ scope: 'cms', event: 'fetch_error', message: err instanceof Error ? err.message : 'unknown' }));
    return null;
  }
});

export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  const content = await getCmsContent();
  const wanted = normalizeSlug(slug);
  return content?.paginas.find((p) => p.slug === wanted) ?? null;
}

export async function getCmsSite() {
  return (await getCmsContent())?.site ?? null;
}
