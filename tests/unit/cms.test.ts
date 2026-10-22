import { describe, expect, it } from 'vitest';
import { backgroundClass, isRenderable } from '@/cms/blocks/registry';
import { normalizeSlug, parseCmsContent } from '@/cms/parse';
import { verifySignature } from '@/lib/webhook';
import { createHmac } from 'node:crypto';

describe('CMS-parser', () => {
  it('leest de huidige (lege) respons', () => {
    const c = parseCmsContent({
      ok: true,
      site: { naam: 'YorSocials', domein: 'www.yorsocials.nl', design_tokens: {}, config: { merk: {} }, locale: 'nl' },
      paginas: [],
      popups: [],
    });
    expect(c?.site.naam).toBe('YorSocials');
    expect(c?.site.navigatie).toBeNull();
    expect(c?.site.merk).toBeNull();
    expect(c?.site.redirects).toEqual([]);
    expect(c?.paginas).toEqual([]);
    expect(c?.records).toEqual({});
  });

  it('leest het definitieve contract en valt niet om over kapotte velden', () => {
    const c = parseCmsContent({
      ok: true,
      site: {
        naam: 'YorSocials',
        merk: { naam: 'YorSocials', logo: 'https://x/logo.png', socials: { instagram: 'https://instagram.com/yor', fout: 3 }, contact: { email: 'hallo@yor.nl' } },
        navigatie: { hoofd: [{ titel: 'Home', href: '/' }, { titel: '' }, 'kapot'], footer: [], juridisch: [], actie: { titel: 'Plan', href: '/contact' } },
        redirects: [{ van: '/diensten/', naar: '/diensten', status: 301 }, { van: '', naar: '/x' }],
      },
      paginas: [
        { slug: 'diensten/paid-social/', titel: 'Paid social', blokken: [{ type: 'header', bg: 'mist', content: { kop: 'Hoi' } }, { geen: 'type' }] },
        { titel: 'zonder slug' },
      ],
      records: { cases: [{ titel: 'A' }, 'kapot'] },
    });
    expect(c?.site.navigatie?.hoofd).toEqual([{ titel: 'Home', href: '/', subs: [] }]);
    expect(c?.site.navigatie?.actie).toEqual({ titel: 'Plan', href: '/contact' });
    expect(c?.site.merk?.socials).toEqual({ instagram: 'https://instagram.com/yor' });
    expect(c?.site.redirects).toEqual([{ van: '/diensten', naar: '/diensten', status: 301 }]);
    expect(c?.paginas).toHaveLength(1);
    expect(c?.paginas[0]?.slug).toBe('/diensten/paid-social');
    expect(c?.paginas[0]?.blokken).toEqual([{ type: 'header', bg: 'mist', content: { kop: 'Hoi' } }]);
    expect(c?.records.cases).toEqual([{ titel: 'A' }]);
  });

  it('weigert een respons zonder ok', () => {
    expect(parseCmsContent({ ok: false })).toBeNull();
    expect(parseCmsContent('html')).toBeNull();
  });

  it('normaliseert slugs', () => {
    expect(normalizeSlug('')).toBe('/');
    expect(normalizeSlug('/Diensten/Paid-Social/')).toBe('/diensten/paid-social');
  });

  it('slaat onbekende bloktypes over en vertaalt achtergronden', () => {
    expect(isRenderable({ type: 'bestaat-niet', bg: null, content: {} })).toBe(false);
    expect(backgroundClass('mist')).toBe('section--soft');
    expect(backgroundClass(null)).toBe('');
  });
});

describe('webhook-handtekening', () => {
  const secret = 'geheim';
  const body = JSON.stringify({ gebeurtenis: 'gepubliceerd', tijdstip: '2026-10-21T10:00:00Z', data: {} });
  const sig = createHmac('sha256', secret).update(body).digest('hex');

  it('accepteert een geldige handtekening (met of zonder sha256=)', () => {
    expect(verifySignature(body, sig, secret)).toBe(true);
    expect(verifySignature(body, `sha256=${sig}`, secret)).toBe(true);
  });

  it('weigert ontbrekende, foute of aangepaste handtekeningen', () => {
    expect(verifySignature(body, null, secret)).toBe(false);
    expect(verifySignature(body, 'abc', secret)).toBe(false);
    expect(verifySignature(`${body} `, sig, secret)).toBe(false);
  });

  it('leest het merk ook uit config.merk (huidige CMS-versie)', () => {
    const c = parseCmsContent({ ok: true, site: { naam: 'YorSocials', config: { merk: { tagline: 'Uit config' } } }, paginas: [] });
    expect(c?.site.merk?.tagline).toBe('Uit config');
  });
});
