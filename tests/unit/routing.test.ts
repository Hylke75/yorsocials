import { describe, expect, it } from 'vitest';
import { getArticle, getCase, getOtherServices, getService, getServices } from '@/content/repository';
import { getAllRoutes, isActivePath, STATIC_ROUTES } from '@/lib/routes';

const REQUIRED_SERVICE_SLUGS = [
  'social-strategie',
  'content-creatie',
  'video-reels',
  'paid-social',
  'community-management',
  'analyse-optimalisatie',
];

describe('routes', () => {
  it('bevat alle verplichte statische routes uit het functioneel ontwerp', () => {
    expect(STATIC_ROUTES).toEqual(expect.arrayContaining(['/', '/diensten', '/cases', '/over-ons', '/artikelen', '/contact', '/faq', '/juridisch/privacy', '/juridisch/cookies']));
  });

  it('heeft precies de zes gevraagde dienstdetailpagina’s', () => {
    expect(getServices().map((s) => s.slug)).toEqual(REQUIRED_SERVICE_SLUGS);
    for (const slug of REQUIRED_SERVICE_SLUGS) expect(getAllRoutes('production')).toContain(`/diensten/${slug}`);
  });

  it('toont demo-cases en -artikelen alleen in staging', () => {
    const staging = getAllRoutes('staging');
    const production = getAllRoutes('production');
    expect(staging.some((r) => r.startsWith('/cases/'))).toBe(true);
    expect(production.some((r) => r.startsWith('/cases/'))).toBe(false);
    expect(production.some((r) => r.startsWith('/artikelen/'))).toBe(false);
    expect(getCase('voorbeeld-horeca-lokaal-zichtbaar', 'production')).toBeUndefined();
    expect(getArticle('zo-bouw-je-een-reels-format', 'production')).toBeUndefined();
  });

  it('levert geen dubbele routes op', () => {
    const all = getAllRoutes('staging');
    expect(new Set(all).size).toBe(all.length);
  });

  it('resolveert onbekende slugs naar undefined (→ 404)', () => {
    expect(getService('bestaat-niet')).toBeUndefined();
  });

  it('toont bij een dienst drie andere diensten, nooit zichzelf', () => {
    for (const s of getServices()) {
      const others = getOtherServices(s.slug, 3);
      expect(others).toHaveLength(3);
      expect(others.map((o) => o.slug)).not.toContain(s.slug);
    }
  });

  it('bepaalt de actieve navigatie-item correct', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/diensten/paid-social', '/diensten')).toBe(true);
    expect(isActivePath('/diensten', '/')).toBe(false);
    expect(isActivePath('/dienstenx', '/diensten')).toBe(false);
  });
});
