import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '@/lib/rateLimit';

describe('rate limiter', () => {
  it('staat het limiet toe en blokkeert daarna binnen het venster', () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check('ip', 0).allowed).toBe(true);
    expect(check('ip', 10).allowed).toBe(true);
    const blocked = check('ip', 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(check('ander-ip', 20).allowed).toBe(true);
  });

  it('laat weer toe na het venster', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 });
    check('ip', 0);
    expect(check('ip', 1001).allowed).toBe(true);
  });
});
