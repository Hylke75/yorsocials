import type { MetadataRoute } from 'next';
import { getArticles, getCases, getServices } from '@/content/repository';
import { getSiteUrl } from '@/lib/env';
import { STATIC_ROUTES } from '@/lib/routes';

// Alleen indexeerbare pagina's: concept-juridische pagina's en demo-content (noindex) vallen weg.
const NOINDEX_STATIC = new Set(['/privacy', '/cookies']);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const entry = (path: string, priority: number, lastModified?: string | null): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    ...(lastModified ? { lastModified } : {}),
    priority,
  });
  return [
    ...STATIC_ROUTES.filter((r) => !NOINDEX_STATIC.has(r)).map((r) => entry(r, r === '/' ? 1 : 0.8)),
    ...getServices()
      .filter((s) => !s.seo.noIndex)
      .map((s) => entry(`/services/${s.slug}`, 0.7)),
    ...getCases()
      .filter((c) => !c.seo.noIndex)
      .map((c) => entry(`/cases/${c.slug}`, 0.6)),
    ...getArticles()
      .filter((a) => !a.seo.noIndex)
      .map((a) => entry(`/artikelen/${a.slug}`, 0.5, a.publishedAt)),
  ];
}
