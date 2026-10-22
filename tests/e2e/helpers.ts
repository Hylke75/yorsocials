import type { BrowserContext, Page } from '@playwright/test';

export const ALL_ROUTES = [
  '/',
  '/diensten',
  '/diensten/social-strategie',
  '/diensten/content-creatie',
  '/diensten/video-reels',
  '/diensten/paid-social',
  '/diensten/community-management',
  '/diensten/analyse-optimalisatie',
  '/cases',
  '/cases/voorbeeld-horeca-lokaal-zichtbaar',
  '/over-ons',
  '/artikelen',
  '/artikelen/zo-bouw-je-een-reels-format',
  '/contact',
  '/faq',
  '/juridisch/privacy',
  '/juridisch/cookies',
];

/** Onderdrukt de nieuwsbrief-pop-up in tests die er niet over gaan. */
export async function dismissConsent(context: BrowserContext, baseURL: string) {
  await context.addCookies([{ name: 'ys_newsletter', value: 'dismissed', url: baseURL }]);
}

export async function analyticsLog(page: Page) {
  return page.evaluate(() => window.__ysAnalyticsLog ?? []);
}
