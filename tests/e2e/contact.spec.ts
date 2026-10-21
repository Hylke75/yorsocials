import { expect, test, type Page } from '@playwright/test';
import { dismissConsent } from './helpers';

test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

async function fillValid(page: Page) {
  await page.getByRole('textbox', { name: 'Naam', exact: true }).fill('Test Persoon');
  await page.getByLabel('E-mailadres').fill('test@voorbeeld.nl');
  await page.getByLabel(/Waarmee kunnen we helpen/).selectOption('Content creatie');
  await page.getByLabel(/Vertel kort over je plannen/).fill('Wij willen graag meer video maken voor ons merk.');
  await page.getByLabel(/Ik ga akkoord/).check();
}

test('toont veldspecifieke fouten en een foutoverzicht bij leeg verzenden', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  const summary = page.getByRole('alert').filter({ hasText: 'Controleer' });
  await expect(summary).toBeFocused();
  await expect(page.getByText('Vul je naam in.').last()).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Naam', exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('E-mailadres')).toHaveAttribute('aria-describedby', 'email-error');
});

test('ongeldig e-mailadres wordt geblokkeerd', async ({ page }) => {
  await page.goto('/contact');
  await fillValid(page);
  await page.getByLabel('E-mailadres').fill('geen-email');
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.getByText(/Vul een geldig e-mailadres in/).first()).toBeVisible();
});

test('succes alleen na bevestiging door de server', async ({ page }) => {
  await page.route('/api/contact', (route) => route.fulfill({ status: 200, json: { status: 'sent', reference: 'test-ref-123' } }));
  await page.goto('/contact');
  await fillValid(page);
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.getByTestId('contact-success')).toContainText('je bericht is verzonden');
  await expect(page.getByText('Referentie: test-ref-123')).toBeVisible();
});

test('serverfout toont herstelactie en bewaart de invoer', async ({ page }) => {
  await page.route('/api/contact', (route) => route.fulfill({ status: 502, json: { status: 'error', code: 'delivery_failed', message: 'Je bericht kon niet worden verzonden. Probeer het opnieuw.' } }));
  await page.goto('/contact');
  await fillValid(page);
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Verzenden is niet gelukt' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Naam', exact: true })).toHaveValue('Test Persoon');
  await expect(page.getByRole('button', { name: 'Opnieuw proberen' })).toBeEnabled();
});

test('voorkomt dubbele inzending', async ({ page }) => {
  let calls = 0;
  await page.route('/api/contact', async (route) => {
    calls++;
    await new Promise((r) => setTimeout(r, 800));
    await route.fulfill({ status: 200, json: { status: 'sent', reference: 'x' } });
  });
  await page.goto('/contact');
  await fillValid(page);
  const submit = page.getByRole('button', { name: 'Verstuur bericht' });
  await submit.click();
  await expect(page.getByRole('button', { name: 'Bezig met verzenden…' })).toBeDisabled();
  await expect(page.getByTestId('contact-success')).toBeVisible();
  expect(calls).toBe(1);
});

test('echte API zonder gekoppelde bestemming geeft een eerlijke fout (geen nep-succes)', async ({ page }) => {
  test.skip(Boolean(process.env.E2E_BASE_URL), 'Tegen een live omgeving zou dit een echte lead aanmaken.');
  await page.goto('/contact');
  await fillValid(page);
  await page.waitForTimeout(2700); // invultijd boven de antispamdrempel
  await page.getByRole('button', { name: 'Verstuur bericht' }).click();
  await expect(page.getByText('Formulier nog niet gekoppeld')).toBeVisible();
  await expect(page.getByText(/níet verzonden/)).toBeVisible();
  await expect(page.getByTestId('contact-success')).toHaveCount(0);
});

test('API valideert server-side en weigert honeypot-spam', async ({ request }) => {
  const invalid = await request.post('/api/contact', { data: { name: '', email: 'x' } });
  expect(invalid.status()).toBe(422);
  expect((await invalid.json()).errors.name).toBeDefined();

  const spam = await request.post('/api/contact', {
    data: { name: 'Bot', email: 'bot@spam.nl', topic: 'Anders', message: 'Koop nu goedkope dingen!', privacy: true, website: 'http://spam', startedAt: 1 },
  });
  expect(spam.status()).toBe(400);
});
