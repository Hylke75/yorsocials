import { afterEach, describe, expect, it, vi } from 'vitest';
import { sanitizeParams, track } from '@/lib/analytics';
import { CONSENT_VERSION, createConsent, parseConsent, readConsentCookie, serializeConsent } from '@/lib/consent';

describe('consent', () => {
  it('rondt serialiseren/parsen correct af', () => {
    const c = createConsent({ analytics: true, marketing: false }, new Date('2026-10-21T10:00:00Z'));
    expect(parseConsent(serializeConsent(c))).toEqual(c);
  });

  it('behandelt een verouderde versie als "onbekend"', () => {
    const old = { ...createConsent({ analytics: true, marketing: false }), version: 'oud' };
    expect(parseConsent(serializeConsent(old))).toBeNull();
    expect(CONSENT_VERSION).not.toBe('oud');
  });

  it('behandelt rommel als "onbekend"', () => {
    expect(parseConsent('%%%')).toBeNull();
    expect(parseConsent(undefined)).toBeNull();
  });

  it('leest de cookie uit een cookie-string', () => {
    const c = createConsent({ analytics: false, marketing: false });
    expect(readConsentCookie(`foo=1; ys_consent=${serializeConsent(c)}; bar=2`)?.analytics).toBe(false);
  });
});

describe('analytics', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('verwijdert onbekende sleutels en persoonsgegevens', () => {
    expect(sanitizeParams({ placement: 'hero', destination: 'sam@voorbeeld.nl', ...({ name: 'Sam' } as object) })).toEqual({ placement: 'hero' });
  });

  it('verstuurt niets zonder toestemming', () => {
    const win: Record<string, unknown> = { __ysAnalyticsConsent: false };
    vi.stubGlobal('window', win);
    track('cta_click', { placement: 'hero' });
    expect(win.__ysAnalyticsLog).toBeUndefined();
  });

  it('verstuurt wel met toestemming', () => {
    const win: Record<string, unknown> = { __ysAnalyticsConsent: true };
    vi.stubGlobal('window', win);
    track('cta_click', { placement: 'hero' });
    expect(win.__ysAnalyticsLog).toEqual([{ event: 'cta_click', params: { placement: 'hero' } }]);
  });
});
