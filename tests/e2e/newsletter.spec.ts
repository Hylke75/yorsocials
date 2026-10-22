import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('pop-up verschijnt na ~3 seconden, niet eerder', async ({ page }) => {
  await page.goto('/');
  const popup = page.getByRole('dialog', { name: /Blijf op de hoogte/ });
  await page.waitForTimeout(2000);
  await expect(popup).toBeHidden();
  await expect(popup).toBeVisible({ timeout: 3000 });
  await expect(page.getByLabel('E-mailadres')).toBeVisible();
});

test('er is geen cookiemelding; de pop-up verschijnt direct na 3 seconden', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('consent-banner')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeVisible({ timeout: 4500 });
});

test('sluiten met Escape onthoudt de keuze', async ({ page }) => {
  await page.goto('/diensten');
  const popup = page.getByRole('dialog', { name: /Blijf op de hoogte/ });
  await expect(popup).toBeVisible({ timeout: 5000 });
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await page.reload();
  await page.waitForTimeout(3600);
  await expect(popup).toBeHidden();
});

test('"Nee, bedankt" sluit de pop-up', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Nee, bedankt' }).click({ timeout: 5000 });
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeHidden();
});

test('validatie: e-mailadres en toestemming verplicht', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Aanmelden' }).click({ timeout: 5000 });
  await expect(page.getByText('Vul je e-mailadres in.')).toBeVisible();
  await expect(page.getByText('Geef toestemming om je de nieuwsbrief te sturen.')).toBeVisible();
  await expect(page.getByLabel('E-mailadres')).toBeFocused();
});

const MAILENTO = 'https://gfnxbkketubsevavlegj.supabase.co/functions/v1/aanmelden';

test('succesvolle aanmelding stuurt het juiste bericht naar Mailento', async ({ page }) => {
  let sent: Record<string, unknown> | null = null;
  await page.route(MAILENTO, async (r) => {
    sent = r.request().postDataJSON();
    await r.fulfill({ status: 200, json: { status: 'ok', tekst: 'Bevestigingsmail verstuurd' } });
  });
  await page.goto('/?utm_source=instagram&utm_campaign=najaar');
  await page.getByLabel('E-mailadres').fill('Lezer@Voorbeeld.nl', { timeout: 5000 });
  await page.getByLabel(/Voornaam/).fill('Sam');
  await page.getByLabel(/stuur mij de nieuwsbrief/).check();
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await expect(page.getByRole('heading', { name: /Bijna klaar/ })).toBeVisible();
  await expect(page.getByText(/Bevestig je inschrijving via de mail/)).toBeVisible();
  expect(sent).toMatchObject({
    actie: 'aanmelden',
    slug: 'yorsocials-nieuwsbrief',
    email: 'lezer@voorbeeld.nl',
    voornaam: 'Sam',
    website: '',
    utm: { utm_source: 'instagram', utm_campaign: 'najaar' },
  });
  expect((sent as unknown as { duur_ms: number }).duur_ms).toBeGreaterThan(2500);
});

test('"ongeldig" van Mailento toont de foutmelding bij het e-mailveld', async ({ page }) => {
  await page.route(MAILENTO, (r) => r.fulfill({ status: 200, json: { status: 'ongeldig', fout: 'Dit e-mailadres bestaat niet.' } }));
  await page.goto('/');
  await page.getByLabel('E-mailadres').fill('lezer@voorbeeld.nl', { timeout: 5000 });
  await page.getByLabel(/stuur mij de nieuwsbrief/).check();
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await expect(page.getByText('Dit e-mailadres bestaat niet.')).toBeVisible();
  await expect(page.getByLabel('E-mailadres')).toHaveAttribute('aria-invalid', 'true');
});

test('"te_vaak" (429) toont een eerlijke melding', async ({ page }) => {
  await page.route(MAILENTO, (r) => r.fulfill({ status: 429, json: { status: 'te_vaak' } }));
  await page.goto('/');
  await page.getByLabel('E-mailadres').fill('lezer@voorbeeld.nl', { timeout: 5000 });
  await page.getByLabel(/stuur mij de nieuwsbrief/).check();
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await expect(page.getByText(/Te veel pogingen. Je bent níet aangemeld/)).toBeVisible();
});

test('niet op de juridische pagina’s', async ({ page }) => {
  await page.goto('/juridisch/privacy');
  await page.waitForTimeout(3600);
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeHidden();
});

test('open pop-up is toegankelijk (axe)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /Blijf op de hoogte/ })).toBeVisible({ timeout: 5000 });
  const results = await new AxeBuilder({ page }).include('[data-testid="newsletter-popup"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
