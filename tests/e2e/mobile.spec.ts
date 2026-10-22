import { expect, test } from '@playwright/test';
import { dismissConsent } from './helpers';

test.use({ viewport: { width: 375, height: 812 } });
test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

test('mobiel menu opent, sluit met Escape en geeft focus terug', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu openen' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('navigation', { name: 'Hoofdnavigatie' })).toBeHidden();
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Menu sluiten' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Hoofdnavigatie' }).getByRole('link', { name: 'Home' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Hoofdnavigatie' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Menu openen' })).toBeFocused();
});

test('mobiel menu navigeert en sluit daarna', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu openen' }).click();
  await page.getByRole('navigation', { name: 'Hoofdnavigatie' }).getByRole('link', { name: 'Cases' }).click();
  await expect(page).toHaveURL('/cases');
  await expect(page.getByRole('button', { name: 'Menu openen' })).toHaveAttribute('aria-expanded', 'false');
});

test('tap-targets in het menu zijn minimaal 44px hoog', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu openen' });
  expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  for (const link of await page.getByRole('navigation', { name: 'Hoofdnavigatie' }).getByRole('link').all()) {
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
});

test('primaire CTA is direct zichtbaar in de mobiele hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#inhoud').getByRole('link', { name: 'Plan een kennismaking' }).first()).toBeInViewport();
});
