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

/** Hoofdmenu-item: met eigen link, of een uitklap-ouder met sublinks. */
export interface CmsNavItem {
  titel: string;
  href: string | null;
  subs: CmsLink[];
}

export interface CmsFooterColumn {
  kop: string;
  links: CmsLink[];
}

export interface CmsNavigation {
  hoofd: CmsNavItem[];
  /** Footer in kolommen (kop + links). */
  footer: CmsFooterColumn[];
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
  /** bedrijf, juridisch, email, telefoon, adres, postcode_plaats, kvk, btw, reactietijd */
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

/** Records uit de ingebouwde collecties (alleen publiceerbare kolommen). */
export interface CmsTeamMember {
  id: string;
  naam: string;
  functie: string;
  tekst: string;
  foto: string | null;
  linkedin: string | null;
}

export interface CmsArticle {
  id: string;
  slug: string;
  titel: string;
  rubriek: string;
  antwoordblok: string;
  samenvatting: string;
  hoofdtekst: string;
  foto: string | null;
  gepubliceerd_op: string | null;
  auteur: string;
}

export interface CmsCase {
  id: string;
  klantnaam: string;
  sector: string;
  uitdaging: string;
  aanpak: string;
  resultaat_cijfer: string;
  resultaat_periode: string;
  citaat: string;
  foto: string | null;
}

export interface CmsContent {
  site: CmsSite;
  paginas: CmsPage[];
  /** binnenkort: alleen gevulde soorten, bijv. teamleden, cases, artikelen. */
  records: Record<string, Record<string, unknown>[]>;
  popups: unknown[];
}
