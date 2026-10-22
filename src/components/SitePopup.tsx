'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { track } from '@/lib/analytics';
import {
  NEWSLETTER_COOKIE,
  NEWSLETTER_SUBSCRIBED_SECONDS,
  buildSignupPayload,
  interpretSignupResponse,
  normalizeNewsletterInput,
  rememberUtm,
  storedUtm,
  validateNewsletter,
  type NewsletterErrors,
} from '@/lib/newsletter';
import { scopeMatches, type SitePopup as Popup } from '@/lib/popups';
import type { GlobalContent } from '@/content/types';
import { AccentText } from './AccentText';
import { Button, ButtonLink } from './Button';
import { ErrorState } from './ErrorState';
import { Icon } from './Icon';
import styles from './SitePopup.module.css';

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'error'; message: string };

const SEEN_KEY = 'ys_popup_sessie'; // sessionStorage: { [id]: aantal keer getoond deze sessie }
const UNTIL_KEY = 'ys_popup_pauze'; // localStorage: { [id]: niet tonen vóór (ms) } — voor niet-nieuwsbrief-pop-ups
const PAGEVIEWS_KEY = 'ys_popup_paginas'; // sessionStorage: bekeken pagina's (trigger `paginas`)

function readJson(store: () => Storage, key: string): Record<string, number> {
  try {
    return JSON.parse(store().getItem(key) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}
function writeJson(store: () => Storage, key: string, value: Record<string, number>) {
  try {
    store().setItem(key, JSON.stringify(value));
  } catch {
    // opslag geblokkeerd: dan geen frequentiebeperking
  }
}
const session = () => window.sessionStorage;
const local = () => window.localStorage;

function hasNewsletterCookie() {
  return document.cookie.split('; ').some((c) => c.startsWith(`${NEWSLETTER_COOKIE}=`));
}

function allowed(p: Popup, pathname: string) {
  if (!scopeMatches(p.scope, pathname)) return false;
  if (p.kind === 'nieuwsbrief' && hasNewsletterCookie()) return false;
  if (p.kind !== 'nieuwsbrief' && (readJson(local, UNTIL_KEY)[p.id] ?? 0) > Date.now()) return false;
  return (readJson(session, SEEN_KEY)[p.id] ?? 0) < p.maxPerSession;
}

function pause(p: Popup, seconds: number) {
  if (seconds <= 0) return;
  if (p.kind === 'nieuwsbrief') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${NEWSLETTER_COOKIE}=${seconds >= NEWSLETTER_SUBSCRIBED_SECONDS ? 'subscribed' : 'dismissed'}; Max-Age=${Math.round(seconds)}; Path=/; SameSite=Lax${secure}`;
  } else {
    writeJson(local, UNTIL_KEY, { ...readJson(local, UNTIL_KEY), [p.id]: Date.now() + seconds * 1000 });
  }
}

/** Zet de trigger van de pop-up klaar; roept `fire` hooguit één keer aan. Geeft een opruimfunctie terug. */
function armTrigger(p: Popup, fire: () => void): () => void {
  const { type, value } = p.trigger;
  if (type === 'scroll') {
    const onScroll = () => {
      const el = document.documentElement;
      const depth = ((window.scrollY + window.innerHeight) / Math.max(1, el.scrollHeight)) * 100;
      if (depth >= value) fire();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }
  if (type === 'idle') {
    let timer = window.setTimeout(fire, value * 1000);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fire, value * 1000);
    };
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }
  if (type === 'exit') {
    const armedAt = Date.now() + value * 1000;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget && Date.now() >= armedAt) fire();
    };
    document.addEventListener('mouseout', onLeave);
    return () => document.removeEventListener('mouseout', onLeave);
  }
  if (type === 'paginas') {
    const views = Number(window.sessionStorage.getItem(PAGEVIEWS_KEY) ?? '0');
    if (views < value) return () => undefined;
    const timer = window.setTimeout(fire, 1000);
    return () => window.clearTimeout(timer);
  }
  const timer = window.setTimeout(fire, value * 1000);
  return () => window.clearTimeout(timer);
}

/**
 * Pop-uplaag van de site. Welke pop-ups er zijn (soort, tekst, trigger, pagina's, frequentie) komt uit
 * het CMS (`/admin/popups`); zonder CMS is het de lokale nieuwsbrief-pop-up. Toont er nooit meer dan één.
 * Native <dialog>: bij de blokkerende vorm regelt de browser focus-trap, Escape en focusherstel.
 *
 * Nieuwsbriefaanmeldingen gaan vanuit de browser rechtstreeks naar Mailento (double opt-in).
 */
export function SitePopup({ popups, endpoint, slug, labels: t }: { popups: Popup[]; endpoint: string; slug: string; labels: GlobalContent['newsletter'] }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Popup | null>(null);
  const [errors, setErrors] = useState<NewsletterErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  useEffect(() => {
    rememberUtm(window.location.search);
  }, []);

  useEffect(() => {
    try {
      const views = Number(window.sessionStorage.getItem(PAGEVIEWS_KEY) ?? '0') + 1;
      window.sessionStorage.setItem(PAGEVIEWS_KEY, String(views));
    } catch {
      // geen sessionStorage: trigger `paginas` werkt dan niet
    }
    const candidate = popups.find((p) => allowed(p, pathname));
    if (!candidate) return;
    let fired = false;
    const disarm = armTrigger(candidate, () => {
      if (fired) return;
      // Opnieuw controleren: de bezoeker kan intussen naar een uitgesloten pagina zijn genavigeerd.
      if (!allowed(candidate, window.location.pathname)) return;
      if (document.querySelector('dialog[open]')) return; // geen tweede pop-up boven een open dialoog
      fired = true;
      writeJson(session, SEEN_KEY, { ...readJson(session, SEEN_KEY), [candidate.id]: (readJson(session, SEEN_KEY)[candidate.id] ?? 0) + 1 });
      setStatus({ kind: 'idle' });
      setErrors({});
      setActive(candidate);
      track(candidate.kind === 'nieuwsbrief' ? 'newsletter_view' : 'popup_view', { path: window.location.pathname, placement: candidate.id });
    });
    return disarm;
  }, [pathname, popups]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (active && !d.open) {
      if (active.layout === 'modal') d.showModal();
      else d.show();
    }
    if (!active && d.open) d.close();
  }, [active]);

  const dismiss = useCallback(() => {
    if (active && status.kind !== 'success') pause(active, active.cooldownDays * 86400);
    setActive(null);
  }, [active, status.kind]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!active || status.kind === 'submitting') return;
    const fd = new FormData(e.currentTarget);
    const input = normalizeNewsletterInput({ email: fd.get('email'), firstName: fd.get('voornaam'), consent: fd.get('consent') === 'on' });
    const clientErrors = validateNewsletter(input);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      document.getElementById(clientErrors.email ? 'nb-email' : 'nb-consent')?.focus();
      return;
    }
    setStatus({ kind: 'submitting' });
    const payload = buildSignupPayload(input, {
      slug,
      honeypot: String(fd.get('website') ?? ''),
      // Tijd sinds het laden van de pagina; Mailento negeert alles onder 2,5 s als bot.
      durationMs: performance.now(),
      utm: storedUtm(),
    });
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = (await res.json().catch(() => null)) as { status?: string; fout?: string } | null;
      const outcome = interpretSignupResponse(res.status, data);
      if (outcome.kind === 'success') {
        pause(active, NEWSLETTER_SUBSCRIBED_SECONDS);
        setStatus({ kind: 'success' });
        track('newsletter_signup_success');
        return;
      }
      track('newsletter_signup_error', { error: outcome.kind });
      if (outcome.kind === 'invalid') {
        setErrors({ email: outcome.message });
        setStatus({ kind: 'idle' });
        document.getElementById('nb-email')?.focus();
        return;
      }
      setStatus({
        kind: 'error',
        message:
          outcome.kind === 'rate_limited'
            ? 'Te veel pogingen. Je bent níet aangemeld; probeer het later opnieuw.'
            : 'Er ging iets mis. Je bent níet aangemeld; probeer het opnieuw.',
      });
    } catch {
      track('newsletter_signup_error', { error: 'network' });
      setStatus({ kind: 'error', message: 'Geen verbinding. Je bent níet aangemeld; probeer het later opnieuw.' });
    }
  }

  const c = active?.content;
  const layoutClass = active?.layout === 'slidein' ? styles.slidein : active?.layout === 'balk' ? styles.bar : '';
  const positionClass = active && active.layout !== 'modal' && active.position === 'boven' ? styles.top : '';

  return (
    <dialog
      ref={dialogRef}
      className={[styles.dialog, layoutClass, positionClass].filter(Boolean).join(' ')}
      aria-labelledby="nb-title"
      aria-describedby={c?.text ? 'nb-text' : undefined}
      data-testid={active?.kind === 'nieuwsbrief' ? 'newsletter-popup' : 'site-popup'}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onKeyDown={(e) => {
        // Niet-blokkerende <dialog> krijgt geen cancel-event: Escape zelf afhandelen.
        if (e.key === 'Escape' && active?.layout !== 'modal') dismiss();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) dismiss(); // klik op de achtergrond
      }}
    >
      {active && c && (
        <div className={styles.inner}>
          <button type="button" className={styles.close} onClick={dismiss} aria-label={t.closeLabel}>
            <Icon name="close" size={22} />
          </button>
          {c.eyebrow && <p className="eyebrow">{c.eyebrow}</p>}
          {active.kind !== 'nieuwsbrief' ? (
            <div>
              <h2 id="nb-title" className={styles.title}>
                <AccentText text={c.heading} />
              </h2>
              {c.text && (
                <p id="nb-text" className={styles.text}>
                  {c.text}
                </p>
              )}
              {/* Doorklikken telt als 'gezien': de klik op de link bubbelt naar deze container. */}
              <div className={styles.actions} onClickCapture={(e) => (e.target as HTMLElement).closest('a') && dismiss()}>
                <ButtonLink href={c.buttonHref} placement={`popup-${active.id}`} external={c.buttonHref.startsWith('http')}>
                  {c.buttonLabel || t.closeLabel}
                </ButtonLink>
                <button type="button" className={styles.decline} onClick={dismiss}>
                  {t.declineLabel}
                </button>
              </div>
            </div>
          ) : status.kind === 'success' ? (
            <div role="status">
              <h2 id="nb-title" className={styles.title}>
                <AccentText text={t.successHeading} />
              </h2>
              <p id="nb-text" className={styles.text}>
                {c.successText || t.successText}
              </p>
              <Button type="button" icon={null} onClick={() => setActive(null)}>
                {t.closeLabel}
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <h2 id="nb-title" className={styles.title}>
                <AccentText text={c.heading} />
              </h2>
              {c.text && (
                <p id="nb-text" className={styles.text}>
                  {c.text}
                </p>
              )}
              {status.kind === 'error' && (
                <div className={styles.status}>
                  <ErrorState title="Aanmelden niet gelukt" description={status.message} />
                </div>
              )}
              <label className={styles.label} htmlFor="nb-email">
                {t.emailLabel}
              </label>
              <input
                id="nb-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={styles.input}
                placeholder={c.placeholder || 'naam@bedrijf.nl'}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'nb-email-error' : undefined}
              />
              {errors.email && (
                <p id="nb-email-error" className={styles.error}>
                  {errors.email}
                </p>
              )}
              <label className={styles.label} htmlFor="nb-voornaam" style={{ marginTop: 16 }}>
                {t.firstNameLabel} <span className={styles.optional}>(optioneel)</span>
              </label>
              <input id="nb-voornaam" name="voornaam" type="text" autoComplete="given-name" maxLength={80} className={styles.input} />
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="nb-website">Website</label>
                <input id="nb-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className={styles.check}>
                <input
                  id="nb-consent"
                  name="consent"
                  type="checkbox"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'nb-consent-error' : undefined}
                />
                <label htmlFor="nb-consent">
                  {t.consentLabel} <Link href="/juridisch/privacy">{t.privacyLinkLabel}</Link>.
                </label>
              </div>
              {errors.consent && (
                <p id="nb-consent-error" className={styles.error}>
                  {errors.consent}
                </p>
              )}
              {c.privacy && <p className={styles.privacy}>{c.privacy}</p>}
              <div className={styles.actions}>
                <Button type="submit" disabled={status.kind === 'submitting'} icon={status.kind === 'submitting' ? 'loader' : 'arrowRight'}>
                  {status.kind === 'submitting' ? 'Bezig met aanmelden…' : c.buttonLabel || t.submitLabel}
                </Button>
                <button type="button" className={styles.decline} onClick={dismiss}>
                  {t.declineLabel}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </dialog>
  );
}
