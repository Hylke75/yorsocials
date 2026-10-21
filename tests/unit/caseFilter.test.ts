import { describe, expect, it } from 'vitest';
import { getCases, getSectors } from '@/content/repository';
import { ALL_SECTORS, filterCases, parseSectorParam, sectorHref } from '@/lib/caseFilter';

const sectors = getSectors();
const cases = getCases('staging');

describe('parseSectorParam', () => {
  it('valt terug op "alle" bij leeg of onbekend', () => {
    expect(parseSectorParam(null, sectors)).toBe(ALL_SECTORS);
    expect(parseSectorParam('bestaat-niet', sectors)).toBe(ALL_SECTORS);
  });
  it('normaliseert hoofdletters en arrays', () => {
    expect(parseSectorParam('HORECA', sectors)).toBe('horeca');
    expect(parseSectorParam(['fitness', 'retail'], sectors)).toBe('fitness');
  });
});

describe('filterCases', () => {
  it('geeft alles terug voor "alle"', () => {
    expect(filterCases(cases, ALL_SECTORS)).toHaveLength(cases.length);
  });
  it('filtert op sector', () => {
    const result = filterCases(cases, 'horeca');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.sector === 'horeca')).toBe(true);
  });
  it('geeft een lege lijst voor een sector zonder cases (lege toestand)', () => {
    expect(filterCases(cases, 'personal-brand')).toEqual([]);
  });
});

describe('sectorHref', () => {
  it('bouwt deelbare URLs', () => {
    expect(sectorHref('/cases', 'horeca')).toBe('/cases?sector=horeca');
    expect(sectorHref('/cases', ALL_SECTORS)).toBe('/cases');
  });
});
