import { describe, expect, it } from 'vitest';
import { articles } from '@/content/data/articles';
import { cases } from '@/content/data/cases';
import { media } from '@/content/data/media';
import { services } from '@/content/data/services';
import { faqs, legalPages, siteSettings, team } from '@/content/data/site';
import { getApprovedResults, getDisplayClientName } from '@/content/repository';

/** Bewaakt de contentintegriteitsregels uit de bouwopdracht. */
describe('contentintegriteit', () => {
  it('heeft unieke slugs', () => {
    for (const list of [services, cases, articles]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('gepubliceerde cases hebben klanttoestemming', () => {
    for (const c of cases.filter((c) => c.status === 'published')) expect(c.permissionGranted).toBe(true);
  });

  it('cases zonder toestemming tonen geen klantnaam', () => {
    for (const c of cases.filter((c) => !c.permissionGranted)) expect(getDisplayClientName(c)).toBeNull();
  });

  it('getoonde resultaten hebben altijd bron en meetperiode', () => {
    for (const c of cases) for (const r of getApprovedResults(c)) {
      expect(r.source.trim()).not.toBe('');
      expect(r.period.trim()).not.toBe('');
    }
  });

  it('gepubliceerde artikelen hebben auteur en datum', () => {
    for (const a of articles.filter((a) => a.status === 'published')) {
      expect(a.author).not.toBeNull();
      expect(a.publishedAt).not.toBeNull();
    }
  });

  it('teamleden worden alleen gepubliceerd met toestemming', () => {
    for (const m of team.filter((m) => m.status === 'published')) expect(m.consentConfirmed).toBe(true);
  });

  it('juridische pagina’s blijven concept zolang ze niet beoordeeld zijn', () => {
    for (const p of legalPages) if (p.lastReviewed === null) expect(p.status).not.toBe('published');
  });

  it('alle media hebben alt-tekst, afmetingen en bron', () => {
    for (const m of Object.values(media)) {
      expect(m.alt.length).toBeGreaterThan(5);
      expect(m.width).toBeGreaterThan(0);
      expect(m.height).toBeGreaterThan(0);
      expect(m.source).not.toBe('');
    }
  });

  it('bevat geen verzonnen contactgegevens', () => {
    expect(siteSettings.email).toBeNull();
    expect(siteSettings.phone).toBeNull();
    expect(siteSettings.bookingUrl).toBeNull();
    expect(siteSettings.socialLinks.every((s) => s.verified)).toBe(true);
  });

  it('bevat geen cijfermatige claims in teksten (procenten/aantallen volgers)', () => {
    // Alleen redactionele tekst; mediametadata (zoals focal points "50% 50%") niet.
    const text = JSON.stringify(
      [services, faqs, articles, cases],
      (key, value) => (['heroImage', 'image', 'gallery', 'portrait', 'focalPoint'].includes(key) ? undefined : value),
    );
    expect(text).not.toMatch(/\+\d+\s?%|\d+\s?%|\d+[kKmM]\+?\s(volgers|views)/);
  });
});
