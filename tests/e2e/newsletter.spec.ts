import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function consentOnly(context: import('@playwright/test').BrowserContext, baseURL: string) {
  const value = encodeURIComponent(
    JSON.stringify({ version: '2026-10-1', necessary: true, analytics: false, marketing: false, updatedAt: '2026-10-21T00:00:00.000Z' }),
  );
  await context.addCookies([{ name: 'ys_consent', value, url: baseURL }]);
}

test('pop-up verschijnt na ~3 seconden, niet eerder', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/');
  const popup = page.getByRole('dialog', { name: /Blijf op de hoogte/ });
  await page.waitForTimeout(2000);
  await expect(popup).toBeHidden();
  await expect(popup).toBeVisible({ timeout: 3000 });
  await expect(page.getByLabel('E-mailadres')).toBeVisible();
});

test('verschijnt pas na de cookiekeuze, niet over de cookiebanner heen', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3500);
  await expect(page.getByTestId('consent-banner')).toBeVisible();
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeHidden();
  await page.getByRole('button', { name: 'Alleen noodzakelijk' }).click();
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeVisible({ timeout: 4500 });
});

test('sluiten met Escape onthoudt de keuze', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/services');
  const popup = page.getByRole('dialog', { name: /Blijf op de hoogte/ });
  await expect(popup).toBeVisible({ timeout: 5000 });
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await page.reload();
  await page.waitForTimeout(3600);
  await expect(popup).toBeHidden();
});

test('"Nee, bedankt" sluit de pop-up', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/');
  await page.getByRole('button', { name: 'Nee, bedankt' }).click({ timeout: 5000 });
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeHidden();
});

test('validatie: e-mailadres en toestemming verplicht', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/');
  await page.getByRole('button', { name: 'Aanmelden' }).click({ timeout: 5000 });
  await expect(page.getByText('Vul je e-mailadres in.')).toBeVisible();
  await expect(page.getByText('Geef toestemming om je de nieuwsbrief te sturen.')).toBeVisible();
  await expect(page.getByLabel('E-mailadres')).toBeFocused();
});

test('succesvolle aanmelding (gemockte server)', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.route('/api/newsletter', (r) => r.fulfill({ status: 200, json: { status: 'subscribed' } }));
  await page.goto('/');
  await page.getByLabel('E-mailadres').fill('lezer@voorbeeld.nl', { timeout: 5000 });
  await page.getByLabel(/stuur mij de nieuwsbrief/).check();
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await expect(page.getByRole('heading', { name: /Je bent aangemeld/ })).toBeVisible();
});

test('echte API zonder bestemming: eerlijke foutmelding', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/');
  await page.getByLabel('E-mailadres').fill('lezer@voorbeeld.nl', { timeout: 5000 });
  await page.getByLabel(/stuur mij de nieuwsbrief/).check();
  await page.waitForTimeout(1300); // boven de antispamdrempel
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await expect(page.getByText(/Je bent níet aangemeld/)).toBeVisible();
});

test('niet op de juridische pagina’s', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/privacy');
  await page.waitForTimeout(3600);
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeHidden();
});

test('open pop-up is toegankelijk (axe)', async ({ page, context, baseURL }) => {
  await consentOnly(context, baseURL!);
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeVisible({ timeout: 5000 });
  const results = await new AxeBuilder({ page }).include('[data-testid="newsletter-popup"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
