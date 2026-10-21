import { describe, expect, it } from 'vitest';
import { normalizeNewsletterInput, shouldShowNewsletter, validateNewsletter } from '@/lib/newsletter';

describe('nieuwsbrief', () => {
  it('valideert e-mail en toestemming', () => {
    expect(validateNewsletter(normalizeNewsletterInput({}))).toEqual({
      email: 'Vul je e-mailadres in.',
      consent: 'Geef toestemming om je de nieuwsbrief te sturen.',
    });
    expect(validateNewsletter(normalizeNewsletterInput({ email: 'fout', consent: true })).email).toMatch(/geldig/);
    expect(validateNewsletter(normalizeNewsletterInput({ email: ' Lezer@Voorbeeld.NL ', consent: true }))).toEqual({});
  });

  it('normaliseert het e-mailadres', () => {
    expect(normalizeNewsletterInput({ email: ' Lezer@Voorbeeld.NL ' }).email).toBe('lezer@voorbeeld.nl');
  });

  it('toont de pop-up niet na sluiten of op uitgesloten pagina’s', () => {
    expect(shouldShowNewsletter('/', '')).toBe(true);
    expect(shouldShowNewsletter('/', 'a=1; ys_newsletter=dismissed')).toBe(false);
    expect(shouldShowNewsletter('/privacy', '')).toBe(false);
    expect(shouldShowNewsletter('/cookies', '')).toBe(false);
  });
});
