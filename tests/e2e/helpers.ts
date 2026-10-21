import type { BrowserContext, Page } from '@playwright/test';

export const ALL_ROUTES = [
  '/',
  '/services',
  '/services/social-strategie',
  '/services/content-creatie',
  '/services/video-reels',
  '/services/paid-social',
  '/services/community-management',
  '/services/analyse-optimalisatie',
  '/cases',
  '/cases/voorbeeld-horeca-lokaal-zichtbaar',
  '/over-ons',
  '/artikelen',
  '/artikelen/zo-bouw-je-een-reels-format',
  '/contact',
  '/faq',
  '/privacy',
  '/cookies',
];

/** Zet een geldige "alleen noodzakelijk"-keuze zodat de banner tests niet hindert. */
export async function dismissConsent(context: BrowserContext, baseURL: string, analytics = false) {
  const value = encodeURIComponent(
    JSON.stringify({ version: '2026-10-1', necessary: true, analytics, marketing: false, updatedAt: '2026-10-21T00:00:00.000Z' }),
  );
  await context.addCookies([
    { name: 'ys_consent', value, url: baseURL },
    // Nieuwsbrief-pop-up onderdrukken in tests die er niet over gaan.
    { name: 'ys_newsletter', value: 'dismissed', url: baseURL },
  ]);
}

export async function analyticsLog(page: Page) {
  return page.evaluate(() => window.__ysAnalyticsLog ?? []);
}
