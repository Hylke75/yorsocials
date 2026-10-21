/**
 * Responscontract van het Link & Lead-CMS (GET https://linkandlead.nl/api/cms/content).
 * Velden met "binnenkort" zitten al in het contract maar worden pas na de volgende CMS-deploy gevuld;
 * de parser levert dan lege standaardwaarden.
 */

export interface CmsBlock {
  type: string;
  /** Huisstijl-token ("mist", "nacht", …) of null. */
  bg: string | null;
  content: Record<string, unknown>;
}

export interface CmsPage {
  slug: string;
  titel: string;
  beschrijving: string;
  /** binnenkort */
  og_beeld: string | null;
  blokken: CmsBlock[];
}

export interface CmsLink {
  titel: string;
  href: string;
}

export interface CmsNavigation {
  hoofd: CmsLink[];
  footer: CmsLink[];
  juridisch: CmsLink[];
  actie: CmsLink | null;
}

export interface CmsBrand {
  naam: string | null;
  logo: string | null;
  logo_licht: string | null;
  logo_kleur: string | null;
  favicon: string | null;
  socials: Record<string, string>;
  contact: Record<string, string>;
  tagline: string | null;
  slogan: string | null;
  badges: unknown[];
}

export interface CmsRedirect {
  van: string;
  naar: string;
  status: number;
}

export interface CmsSite {
  naam: string;
  domein: string;
  locale: string;
  design_tokens: Record<string, unknown>;
  /** binnenkort */
  merk: CmsBrand | null;
  /** binnenkort */
  navigatie: CmsNavigation | null;
  /** binnenkort */
  redirects: CmsRedirect[];
}

export interface CmsContent {
  site: CmsSite;
  paginas: CmsPage[];
  /** binnenkort: alleen gevulde soorten, bijv. teamleden, cases, artikelen. */
  records: Record<string, Record<string, unknown>[]>;
  popups: unknown[];
}
