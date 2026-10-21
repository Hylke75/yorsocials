/**
 * Analytics-events (functioneel ontwerp §11). Het platform is cookieloos: events gaan naar Plausible
 * (geen cookies, geen persoonsgegevens) wanneer NEXT_PUBLIC_PLAUSIBLE_DOMAIN is ingesteld. Zonder
 * Plausible worden ze alleen in het geheugen verzameld (staging/tests), nooit verstuurd.
 * Payloads mogen nooit persoonsgegevens bevatten: alleen whitelisted, korte waarden.
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'service_view'
  | 'case_filter'
  | 'case_view'
  | 'form_start'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'booking_click'
  | 'newsletter_view'
  | 'popup_view'
  | 'newsletter_signup_success'
  | 'newsletter_signup_error';

type Params = Partial<Record<'destination' | 'placement' | 'slug' | 'sector' | 'error' | 'path' | 'topic', string>>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Record<string, string> }) => void) & { q?: unknown[] };
    /** Zonder Plausible worden events hier verzameld (handig in staging en tests). */
    __ysAnalyticsLog?: { event: AnalyticsEvent; params: Params }[];
  }
}

const ALLOWED_KEYS = new Set(['destination', 'placement', 'slug', 'sector', 'error', 'path', 'topic']);
const EMAIL_LIKE = /@|\d{6,}/;

export function sanitizeParams(params: Params = {}): Params {
  const out: Params = {};
  for (const [k, v] of Object.entries(params)) {
    if (!ALLOWED_KEYS.has(k) || typeof v !== 'string') continue;
    if (EMAIL_LIKE.test(v)) continue;
    out[k as keyof Params] = v.slice(0, 100);
  }
  return out;
}

export function track(event: AnalyticsEvent, params?: Params): void {
  if (typeof window === 'undefined') return;
  const clean = sanitizeParams(params);
  if (window.plausible) window.plausible(event, { props: clean });
  else (window.__ysAnalyticsLog ??= []).push({ event, params: clean });
}
