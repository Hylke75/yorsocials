import { test } from '@playwright/test';
import { dismissConsent } from './helpers';

const PAGES = ['/', '/diensten', '/diensten/video-reels', '/cases', '/over-ons', '/contact'];
const WIDTHS = [375, 768, 1440];

// Genereert docs/screenshots/*.jpg voor visuele vergelijking met design/referenties.
for (const width of WIDTHS) {
  for (const path of PAGES) {
    test(`screenshot ${width}px ${path}`, async ({ page, context, baseURL }) => {
      await dismissConsent(context, baseURL!);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path, { waitUntil: 'networkidle' });
      const name = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-');
      await page.screenshot({ path: `docs/screenshots/${width}-${name}.jpg`, fullPage: true, type: 'jpeg', quality: 70 });
    });
  }
}
