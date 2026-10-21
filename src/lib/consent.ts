/** Consentmodel. Versie ophogen bij wijziging van cookietekst/-categorieën: dan opnieuw vragen. */
export const CONSENT_VERSION = '2026-10-1';
export const CONSENT_COOKIE = 'ys_consent';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182; // ~6 maanden

export interface ConsentState {
  version: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export function createConsent(choice: { analytics: boolean; marketing: boolean }, now = new Date()): ConsentState {
  return { version: CONSENT_VERSION, necessary: true, analytics: choice.analytics, marketing: choice.marketing, updatedAt: now.toISOString() };
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

/** Geeft null bij ontbrekende, ongeldige of verouderde toestemming (= status "onbekend"). */
export function parseConsent(value: string | undefined | null): ConsentState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
    return {
      version: parsed.version,
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return null;
  }
}

export function readConsentCookie(cookieString: string): ConsentState | null {
  const match = cookieString.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1));
}
