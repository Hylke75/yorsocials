import { expect, test } from '@playwright/test';
import { dismissConsent } from './helpers';

test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

test('hoofdnavigatie leidt naar elke pagina en markeert de actieve pagina', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Hoofdnavigatie' });
  for (const [label, url] of [
    ['Services', '/diensten'],
    ['Cases', '/cases'],
    ['Over ons', '/over-ons'],
    ['Artikelen', '/artikelen'],
    ['Contact', '/contact'],
    ['Home', '/'],
  ] as const) {
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page');
  }
});

test('conversieroute: home → dienst → kennismaking → formulier', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Social strategie' }).first().click();
  await expect(page).toHaveURL('/diensten/social-strategie');
  await expect(page.getByRole('navigation', { name: 'Kruimelpad' })).toContainText('Services');
  await page.getByRole('link', { name: 'Stel een vraag' }).click();
  await expect(page).toHaveURL(/\/contact\?onderwerp=Social(%20|\+)strategie#formulier/);
  await expect(page.getByLabel(/Waarmee kunnen we helpen/)).toHaveValue('Social strategie');
});

test('skiplink is met het toetsenbord bereikbaar en springt naar de inhoud', async ({ page }) => {
  await page.goto('/diensten');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Direct naar inhoud' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#inhoud$/);
});

test('focus is zichtbaar op interactieve elementen', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const shadow = await page.evaluate(() => getComputedStyle(document.activeElement!).boxShadow);
  expect(shadow).not.toBe('none');
});

test('FAQ-accordeon werkt met toetsenbord en aria-expanded', async ({ page }) => {
  await page.goto('/faq');
  const btn = page.getByRole('button', { name: 'Kan ik één dienst afnemen?' });
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await btn.focus();
  await page.keyboard.press('Enter');
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('region', { name: 'Kan ik één dienst afnemen?' })).toBeVisible();
  await page.keyboard.press('Space');
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
});
