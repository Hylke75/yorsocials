import type { MetadataRoute } from 'next';
import { getCmsContent } from '@/cms/client';
import { parseArticles } from '@/cms/parse';
import { getArticles, getCases, getServices } from '@/content/repository';
import { getSiteUrl } from '@/lib/env';
import { STATIC_ROUTES } from '@/lib/routes';

// Alleen indexeerbare pagina's: concept-juridische pagina's en demo-content (noindex) vallen weg.
const NOINDEX_STATIC = new Set(['/juridisch/privacy', '/juridisch/cookies']);

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, lastModified?: string | null) => {
    if (seen.has(path)) return;
    seen.add(path);
    out.push({ url: `${base}${path}`, ...(lastModified ? { lastModified } : {}), priority });
  };

  STATIC_ROUTES.filter((r) => !NOINDEX_STATIC.has(r)).forEach((r) => add(r, r === '/' ? 1 : 0.8));
  getServices()
    .filter((s) => !s.seo.noIndex)
    .forEach((s) => add(`/diensten/${s.slug}`, 0.7));
  getCases()
    .filter((c) => !c.seo.noIndex)
    .forEach((c) => add(`/cases/${c.slug}`, 0.6));
  getArticles()
    .filter((a) => !a.seo.noIndex)
    .forEach((a) => add(`/artikelen/${a.slug}`, 0.5, a.publishedAt));

  // Pagina's en artikelen uit het CMS (alleen gepubliceerd; juridische pagina's niet).
  const cms = await getCmsContent();
  cms?.paginas.filter((p) => !p.slug.startsWith('/juridisch')).forEach((p) => add(p.slug, p.slug === '/' ? 1 : 0.6));
  parseArticles(cms?.records.artikelen).forEach((a) => add(`/artikelen/${a.slug}`, 0.5, a.gepubliceerd_op));
  return out;
}
