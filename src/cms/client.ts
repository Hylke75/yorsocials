import 'server-only';
import { cache } from 'react';
import { normalizeSlug, parseCmsContent } from './parse';
import type { CmsContent, CmsPage } from './types';

/** Basis-URL van het CMS (CMS_URL, standaard het Link & Lead-platform). */
export const cmsBaseUrl = () => (process.env.CMS_URL || 'https://linkandlead.nl').replace(/\/+$/, '');
export const CMS_CACHE_TAG = 'cms';
/** Gelijk aan de cache van de CMS-API. */
export const CMS_REVALIDATE_SECONDS = 60;

/** Laatste geldige respons in deze serverinstantie: vangnet als het CMS tijdelijk onbereikbaar is. */
let lastGood: CmsContent | null = null;

/**
 * Bij een storing: tijdens de build terugvallen op de ingebouwde inhoud (een deploy faalt nooit door het
 * CMS); tijdens het draaien de laatste geldige respons gebruiken, en anders een fout gooien zodat Next de
 * vorige (gecachete) versie van de pagina blijft serveren in plaats van terug te springen naar de
 * ingebouwde inhoud.
 */
function onFailure(event: Record<string, unknown>): CmsContent | null {
  console.warn(JSON.stringify({ scope: 'cms', ...event }));
  if (lastGood) return lastGood;
  if (process.env.NEXT_PHASE === 'phase-production-build') return null;
  throw new Error(`CMS niet bereikbaar (${String(event.event)})`);
}

/**
 * Haalt alle gepubliceerde CMS-inhoud in één call op (server-side; het token komt nooit in de browser).
 * Resultaat wordt 60 s gecachet (ISR) en per render gededupliceerd. Zonder token: null, zodat de site de
 * ingebouwde inhoud toont.
 */
export const getCmsContent = cache(async (): Promise<CmsContent | null> => {
  const token = process.env.CMS_TOKEN;
  if (!token) return null;
  let res: Response;
  try {
    res = await fetch(`${cmsBaseUrl()}/api/cms/content`, {
      headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
      next: { revalidate: CMS_REVALIDATE_SECONDS, tags: [CMS_CACHE_TAG] },
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    return onFailure({ event: 'fetch_error', message: err instanceof Error ? err.message : 'unknown' });
  }
  if (!res.ok) return onFailure({ event: 'fetch_failed', status: res.status });
  const parsed = parseCmsContent(await res.json().catch(() => null));
  if (!parsed) return onFailure({ event: 'invalid_response' });
  lastGood = parsed;
  return parsed;
});

export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  const content = await getCmsContent();
  const wanted = normalizeSlug(slug);
  return content?.paginas.find((p) => p.slug === wanted) ?? null;
}

export async function getCmsSite() {
  return (await getCmsContent())?.site ?? null;
}
