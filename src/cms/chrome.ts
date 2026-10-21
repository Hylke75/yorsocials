import 'server-only';
import { getGlobalContent, getSiteSettings } from '@/content/repository';
import { NAV_LINKS } from '@/lib/routes';
import { getCmsSite } from './client';

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteChrome {
  name: string;
  tagline: string;
  /** Logo voor donkere achtergrond: CMS-URL (zonder afmetingen) of null → ingebouwd logo. */
  logoUrl: string | null;
  mainNav: NavLink[];
  footerNav: NavLink[];
  legalNav: NavLink[];
  /** true zodra het CMS de footer levert; de ingebouwde dienstenkolom vervalt dan. */
  footerFromCms: boolean;
  /** Primaire knop in de header; null → standaard "Plan een kennismaking". */
  action: NavLink | null;
  email: string | null;
  phone: string | null;
  socials: { label: string; url: string }[];
}

const toNav = (links: { titel: string; href: string }[]): NavLink[] => links.map((l) => ({ href: l.href, label: l.titel }));
const SOCIAL_LABELS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook', x: 'X' };

/**
 * Menu, footer, juridische links, merk en contact komen uit `site.*` van het CMS. Ontbreekt iets
 * (zoals nu, vóór de CMS-deploy), dan geldt per onderdeel de ingebouwde inhoud.
 */
export async function getSiteChrome(): Promise<SiteChrome> {
  const cms = await getCmsSite();
  const local = getSiteSettings();
  const g = getGlobalContent();
  const nav = cms?.navigatie;
  const merk = cms?.merk;
  const pick = (record: Record<string, string> | undefined, keys: string[]) => keys.map((k) => record?.[k]).find(Boolean) ?? null;

  const cmsSocials = Object.entries(merk?.socials ?? {}).map(([k, url]) => ({ label: SOCIAL_LABELS[k.toLowerCase()] ?? k, url }));
  return {
    name: merk?.naam ?? local.name,
    tagline: merk?.tagline ?? local.tagline,
    logoUrl: merk?.logo_licht ?? merk?.logo ?? null,
    mainNav: nav?.hoofd.length ? toNav(nav.hoofd) : [...NAV_LINKS],
    footerNav: nav?.footer.length ? toNav(nav.footer) : [...NAV_LINKS, ...g.footer.extraLinks],
    legalNav: nav?.juridisch.length ? toNav(nav.juridisch) : g.footer.legalLinks,
    footerFromCms: Boolean(nav?.footer.length),
    action: nav?.actie ? { href: nav.actie.href, label: nav.actie.titel } : null,
    email: pick(merk?.contact, ['email', 'e-mail', 'mail']) ?? local.email,
    phone: pick(merk?.contact, ['telefoon', 'phone', 'tel']) ?? local.phone,
    socials: cmsSocials.length
      ? cmsSocials
      : local.socialLinks.filter((s) => s.verified).map((s) => ({ label: SOCIAL_LABELS[s.platform] ?? s.platform, url: s.url })),
  };
}
