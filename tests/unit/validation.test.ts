import { describe, expect, it } from 'vitest';
import { escapeHtml, hasErrors, isLikelySpam, MIN_FILL_TIME_MS, normalizeContactInput, validateContact } from '@/lib/validation';

const valid = { name: 'Sam de Vries', email: 'Sam@Voorbeeld.nl', company: '', topic: 'Paid social', message: 'We willen graag starten met advertenties.', privacy: true };

describe('normalizeContactInput', () => {
  it('trimt, lowercaset e-mail en verwijdert control/zero-width tekens', () => {
    const n = normalizeContactInput({ ...valid, name: '  Sam​  ', email: ' SAM@Voorbeeld.NL ' });
    expect(n.name).toBe('Sam');
    expect(n.email).toBe('sam@voorbeeld.nl');
  });

  it('vervangt regeleinden in enkelregelige velden (header-injectie)', () => {
    expect(normalizeContactInput({ ...valid, name: 'a\r\nBcc: x@y.nl' }).name).toBe('a Bcc: x@y.nl');
  });

  it('behoudt regeleinden in het bericht', () => {
    expect(normalizeContactInput({ ...valid, message: 'regel 1\nregel 2' }).message).toBe('regel 1\nregel 2');
  });

  it('behandelt niet-string waarden als leeg', () => {
    const n = normalizeContactInput({ name: 42, email: null, privacy: 'nee' });
    expect(n.name).toBe('');
    expect(n.email).toBe('');
    expect(n.privacy).toBe(false);
  });
});

describe('validateContact', () => {
  it('accepteert een geldige aanvraag', () => {
    expect(hasErrors(validateContact(normalizeContactInput(valid)))).toBe(false);
  });

  it('meldt alle verplichte velden', () => {
    const errors = validateContact(normalizeContactInput({}));
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'privacy', 'topic']);
  });

  it.each(['geen-apenstaart', 'a@b', 'a b@c.nl', 'a@b.c'])('wijst ongeldig e-mailadres "%s" af', (email) => {
    expect(validateContact(normalizeContactInput({ ...valid, email })).email).toBeDefined();
  });

  it('wijst onbekende onderwerpen af', () => {
    expect(validateContact(normalizeContactInput({ ...valid, topic: '<script>' })).topic).toBe('Kies een onderwerp uit de lijst.');
  });

  it('bewaakt minimale en maximale berichtlengte', () => {
    expect(validateContact(normalizeContactInput({ ...valid, message: 'kort' })).message).toMatch(/minimaal/);
    expect(validateContact(normalizeContactInput({ ...valid, message: 'x'.repeat(4001) })).message).toMatch(/maximaal/);
  });

  it('vereist privacytoestemming', () => {
    expect(validateContact(normalizeContactInput({ ...valid, privacy: false })).privacy).toBeDefined();
  });
});

describe('isLikelySpam', () => {
  const now = 1_000_000;
  it('blokkeert een gevulde honeypot', () => {
    expect(isLikelySpam({ website: 'http://spam', startedAt: now - 60_000 }, now)).toBe(true);
  });
  it('blokkeert te snel verzonden formulieren en ontbrekende starttijd', () => {
    expect(isLikelySpam({ startedAt: now - (MIN_FILL_TIME_MS - 1) }, now)).toBe(true);
    expect(isLikelySpam({}, now)).toBe(true);
  });
  it('laat normale inzendingen door', () => {
    expect(isLikelySpam({ website: '', startedAt: now - 30_000 }, now)).toBe(false);
  });
});

describe('escapeHtml', () => {
  it('escapet HTML-gevoelige tekens', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe('&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;');
  });
});
