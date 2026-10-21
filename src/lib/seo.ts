import type { Metadata } from 'next';
import { getSiteSettings } from '@/content/repository';
import { getContentMode, getSiteUrl } from './env';

interface PageMeta {
  title?: string;
  description: string;
  path: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string | null;
}

/** Bouwt per route title, description, canonical en OG/Twitter-metadata. */
export function buildMetadata({ title, description, path, noIndex, type = 'website', publishedTime }: PageMeta): Metadata {
  const site = getSiteSettings();
  // Staging wordt nooit geïndexeerd; concept-/demopagina's ook niet in productie.
  const index = getContentMode() === 'production' && !noIndex;
  const fullTitle = title ? `${title} | ${site.name}` : site.defaultSeo.title;
  return {
    title: title ? { absolute: fullTitle } : { absolute: site.defaultSeo.title },
    description,
    alternates: { canonical: path },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: 'nl_NL',
      title: fullTitle,
      description,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

export function organizationJsonLd() {
  const site = getSiteSettings();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: getSiteUrl(),
    logo: absoluteUrl(site.logo.original.src),
    slogan: site.tagline,
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    sameAs: site.socialLinks.filter((s) => s.verified).map((s) => s.url),
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
