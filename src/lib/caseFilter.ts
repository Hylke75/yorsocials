import type { CaseStudy, Sector } from '@/content/types';

export const ALL_SECTORS = 'alle';

/** Normaliseert de `sector`-queryparameter naar een bekende sector of "alle". */
export function parseSectorParam(value: string | string[] | null | undefined, sectors: Sector[]): string {
  const v = (Array.isArray(value) ? value[0] : value)?.toLowerCase().trim();
  if (!v) return ALL_SECTORS;
  return sectors.some((s) => s.id === v) ? v : ALL_SECTORS;
}

export function filterCases(cases: CaseStudy[], sector: string): CaseStudy[] {
  if (sector === ALL_SECTORS) return cases;
  return cases.filter((c) => c.sector === sector);
}

/** Bouwt de URL voor een filterkeuze; "alle" levert een schone URL zonder query op. */
export function sectorHref(pathname: string, sector: string): string {
  return sector === ALL_SECTORS ? pathname : `${pathname}?sector=${encodeURIComponent(sector)}`;
}
