import { globalContent } from '@/content/data/global';

/**
 * Validatie van het contactformulier. Wordt zowel client- als server-side gebruikt,
 * zodat foutmeldingen overal gelijk zijn. De server vertrouwt nooit alleen op de client.
 */

/** Onderwerpen komen uit de contentlaag, zodat client en server dezelfde lijst gebruiken. */
export const CONTACT_TOPICS: readonly string[] = globalContent.contactForm.topics;


export interface ContactInput {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  privacy: boolean;
}

export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  name: 100,
  email: 254,
  company: 120,
  message: 4000,
  messageMin: 10,
} as const;

// Pragmatische e-mailcheck: één @, geen spaties, een punt in het domein.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= LIMITS.email && EMAIL_RE.test(email);
}
// Controle- en zero-width tekens weren (geen legitiem gebruik in een contactbericht).
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028\u2029\uFEFF]/g;

function clean(value: unknown, { multiline = false } = {}): string {
  if (typeof value !== 'string') return '';
  let v = value.replace(CONTROL_RE, '');
  if (!multiline) v = v.replace(/[\r\n\t]+/g, ' ');
  return v.trim();
}

export function normalizeContactInput(raw: Record<string, unknown>): ContactInput {
  return {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    company: clean(raw.company),
    topic: clean(raw.topic),
    message: clean(raw.message, { multiline: true }),
    privacy: raw.privacy === true || raw.privacy === 'on' || raw.privacy === 'true',
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (!input.name) errors.name = 'Vul je naam in.';
  else if (input.name.length > LIMITS.name) errors.name = `Je naam mag maximaal ${LIMITS.name} tekens bevatten.`;

  if (!input.email) errors.email = 'Vul je e-mailadres in.';
  else if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email))
    errors.email = 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.';

  if (input.company.length > LIMITS.company)
    errors.company = `De bedrijfsnaam mag maximaal ${LIMITS.company} tekens bevatten.`;

  if (!input.topic) errors.topic = 'Kies waarmee we je kunnen helpen.';
  else if (!CONTACT_TOPICS.includes(input.topic)) errors.topic = 'Kies een onderwerp uit de lijst.';

  if (!input.message) errors.message = 'Vertel kort over je plannen.';
  else if (input.message.length < LIMITS.messageMin)
    errors.message = `Je bericht moet minimaal ${LIMITS.messageMin} tekens bevatten.`;
  else if (input.message.length > LIMITS.message)
    errors.message = `Je bericht mag maximaal ${LIMITS.message} tekens bevatten.`;

  if (!input.privacy) errors.privacy = 'Geef toestemming om je gegevens voor deze aanvraag te verwerken.';

  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Antispam: honeypot gevuld of formulier onmenselijk snel verzonden. */
export const MIN_FILL_TIME_MS = 2500;

export function isLikelySpam(raw: Record<string, unknown>, now = Date.now(), minFillTimeMs = MIN_FILL_TIME_MS): boolean {
  const honeypot = typeof raw.website === 'string' ? raw.website.trim() : '';
  if (honeypot) return true;
  const startedAt = Number(raw.startedAt);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return true;
  return now - startedAt < minFillTimeMs;
}

/** Escape voor gebruik in HTML-e-mails. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
