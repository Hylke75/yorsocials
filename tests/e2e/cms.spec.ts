import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { dismissConsent } from './helpers';

/**
 * CMS-modus: draait alleen via `npm run test:e2e:cms` (playwright.cms.config.ts), waarbij de site
 * tegen scripts/mock-cms.ts is gebouwd. Alle content hieronder komt uit de CMS-respons.
 */
const CMS_PAGES = ['/', '/diensten', '/diensten/social-strategie', '/diensten/paid-social', '/cases', '/over-ons', '/artikelen', '/contact', '/faq', '/juridisch/privacy', '/juridisch/cookies'];

test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

for (const route of CMS_PAGES) {
  test(`CMS-pagina ${route} rendert met één H1, zonder fouten en zonder WCAG-overtredingen`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('navigatie, footer en merkgegevens komen uit het CMS', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Hoofdnavigatie' }).getByRole('link', { name: 'Diensten', exact: true })).toBeVisible();
  const footer = page.locator('footer');
  await expect(footer).toContainText('MOCK-tagline uit het CMS');
  await expect(footer.getByRole('navigation', { name: 'MOCK-kolom' })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'test@voorbeeld.nl' })).toBeVisible();
  await expect(footer).toContainText('1234 AB Teststad');
});

test('kruimelpad toont de bovenliggende CMS-pagina', async ({ page }) => {
  await page.goto('/diensten/social-strategie');
  const crumbs = page.getByRole('navigation', { name: 'Kruimelpad' });
  await expect(crumbs.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/diensten');
});

test('records: cases, team en artikelen uit het CMS', async ({ page }) => {
  await page.goto('/cases');
  await expect(page.getByText('MOCK Klant')).toBeVisible();
  await page.getByRole('button', { name: 'Retail' }).click();
  await expect(page.getByText('MOCK Winkel')).toBeVisible();
  await expect(page.getByText('MOCK Klant')).toBeHidden();

  await page.goto('/over-ons');
  await expect(page.getByText('MOCK Teamlid')).toBeVisible();

  await page.goto('/artikelen');
  await page.getByRole('link', { name: /MOCK: testartikel/ }).first().click();
  await expect(page).toHaveURL('/artikelen/test-artikel');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('MOCK: testartikel uit het CMS');
  await expect(page.locator('strong', { hasText: 'vet' })).toBeVisible();
});

test('redirects uit het CMS worden toegepast', async ({ page }) => {
  await page.goto('/oud');
  await expect(page).toHaveURL('/diensten');
});

test('formulierbouwer: veldfouten, foutoverzicht en voorinvullen vanuit een dienst', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  const summary = page.getByRole('alert').filter({ hasText: 'Controleer' });
  await expect(summary).toBeFocused();
  await expect(page.getByLabel(/^Naam/)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel(/^E-mailadres/)).toHaveAttribute('aria-describedby', 'fb-email-error');

  await page.goto('/contact?onderwerp=Paid%20social#formulier');
  await expect(page.getByLabel(/Waarmee kunnen we helpen/)).toHaveValue('Paid social');
});

test('formulierbouwer: succes alleen na bevestiging, fout bewaart invoer', async ({ page }) => {
  let body: Record<string, unknown> = {};
  await page.route('/api/lead', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 502, json: { ok: false, melding: 'Tijdelijk niet bereikbaar.' } });
  });
  await page.goto('/contact');
  await page.getByLabel(/^Naam/).fill('Test Persoon');
  await page.getByLabel(/^E-mailadres/).fill('test@voorbeeld.nl');
  await page.getByLabel(/Waarmee kunnen we helpen/).selectOption({ index: 1 });
  await page.getByLabel(/Vertel kort over je plannen/).fill('Graag meer video voor ons merk.');
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.getByText('Tijdelijk niet bereikbaar.')).toBeVisible();
  await expect(page.getByLabel(/^Naam/)).toHaveValue('Test Persoon');
  expect(body).toMatchObject({ naam: 'Test Persoon', email: 'test@voorbeeld.nl', bron_pagina: '/contact', _website: '' });

  await page.unroute('/api/lead');
  await page.route('/api/lead', (route) => route.fulfill({ status: 200, json: { ok: true } }));
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.getByRole('status')).toBeVisible();
});

test.describe('pop-ups uit het CMS', () => {
  test.beforeEach(async ({ context }) => context.clearCookies());

  test('nieuwsbrief-pop-up gebruikt tekst en trigger uit het CMS', async ({ page }) => {
    await page.goto('/over-ons');
    const popup = page.getByRole('dialog', { name: /MOCK: nieuwsbrief uit het CMS/ });
    await expect(popup).toBeVisible({ timeout: 4000 });
    await expect(popup.getByRole('button', { name: 'Inschrijven' })).toBeVisible();
  });

  test('pagina-scope en knop-pop-up (slide-in) uit het CMS', async ({ page }) => {
    await page.goto('/faq');
    const popup = page.getByRole('dialog', { name: /MOCK: vraag niet beantwoord/ });
    await expect(popup).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('dialog', { name: /MOCK: nieuwsbrief/ })).toBeHidden();
    await popup.getByRole('link', { name: 'Naar contact' }).click();
    await expect(page).toHaveURL('/contact');
    await page.goto('/faq');
    await page.waitForTimeout(2000);
    await expect(page.getByRole('dialog', { name: /MOCK: vraag niet beantwoord/ })).toBeHidden();
  });
});
