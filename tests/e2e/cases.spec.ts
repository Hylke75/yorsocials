import { expect, test } from '@playwright/test';
import { dismissConsent } from './helpers';

test.beforeEach(async ({ context, baseURL }) => dismissConsent(context, baseURL!));

test('sectorfilter werkt het raster bij en zet de keuze in de URL', async ({ page }) => {
  await page.goto('/cases');
  await expect(page.getByTestId('case-count')).toHaveText('4 cases');
  await page.getByRole('button', { name: 'Horeca' }).click();
  await expect(page).toHaveURL('/cases?sector=horeca');
  await expect(page.getByRole('button', { name: 'Horeca' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('case-count')).toHaveText('1 case in Horeca');
  await expect(page.getByTestId('case-grid').getByRole('article')).toHaveCount(1);
});

test('lege toestand bij een sector zonder cases', async ({ page }) => {
  await page.goto('/cases');
  await page.getByRole('button', { name: 'Personal brand' }).click();
  await expect(page.getByText('Nog geen cases in Personal brand')).toBeVisible();
});

test('filter uit de URL wordt direct toegepast en terugnavigatie werkt', async ({ page }) => {
  await page.goto('/cases?sector=fitness');
  await expect(page.getByTestId('case-count')).toHaveText('1 case in Fitness');
  await page.getByRole('button', { name: 'Alle cases' }).click();
  await expect(page).toHaveURL('/cases');
  await expect(page.getByTestId('case-count')).toHaveText('4 cases');
});

test('casekaart opent de case-detailpagina met demomarkering', async ({ page }) => {
  await page.goto('/cases?sector=horeca');
  await page.getByRole('link', { name: 'Van lokaal zichtbaar naar geliefd' }).click();
  await expect(page).toHaveURL('/cases/voorbeeld-horeca-lokaal-zichtbaar');
  await expect(page.getByText('Demonstratiecase — geen echte klantopdracht')).toBeVisible();
  await expect(page.getByText(/geen geverifieerde resultaten/)).toBeVisible();
});
