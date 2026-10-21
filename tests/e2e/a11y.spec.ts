import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ALL_ROUTES, dismissConsent } from './helpers';

test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

for (const route of ALL_ROUTES) {
  test(`geen WCAG 2.2 A/AA-overtredingen op ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
    expect(summary).toEqual([]);
  });
}


test('respecteert prefers-reduced-motion (ticker staat stil)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const anim = await page.locator('ul[aria-label="Waar we mee helpen"]').evaluate((el) => getComputedStyle(el.parentElement!).animationName);
  expect(anim).toBe('none');
});
