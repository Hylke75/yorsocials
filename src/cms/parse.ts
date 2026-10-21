import type { CmsBlock, CmsBrand, CmsContent, CmsLink, CmsNavigation, CmsPage, CmsRedirect, CmsSite } from './types';

/*
 * Defensief lezen: het CMS mag velden weglaten of (nog) niet vullen. Niets hier gooit een fout;
 * onbekende of kapotte waarden worden standaardwaarden.
 */

export const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
export const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
export const strOrNull = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null);
export const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
export const obj = (v: unknown): Record<string, unknown> => (isObj(v) ? v : {});

function stringRecord(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(obj(v))) if (typeof val === 'string' && val.trim()) out[k] = val;
  return out;
}

export function normalizeSlug(slug: string): string {
  const s = `/${slug.trim().replace(/^\/+|\/+$/g, '')}`;
  return s === '/' ? '/' : s.toLowerCase();
}

function parseLink(v: unknown): CmsLink | null {
  const o = obj(v);
  const titel = str(o.titel ?? o.label ?? o.naam).trim();
  const href = str(o.href ?? o.url ?? o.link).trim();
  return titel && href ? { titel, href } : null;
}

const links = (v: unknown): CmsLink[] => arr(v).map(parseLink).filter((l): l is CmsLink => l !== null);

function parseNavigation(v: unknown): CmsNavigation | null {
  if (!isObj(v)) return null;
  return { hoofd: links(v.hoofd), footer: links(v.footer), juridisch: links(v.juridisch), actie: parseLink(v.actie) };
}

function parseBrand(v: unknown): CmsBrand | null {
  if (!isObj(v)) return null;
  return {
    naam: strOrNull(v.naam),
    logo: strOrNull(v.logo),
    logo_licht: strOrNull(v.logo_licht),
    logo_kleur: strOrNull(v.logo_kleur),
    favicon: strOrNull(v.favicon),
    socials: stringRecord(v.socials),
    contact: stringRecord(v.contact),
    tagline: strOrNull(v.tagline),
    slogan: strOrNull(v.slogan),
    badges: arr(v.badges),
  };
}

function parseRedirect(v: unknown): CmsRedirect | null {
  const o = obj(v);
  const van = str(o.van).trim();
  const naar = str(o.naar).trim();
  if (!van || !naar) return null;
  const status = typeof o.status === 'number' && [301, 302, 307, 308].includes(o.status) ? o.status : 308;
  return { van: normalizeSlug(van), naar, status };
}

function parseSite(v: unknown): CmsSite {
  const o = obj(v);
  return {
    naam: str(o.naam),
    domein: str(o.domein),
    locale: str(o.locale, 'nl'),
    design_tokens: obj(o.design_tokens),
    merk: parseBrand(o.merk),
    navigatie: parseNavigation(o.navigatie),
    redirects: arr(o.redirects)
      .map(parseRedirect)
      .filter((r): r is CmsRedirect => r !== null),
  };
}

function parseBlock(v: unknown): CmsBlock | null {
  const o = obj(v);
  const type = str(o.type).trim();
  if (!type) return null;
  return { type, bg: strOrNull(o.bg), content: obj(o.content) };
}

function parsePage(v: unknown): CmsPage | null {
  const o = obj(v);
  const slug = str(o.slug).trim();
  if (!slug) return null;
  return {
    slug: normalizeSlug(slug),
    titel: str(o.titel),
    beschrijving: str(o.beschrijving),
    og_beeld: strOrNull(o.og_beeld),
    blokken: arr(o.blokken)
      .map(parseBlock)
      .filter((b): b is CmsBlock => b !== null),
  };
}

/** Zet een willekeurige API-respons om naar het contract. Geeft null als het geen geldige respons is. */
export function parseCmsContent(raw: unknown): CmsContent | null {
  if (!isObj(raw) || raw.ok !== true) return null;
  const records: CmsContent['records'] = {};
  for (const [kind, list] of Object.entries(obj(raw.records))) {
    records[kind] = arr(list).filter(isObj);
  }
  return {
    site: parseSite(raw.site),
    paginas: arr(raw.paginas)
      .map(parsePage)
      .filter((p): p is CmsPage => p !== null),
    records,
    popups: arr(raw.popups),
  };
}
