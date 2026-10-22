import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSiteUrl } from '@/lib/env';

describe('getSiteUrl', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('gebruikt NEXT_PUBLIC_SITE_URL als die is ingesteld', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.yorsocials.nl/');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'yorsocials.vercel.app');
    expect(getSiteUrl()).toBe('https://www.yorsocials.nl');
  });

  it('valt terug op het Vercel-productiedomein', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'yorsocials.vercel.app');
    expect(getSiteUrl()).toBe('https://yorsocials.vercel.app');
  });

  it('valt lokaal terug op localhost', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    expect(getSiteUrl()).toBe('http://localhost:3000');
  });
});
