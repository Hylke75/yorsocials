import { describe, expect, it } from 'vitest';
import {
  buildSignupPayload,
  interpretSignupResponse,
  normalizeNewsletterInput,
  parseUtm,
  shouldShowNewsletter,
  validateNewsletter,
} from '@/lib/newsletter';

describe('nieuwsbrief', () => {
  it('valideert e-mail en toestemming', () => {
    expect(validateNewsletter(normalizeNewsletterInput({}))).toEqual({
      email: 'Vul je e-mailadres in.',
      consent: 'Geef toestemming om je de nieuwsbrief te sturen.',
    });
    expect(validateNewsletter(normalizeNewsletterInput({ email: 'fout', consent: true })).email).toMatch(/geldig/);
    expect(validateNewsletter(normalizeNewsletterInput({ email: ' Lezer@Voorbeeld.NL ', consent: true }))).toEqual({});
  });

  it('toont de pop-up niet na sluiten of op uitgesloten pagina’s', () => {
    expect(shouldShowNewsletter('/', '')).toBe(true);
    expect(shouldShowNewsletter('/', 'a=1; ys_newsletter=dismissed')).toBe(false);
    expect(shouldShowNewsletter('/privacy', '')).toBe(false);
    expect(shouldShowNewsletter('/cookies', '')).toBe(false);
  });

  it('haalt alleen utm-parameters uit de URL', () => {
    expect(parseUtm('?utm_source=instagram&foo=bar&utm_medium=social')).toEqual({ utm_source: 'instagram', utm_medium: 'social' });
    expect(parseUtm('')).toEqual({});
  });

  it('bouwt het Mailento-bericht volgens de specificatie', () => {
    const input = normalizeNewsletterInput({ email: 'Lezer@Voorbeeld.nl', firstName: ' Sam ', consent: true });
    expect(buildSignupPayload(input, { slug: 'yorsocials-nieuwsbrief', honeypot: '', durationMs: 4321.7, utm: { utm_source: 'ig' } })).toEqual({
      actie: 'aanmelden',
      slug: 'yorsocials-nieuwsbrief',
      email: 'lezer@voorbeeld.nl',
      voornaam: 'Sam',
      website: '',
      duur_ms: 4322,
      utm: { utm_source: 'ig' },
    });
    // Lege optionele velden worden weggelaten.
    const bare = buildSignupPayload(normalizeNewsletterInput({ email: 'a@b.nl', consent: true }), { slug: 's', honeypot: '', durationMs: 3000 });
    expect(bare).not.toHaveProperty('voornaam');
    expect(bare).not.toHaveProperty('utm');
  });

  it('interpreteert de antwoorden van Mailento', () => {
    expect(interpretSignupResponse(200, { status: 'ok' })).toEqual({ kind: 'success' });
    expect(interpretSignupResponse(200, { status: 'ongeldig', fout: 'Ongeldig adres' })).toEqual({ kind: 'invalid', message: 'Ongeldig adres' });
    expect(interpretSignupResponse(429, { status: 'te_vaak' })).toEqual({ kind: 'rate_limited' });
    expect(interpretSignupResponse(500, null)).toEqual({ kind: 'error' });
  });
});
