import { getContentMode } from '@/lib/env';
import { articles } from './data/articles';
import { cases, sectors } from './data/cases';
import { services, workProcess } from './data/services';
import { faqs, legalPages, siteSettings, team, values } from './data/site';
import { globalContent } from './data/global';
import { pages } from './data/pages';
import type { Article, CaseResult, CaseStudy, ContentMode, ContentStatus, LegalPage, Service } from './types';

/**
 * Enige toegangspunt voor content. Templates importeren nooit rechtstreeks uit `data/`.
 * Bij een CMS-koppeling worden deze functies async fetchers met dezelfde returntypes.
 */

export function isVisible(status: ContentStatus, mode: ContentMode = getContentMode()): boolean {
  if (status === 'published') return true;
  if (status === 'demo') return mode === 'staging';
  return false;
}

export const getSiteSettings = () => siteSettings;
export const getPages = () => pages;
export const getGlobalContent = () => globalContent;
export const getValues = () => values;
export const getWorkProcess = () => workProcess;

export function getServices(mode?: ContentMode): Service[] {
  return services.filter((s) => isVisible(s.status, mode));
}

export function getService(slug: string, mode?: ContentMode): Service | undefined {
  return getServices(mode).find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[], mode?: ContentMode): Service[] {
  return getServices(mode).filter((s) => slugs.includes(s.slug));
}

export function getOtherServices(slug: string, count = 3, mode?: ContentMode): Service[] {
  const all = getServices(mode);
  const index = all.findIndex((s) => s.slug === slug);
  // Roteer zodat elke dienst andere "gerelateerde" diensten toont.
  return [...all.slice(index + 1), ...all.slice(0, Math.max(index, 0))].slice(0, count);
}

export function getCases(mode?: ContentMode): CaseStudy[] {
  return cases.filter((c) => isVisible(c.status, mode));
}

export function getCase(slug: string, mode?: ContentMode): CaseStudy | undefined {
  return getCases(mode).find((c) => c.slug === slug);
}

export const getSectors = () => sectors;

export function getSectorLabel(id: string): string {
  return sectors.find((s) => s.id === id)?.label ?? id;
}

/** Alleen resultaten met goedkeuring, bron en meetperiode mogen getoond worden. */
export function getApprovedResults(c: CaseStudy): CaseResult[] {
  return c.results.filter((r) => r.approved && r.source.trim() !== '' && r.period.trim() !== '');
}

/** Klantnaam alleen na expliciete toestemming. */
export function getDisplayClientName(c: CaseStudy): string | null {
  return c.permissionGranted && c.clientName ? c.clientName : null;
}

export function getArticles(mode?: ContentMode): Article[] {
  return articles
    .filter((a) => isVisible(a.status, mode))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

export function getArticle(slug: string, mode?: ContentMode): Article | undefined {
  return getArticles(mode).find((a) => a.slug === slug);
}

export function getArticleCategories(mode?: ContentMode): string[] {
  return [...new Set(getArticles(mode).map((a) => a.category))];
}

export function getRelatedArticles(article: Article, count = 2, mode?: ContentMode): Article[] {
  const others = getArticles(mode).filter((a) => a.slug !== article.slug);
  const score = (a: Article) =>
    (a.category === article.category ? 2 : 0) + a.relatedServices.filter((s) => article.relatedServices.includes(s)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, count);
}

export function getArticlesForService(serviceSlug: string, mode?: ContentMode): Article[] {
  return getArticles(mode).filter((a) => a.relatedServices.includes(serviceSlug));
}

export function getFaqs(mode?: ContentMode) {
  return faqs.filter((f) => isVisible(f.status, mode)).sort((a, b) => a.order - b.order);
}

export function getTeam(mode?: ContentMode) {
  return team
    .filter((m) => m.consentConfirmed && isVisible(m.status, mode))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getLegalPage(slug: LegalPage['slug']): LegalPage {
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Legal page ${slug} ontbreekt`);
  return page;
}
