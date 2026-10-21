'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { track } from '@/lib/analytics';
import {
  NEWSLETTER_COOKIE,
  NEWSLETTER_DELAY_MS,
  NEWSLETTER_DISMISS_SECONDS,
  NEWSLETTER_SUBSCRIBED_SECONDS,
  buildSignupPayload,
  interpretSignupResponse,
  normalizeNewsletterInput,
  rememberUtm,
  shouldShowNewsletter,
  storedUtm,
  validateNewsletter,
  type NewsletterErrors,
} from '@/lib/newsletter';
import { Button } from './Button';
import { useConsent } from './consent/ConsentProvider';
import { ErrorState } from './ErrorState';
import { Icon } from './Icon';
import styles from './NewsletterPopup.module.css';

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'error'; message: string };

function remember(value: 'dismissed' | 'subscribed', maxAge: number) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${NEWSLETTER_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Nieuwsbrief-pop-up: verschijnt 3 seconden na het laden, pas nadat de cookiekeuze is gemaakt
 * (zodat de twee niet over elkaar heen vallen), en daarna niet opnieuw zodra iemand sluit of zich aanmeldt.
 * Native <dialog>: focus-trap, Escape en focusherstel regelt de browser.
 *
 * Aanmeldingen gaan vanuit de browser rechtstreeks naar Mailento (double opt-in: de bezoeker
 * krijgt eerst een bevestigingsmail).
 */
export function NewsletterPopup({ endpoint, slug }: { endpoint: string; slug: string }) {
  const { consent } = useConsent();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedAt = useRef(0);
  const scheduled = useRef(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<NewsletterErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const consentDecided = consent !== undefined && consent !== null;

  useEffect(() => {
    rememberUtm(window.location.search);
  }, []);

  useEffect(() => {
    if (!consentDecided || scheduled.current) return;
    if (!shouldShowNewsletter(pathname, document.cookie)) return;
    scheduled.current = true;
    const timer = window.setTimeout(() => {
      // Opnieuw controleren: de bezoeker kan intussen naar een uitgesloten pagina zijn genavigeerd.
      if (!shouldShowNewsletter(window.location.pathname, document.cookie)) return;
      if (document.querySelector('dialog[open]')) return; // geen tweede modal boven een open dialoog
      openedAt.current = Date.now();
      setOpen(true);
      track('newsletter_view', { path: window.location.pathname });
    }, NEWSLETTER_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      scheduled.current = false;
    };
  }, [consentDecided, pathname]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const dismiss = useCallback(() => {
    if (status.kind !== 'success') remember('dismissed', NEWSLETTER_DISMISS_SECONDS);
    setOpen(false);
  }, [status.kind]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === 'submitting') return;
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
        remember('subscribed', NEWSLETTER_SUBSCRIBED_SECONDS);
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

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="nb-title"
      aria-describedby="nb-text"
      data-testid="newsletter-popup"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) dismiss(); // klik op de achtergrond
      }}
    >
      {open && (
        <div className={styles.inner}>
          <button type="button" className={styles.close} onClick={dismiss} aria-label="Sluiten">
            <Icon name="close" size={22} />
          </button>
          <p className="eyebrow">Nieuwsbrief</p>
          {status.kind === 'success' ? (
            <div role="status">
              <h2 id="nb-title" className={styles.title}>
                Bijna <span className="accent-green">klaar!</span>
              </h2>
              <p id="nb-text" className={styles.text}>
                Bevestig je inschrijving via de mail in je inbox. Geen mail gezien? Kijk ook even in je spammap.
              </p>
              <Button type="button" icon={null} onClick={() => setOpen(false)}>
                Sluiten
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <h2 id="nb-title" className={styles.title}>
                Blijf op de <span className="accent-green">hoogte.</span>
              </h2>
              <p id="nb-text" className={styles.text}>
                Wil je praktische tips over social media, content en campagnes in je inbox? Meld je aan voor de nieuwsbrief van YorSocials.
              </p>
              {status.kind === 'error' && (
                <div className={styles.status}>
                  <ErrorState title="Aanmelden niet gelukt" description={status.message} />
                </div>
              )}
              <label className={styles.label} htmlFor="nb-email">
                E-mailadres
              </label>
              <input
                id="nb-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={styles.input}
                placeholder="naam@bedrijf.nl"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'nb-email-error' : undefined}
              />
              {errors.email && (
                <p id="nb-email-error" className={styles.error}>
                  {errors.email}
                </p>
              )}
              <label className={styles.label} htmlFor="nb-voornaam" style={{ marginTop: 16 }}>
                Voornaam <span className={styles.optional}>(optioneel)</span>
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
                  Ja, stuur mij de nieuwsbrief. Afmelden kan altijd. Lees de <Link href="/privacy">privacyverklaring</Link>.
                </label>
              </div>
              {errors.consent && (
                <p id="nb-consent-error" className={styles.error}>
                  {errors.consent}
                </p>
              )}
              <div className={styles.actions}>
                <Button type="submit" disabled={status.kind === 'submitting'} icon={status.kind === 'submitting' ? 'loader' : 'arrowRight'}>
                  {status.kind === 'submitting' ? 'Bezig met aanmelden…' : 'Aanmelden'}
                </Button>
                <button type="button" className={styles.decline} onClick={dismiss}>
                  Nee, bedankt
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </dialog>
  );
}
