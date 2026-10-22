import { expect, test } from '@playwright/test';
import { ALL_ROUTES, dismissConsent } from './helpers';

test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

for (const route of ALL_ROUTES) {
  test(`route ${route} laadt met één H1, titel en description`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/YorSocials/);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(route === '/' ? '' : route);
    // Geen horizontale scroll
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('onbekende URL geeft 404 met teruglinks', async ({ page }) => {
  const res = await page.goto('/deze-pagina-bestaat-niet');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('404');
  await page.getByRole('link', { name: 'Terug naar home' }).click();
  await expect(page).toHaveURL('/');
});

test('onbekende dienst geeft 404', async ({ page }) => {
  expect((await page.goto('/diensten/bestaat-niet'))?.status()).toBe(404);
});

test('alle interne links op de homepage werken', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.$$eval('a[href^="/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')!.split('#')[0]!))]);
  for (const href of hrefs) {
    const res = await request.get(href || '/');
    expect(res.status(), href).toBe(200);
  }
});

test('sitemap, robots en OG-afbeelding zijn bereikbaar', async ({ request }) => {
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect(await (await request.get('/robots.txt')).text()).toContain('User-Agent');
  const og = await request.get('/opengraph-image');
  expect(og.headers()['content-type']).toContain('image/png');
});

test('beveiligingsheaders worden meegestuurd', async ({ request }) => {
  const headers = (await request.get('/')).headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['strict-transport-security']).toBeTruthy();
  expect(headers['x-content-type-options']).toBe('nosniff');
});

test('revalidate-webhook staat uit zonder geheim en weigert ongetekende verzoeken', async ({ request }) => {
  const res = await request.post('/api/revalidate', { data: { gebeurtenis: 'gepubliceerd' } });
  expect([401, 503]).toContain(res.status());
});

test('er wordt geen cookiemelding getoond', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');
  await expect(page.getByText('Cookies op deze website')).toHaveCount(0);
});
