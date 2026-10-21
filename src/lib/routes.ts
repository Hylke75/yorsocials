import { getArticles, getCases, getServices } from '@/content/repository';
import type { ContentMode } from '@/content/types';

export const STATIC_ROUTES = ['/', '/services', '/cases', '/over-ons', '/artikelen', '/contact', '/faq', '/privacy', '/cookies'] as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/cases', label: 'Cases' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/artikelen', label: 'Artikelen' },
  { href: '/contact', label: 'Contact' },
] as const;

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
