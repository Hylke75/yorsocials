import type { GlobalContent } from '@/content/types';
import { NEWSLETTER_DELAY_MS, NEWSLETTER_DISMISS_SECONDS, NEWSLETTER_EXCLUDED_PATHS } from './newsletter';

/**
 * Pop-ups zoals de site ze toont. Bron is het CMS (`/admin/popups` → `popups` in de content-respons);
 * zonder CMS valt de site terug op de lokale nieuwsbrief-pop-up. `leadmagnet` wordt (nog) niet
 * ondersteund: daar hoort een download-endpoint bij dat niet in het CMS-contract zit.
 */
export const POPUP_KINDS = ['nieuwsbrief', 'aankondiging', 'afspraak'] as const;
export type PopupKind = (typeof POPUP_KINDS)[number];
export const POPUP_TRIGGERS = ['tijd', 'scroll', 'exit', 'paginas', 'idle'] as const;
export type PopupTriggerType = (typeof POPUP_TRIGGERS)[number];

export interface SitePopup {
  id: string;
  kind: PopupKind;
  /** modal/welkomstmat blokkeren de pagina; slidein/balk niet. */
  layout: 'modal' | 'slidein' | 'balk';
  position: 'boven' | 'onder';
  trigger: { type: PopupTriggerType; value: number };
  scope: { mode: 'alle' | 'alleen' | 'behalve'; paths: string[] };
  cooldownDays: number;
  maxPerSession: number;
  content: {
    eyebrow: string;
    heading: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
    placeholder: string;
    successText: string;
    privacy: string;
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const num = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
const oneOf = <T extends string>(v: unknown, set: readonly T[]): T | null => (typeof v === 'string' && (set as readonly string[]).includes(v) ? (v as T) : null);
/** Alleen interne paden of https-links (zelfde regel als het CMS). */
const safeHref = (v: unknown) => {
  const s = str(v);
  return s.startsWith('/') || /^https:\/\//i.test(s) ? s : '';
};

/** Zet één `PubliekePopup` uit het CMS om; onbekende of onbruikbare pop-ups → null. */
export function fromCmsPopup(raw: unknown): SitePopup | null {
  if (!isObj(raw)) return null;
  const inhoud = isObj(raw.inhoud) ? raw.inhoud : {};
  const kind = oneOf(inhoud.soort, POPUP_KINDS);
  if (!kind) return null;
  const trigger = isObj(raw.trigger) ? raw.trigger : {};
  const scope = isObj(raw.scope) ? raw.scope : {};
  const herhaling = isObj(raw.herhaling) ? raw.herhaling : {};
  const vorm = str(raw.vorm);
  const content = {
    eyebrow: str(inhoud.eyebrow),
    heading: str(inhoud.kop),
    text: str(inhoud.tekst),
    buttonLabel: str(inhoud.knoptekst),
    buttonHref: safeHref(inhoud.knop),
    placeholder: str(inhoud.email_plaatshouder),
    successText: str(inhoud.bevestiging),
    privacy: str(inhoud.privacy),
  };
  // Een knop-pop-up zonder (veilige) link heeft geen doel.
  if (kind !== 'nieuwsbrief' && !content.buttonHref) return null;
  if (!content.heading && !content.text) return null;
  return {
    id: str(raw.id) || `popup-${kind}`,
    kind,
    layout: vorm === 'slidein' ? 'slidein' : vorm === 'balk' ? 'balk' : 'modal',
    position: str(raw.positie) === 'boven' ? 'boven' : 'onder',
    trigger: { type: oneOf(trigger.type, POPUP_TRIGGERS) ?? 'tijd', value: Math.max(0, num(trigger.waarde, 15)) },
    scope: {
      mode: oneOf(scope.modus, ['alle', 'alleen', 'behalve'] as const) ?? 'alle',
      paths: Array.isArray(scope.paden) ? scope.paden.map(str).filter(Boolean) : [],
    },
    cooldownDays: Math.max(0, num(herhaling.cooldown_dagen, 7)),
    maxPerSession: Math.max(1, num(herhaling.max_per_sessie, 1)),
    content,
  };
}

export function popupsFromCms(raw: unknown[]): SitePopup[] {
  return raw.map(fromCmsPopup).filter((p): p is SitePopup => p !== null);
}

/** Lokale terugval (geen CMS): de nieuwsbrief-pop-up na 3 s, behalve op juridische pagina's. */
export function localNewsletterPopup(t: GlobalContent['newsletter']): SitePopup {
  return {
    id: 'nieuwsbrief',
    kind: 'nieuwsbrief',
    layout: 'modal',
    position: 'onder',
    trigger: { type: 'tijd', value: NEWSLETTER_DELAY_MS / 1000 },
    scope: { mode: 'behalve', paths: [] },
    cooldownDays: NEWSLETTER_DISMISS_SECONDS / 86400,
    maxPerSession: 1,
    content: { eyebrow: t.eyebrow, heading: t.heading, text: t.text, buttonLabel: t.submitLabel, buttonHref: '', placeholder: 'naam@bedrijf.nl', successText: t.successText, privacy: '' },
  };
}

/** Past de paginascope op het pad? Exacte paden (trailing slash maakt niet uit) en `/pad/*`-wildcards. */
export function scopeMatches(scope: SitePopup['scope'], pathname: string): boolean {
  if (NEWSLETTER_EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return false;
  if (scope.mode === 'alle') return true;
  const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);
  const target = norm(pathname);
  const hit = scope.paths.some((raw) => {
    const p = norm(raw);
    if (p.endsWith('/*')) return target === p.slice(0, -2) || target.startsWith(p.slice(0, -1));
    return target === p;
  });
  return scope.mode === 'alleen' ? hit : !hit;
}
