import { globalContent } from '@/content/data/global';
import { getArticles, getCases, getServices } from '@/content/repository';
import type { ContentMode } from '@/content/types';

export const STATIC_ROUTES = ['/', '/services', '/cases', '/over-ons', '/artikelen', '/contact', '/faq', '/privacy', '/cookies'] as const;

/** Hoofdnavigatie; beheerd in de contentlaag (globalContent.navigation). */
export const NAV_LINKS = globalContent.navigation;

/** Alle routes die in de gegeven contentmodus bestaan (sitemap, tests). */
export function getAllRoutes(mode?: ContentMode): string[] {
  return [
    ...STATIC_ROUTES,
    ...getServices(mode).map((s) => `/services/${s.slug}`),
    ...getCases(mode).map((c) => `/cases/${c.slug}`),
    ...getArticles(mode).map((a) => `/artikelen/${a.slug}`),
  ];
}

export function isActivePath(current: string, href: string): boolean {
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}
