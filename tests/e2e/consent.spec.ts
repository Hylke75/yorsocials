import { expect, test } from '@playwright/test';
import { analyticsLog } from './helpers';

// Nieuwsbrief-pop-up onderdrukken; die heeft een eigen spec.
test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([{ name: 'ys_newsletter', value: 'dismissed', url: baseURL! }]);
});

test('banner verschijnt en er worden geen events verstuurd vóór toestemming', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('consent-banner')).toBeVisible();
  await page.getByRole('link', { name: 'Bekijk alle 6 diensten' }).click();
  await expect(page).toHaveURL('/services');
  expect(await analyticsLog(page)).toEqual([]);
  expect(await page.evaluate(() => typeof window.gtag)).toBe('undefined');
});

test('weigeren: geen events, keuze blijft bewaard na herladen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Alleen noodzakelijk' }).click();
  await expect(page.getByTestId('consent-banner')).toBeHidden();
  await page.reload();
  await expect(page.getByTestId('consent-banner')).toBeHidden();
  await page.getByRole('link', { name: 'Bekijk alle 6 diensten' }).click();
  expect(await analyticsLog(page)).toEqual([]);
});

test('accepteren: page_view en cta_click zonder persoonsgegevens', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Alles accepteren' }).click();
  await page.getByRole('link', { name: 'Bekijk alle 6 diensten' }).click();
  await expect(page).toHaveURL('/services');
  await expect.poll(async () => (await analyticsLog(page)).map((e) => e.event)).toEqual(expect.arrayContaining(['page_view', 'cta_click']));
  const click = (await analyticsLog(page)).find((e) => e.event === 'cta_click');
  expect(click?.params).toEqual({ destination: '/services', placement: 'home-services' });
});

test('voorkeuren zijn te wijzigen en in te trekken via /cookies', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Alles accepteren' }).click();
  await page.goto('/cookies');
  const form = page.getByRole('form', { name: 'Cookievoorkeuren' });
  await expect(form.getByLabel('Analytisch')).toBeChecked();
  await form.getByLabel('Analytisch').uncheck();
  await form.getByRole('button', { name: 'Voorkeuren opslaan' }).click();
  await expect(form.getByText('Je voorkeuren zijn opgeslagen.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('form', { name: 'Cookievoorkeuren' }).getByLabel('Analytisch')).not.toBeChecked();
});

test('instellingen-dialoog is via de footer opnieuw te openen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Alleen noodzakelijk' }).click();
  await page.getByRole('button', { name: 'Cookie-instellingen' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cookievoorkeuren' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
