import { defineConfig, devices } from '@playwright/test';

/**
 * E2E in CMS-modus: de site wordt gebouwd en gestart tegen een nep-CMS (scripts/mock-cms.ts) en
 * moet dan volledig uit de CMS-respons renderen. Draai met `npm run test:e2e:cms`.
 * Let op: dit overschrijft de lokale build in .next.
 */
const PORT = 3300;
const cmsEnv = { CMS_URL: 'http://localhost:4010', CMS_TOKEN: 'mock', CMS_LEADS_DISABLED: '1' };

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /cms\.spec\.ts/,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'cms', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
  webServer: [
    { command: 'npx tsx scripts/mock-cms.ts', url: 'http://localhost:4010/api/cms/content', reuseExistingServer: true, timeout: 30_000 },
    {
      command: `rm -rf .next && npx next build && npx next start -p ${PORT}`,
      env: cmsEnv,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: false,
      timeout: 600_000,
    },
  ],
});
