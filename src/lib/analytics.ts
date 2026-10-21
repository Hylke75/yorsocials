/**
 * Analytics-events (functioneel ontwerp §11). Events worden ALLEEN verstuurd als er
 * analytics-toestemming is; zonder toestemming worden ze weggegooid, niet gebufferd.
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
  | 'booking_click';

type Params = Partial<Record<'destination' | 'placement' | 'slug' | 'sector' | 'error' | 'path' | 'topic', string>>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __ysAnalyticsConsent?: boolean;
    /** Zonder GA-ID worden events hier verzameld (handig in staging en tests). */
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
  if (typeof window === 'undefined' || !window.__ysAnalyticsConsent) return;
  const clean = sanitizeParams(params);
  if (window.gtag) window.gtag('event', event, clean);
  else (window.__ysAnalyticsLog ??= []).push({ event, params: clean });
}
