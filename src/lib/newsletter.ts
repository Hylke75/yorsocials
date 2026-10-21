import { isValidEmail } from './validation';

/** Cookie die onthoudt dat de nieuwsbrief-pop-up is gesloten of dat iemand zich heeft aangemeld. */
export const NEWSLETTER_COOKIE = 'ys_newsletter';
export const NEWSLETTER_DELAY_MS = 3000;
/** Na sluiten: 30 dagen niet opnieuw tonen. Na aanmelden: een jaar. */
export const NEWSLETTER_DISMISS_SECONDS = 60 * 60 * 24 * 30;
export const NEWSLETTER_SUBSCRIBED_SECONDS = 60 * 60 * 24 * 365;
/** Hier tonen we de pop-up niet (juridische pagina's en intern). */
export const NEWSLETTER_EXCLUDED_PATHS = ['/privacy', '/cookies', '/styleguide'];
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_STORAGE_KEY = 'ys_utm';

export interface NewsletterInput {
  email: string;
  firstName: string;
  consent: boolean;
}

export type NewsletterErrors = Partial<Record<'email' | 'consent', string>>;

export function normalizeNewsletterInput(raw: Record<string, unknown>): NewsletterInput {
  return {
    email: typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '',
    firstName: typeof raw.firstName === 'string' ? raw.firstName.trim().slice(0, 80) : '',
    consent: raw.consent === true || raw.consent === 'on' || raw.consent === 'true',
  };
}

export function validateNewsletter(input: NewsletterInput): NewsletterErrors {
  const errors: NewsletterErrors = {};
  if (!input.email) errors.email = 'Vul je e-mailadres in.';
  else if (!isValidEmail(input.email)) errors.email = 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.';
  if (!input.consent) errors.consent = 'Geef toestemming om je de nieuwsbrief te sturen.';
  return errors;
}

export function shouldShowNewsletter(pathname: string, cookieString: string): boolean {
  if (NEWSLETTER_EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return false;
  return !cookieString.split('; ').some((c) => c.startsWith(`${NEWSLETTER_COOKIE}=`));
}

/** Haalt utm_*-parameters uit een querystring. */
export function parseUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) utm[key] = v.slice(0, 100);
  }
  return utm;
}

/** Bewaart de herkomst van de eerste pagina van het bezoek, zodat die ook na doorklikken meegaat. */
export function rememberUtm(search: string): void {
  const utm = parseUtm(search);
  if (Object.keys(utm).length === 0) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // sessionStorage niet beschikbaar: dan gaat de herkomst niet mee
  }
}

export function storedUtm(): Record<string, string> | undefined {
  try {
    const v = sessionStorage.getItem(UTM_STORAGE_KEY);
    return v ? (JSON.parse(v) as Record<string, string>) : undefined;
  } catch {
    return undefined;
  }
}

/** Bericht voor het Mailento-aanmeld-endpoint. */
export function buildSignupPayload(
  input: NewsletterInput,
  { slug, honeypot, durationMs, utm }: { slug: string; honeypot: string; durationMs: number; utm?: Record<string, string> },
) {
  return {
    actie: 'aanmelden' as const,
    slug,
    email: input.email,
    ...(input.firstName ? { voornaam: input.firstName } : {}),
    website: honeypot,
    duur_ms: Math.round(durationMs),
    ...(utm && Object.keys(utm).length > 0 ? { utm } : {}),
  };
}

export type SignupOutcome = { kind: 'success' } | { kind: 'invalid'; message: string } | { kind: 'rate_limited' } | { kind: 'error' };

/** Vertaalt het antwoord van Mailento naar een uitkomst voor de interface. */
export function interpretSignupResponse(httpStatus: number, body: { status?: string; fout?: string } | null): SignupOutcome {
  if (httpStatus === 429 || body?.status === 'te_vaak') return { kind: 'rate_limited' };
  if (body?.status === 'ok') return { kind: 'success' };
  if (body?.status === 'ongeldig') return { kind: 'invalid', message: body.fout || 'Controleer je e-mailadres.' };
  return { kind: 'error' };
}
