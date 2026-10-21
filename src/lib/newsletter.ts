import { isValidEmail } from './validation';

/** Cookie die onthoudt dat de nieuwsbrief-pop-up is gesloten of dat iemand zich heeft aangemeld. */
export const NEWSLETTER_COOKIE = 'ys_newsletter';
export const NEWSLETTER_DELAY_MS = 3000;
/** Na sluiten: 30 dagen niet opnieuw tonen. Na aanmelden: een jaar. */
export const NEWSLETTER_DISMISS_SECONDS = 60 * 60 * 24 * 30;
export const NEWSLETTER_SUBSCRIBED_SECONDS = 60 * 60 * 24 * 365;
/** Hier tonen we de pop-up niet (juridische pagina's en intern). */
export const NEWSLETTER_EXCLUDED_PATHS = ['/privacy', '/cookies', '/styleguide'];
export const NEWSLETTER_MIN_FILL_MS = 1200;

export interface NewsletterInput {
  email: string;
  consent: boolean;
}

export type NewsletterErrors = Partial<Record<keyof NewsletterInput, string>>;

export function normalizeNewsletterInput(raw: Record<string, unknown>): NewsletterInput {
  return {
    email: typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '',
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
