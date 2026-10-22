import 'server-only';
import { getGlobalContent, getServices, getSiteSettings } from '@/content/repository';
import { NAV_LINKS } from '@/lib/routes';
import { getCmsSite } from './client';
import type { CmsNavItem } from './types';

export interface NavLink {
  href: string;
  label: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export interface SiteChrome {
  name: string;
  tagline: string;
  /** Logo voor donkere achtergrond: CMS-URL (zonder afmetingen) of null → ingebouwd logo. */
  logoUrl: string | null;
  mainNav: NavLink[];
  footerColumns: FooterColumn[];
  legalNav: NavLink[];
  /** Primaire knop in de header; null → standaard "Plan een kennismaking". */
  action: NavLink | null;
  email: string | null;
  phone: string | null;
  /** Adresregels, KvK e.d. uit het CMS (alleen wat is ingevuld). */
  addressLines: string[];
  legalName: string | null;
  socials: { label: string; url: string }[];
}

/** Uitklap-ouders zonder eigen link worden hun sublinks; zo blijft het menu één platte, toegankelijke lijst. */
function flattenNav(items: CmsNavItem[]): NavLink[] {
  return items.flatMap((i) => (i.href ? [{ href: i.href, label: i.titel }] : i.subs.map((s) => ({ href: s.href, label: s.titel }))));
}

const SOCIAL_LABELS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook', x: 'X' };

/**
 * Menu, footer, juridische links, merk en contact komen uit `site.*` van het CMS. Ontbreekt iets
 * (zoals vóór de CMS-deploy), dan geldt per onderdeel de ingebouwde inhoud.
 */
export async function getSiteChrome(): Promise<SiteChrome> {
  const cms = await getCmsSite();
  const local = getSiteSettings();
  const g = getGlobalContent();
  const nav = cms?.navigatie;
  const merk = cms?.merk;
  const contact = merk?.contact ?? {};

  const localFooter: FooterColumn[] = [
    { heading: g.footer.navigationHeading, links: [...NAV_LINKS, ...g.footer.extraLinks] },
    { heading: g.footer.servicesHeading, links: getServices().map((s) => ({ href: `/diensten/${s.slug}`, label: s.title })) },
  ];
  const cmsSocials = Object.entries(merk?.socials ?? {}).map(([k, url]) => ({ label: SOCIAL_LABELS[k.toLowerCase()] ?? k, url }));

  return {
    name: merk?.naam ?? local.name,
    tagline: merk?.tagline ?? local.tagline,
    logoUrl: merk?.logo_licht ?? merk?.logo ?? null,
    mainNav: nav?.hoofd.length ? flattenNav(nav.hoofd) : [...NAV_LINKS],
    footerColumns: nav?.footer.length ? nav.footer.map((c) => ({ heading: c.kop, links: c.links.map((l) => ({ href: l.href, label: l.titel })) })) : localFooter,
    legalNav: nav?.juridisch.length ? nav.juridisch.map((l) => ({ href: l.href, label: l.titel })) : g.footer.legalLinks,
    action: nav?.actie ? { href: nav.actie.href, label: nav.actie.titel } : null,
    email: contact.email ?? local.email,
    phone: contact.telefoon ?? local.phone,
    addressLines: [contact.adres, contact.postcode_plaats, contact.kvk ? `KvK ${contact.kvk}` : undefined].filter((x): x is string => Boolean(x)),
    legalName: contact.juridisch ?? contact.bedrijf ?? local.legalEntity?.name ?? null,
    socials: cmsSocials.length
      ? cmsSocials
      : local.socialLinks.filter((s) => s.verified).map((s) => ({ label: SOCIAL_LABELS[s.platform] ?? s.platform, url: s.url })),
  };
}
