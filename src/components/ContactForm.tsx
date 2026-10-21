'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { track } from '@/lib/analytics';
import {
  CONTACT_TOPICS,
  LIMITS,
  hasErrors,
  normalizeContactInput,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '@/lib/validation';
import { Button } from './Button';
import { ErrorState } from './ErrorState';
import { Icon } from './Icon';
import styles from './ContactForm.module.css';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; reference: string }
  | { kind: 'error'; title: string; message: string };

const FIELD_ORDER: ContactField[] = ['name', 'email', 'company', 'topic', 'message', 'privacy'];
const FIELD_LABELS: Record<ContactField, string> = {
  name: 'Naam',
  email: 'E-mailadres',
  company: 'Bedrijfsnaam',
  topic: 'Onderwerp',
  message: 'Bericht',
  privacy: 'Privacytoestemming',
};

/**
 * Contactformulier met client- én servervalidatie, honeypot + invultijd als antispam,
 * dubbele-verzendbeveiliging en eerlijke succes-/foutstatussen. Er wordt nooit
 * "verzonden" getoond als de server dat niet heeft bevestigd.
 */
export function ContactForm({ endpoint = '/api/contact' }: { endpoint?: string }) {
  const params = useSearchParams();
  const presetTopic = params.get('onderwerp');
  const initialTopic = presetTopic && (CONTACT_TOPICS as readonly string[]).includes(presetTopic) ? presetTopic : '';

  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [showSummary, setShowSummary] = useState(false);
  const startedAt = useRef<number>(0);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (showSummary) summaryRef.current?.focus();
  }, [showSummary, errors]);

  useEffect(() => {
    if (status.kind === 'success' || status.kind === 'error') resultRef.current?.focus();
  }, [status]);

  function onFirstInput() {
    if (started.current) return;
    started.current = true;
    track('form_start', { placement: 'contact' });
  }

  function collect(form: HTMLFormElement) {
    const fd = new FormData(form);
    return {
      name: fd.get('name'),
      email: fd.get('email'),
      company: fd.get('company'),
      topic: fd.get('topic'),
      message: fd.get('message'),
      privacy: fd.get('privacy') === 'on',
      website: fd.get('website'),
      startedAt: startedAt.current,
    };
  }

  function onBlur(field: ContactField) {
    const form = formRef.current;
    if (!form || !(field in errors)) return;
    // Na een eerste poging: fouten live bijwerken zodra een veld is verbeterd.
    const fieldErrors = validateContact(normalizeContactInput(collect(form)));
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldErrors[field]) next[field] = fieldErrors[field];
      else delete next[field];
      return next;
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === 'submitting') return;
    const raw = collect(e.currentTarget);
    const clientErrors = validateContact(normalizeContactInput(raw));
    setErrors(clientErrors);
    if (hasErrors(clientErrors)) {
      setShowSummary(true);
      track('form_submit_error', { error: 'validation' });
      return;
    }
    setShowSummary(false);
    setStatus({ kind: 'submitting' });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(raw),
      });
      const data = (await res.json().catch(() => ({}))) as {
        status?: string;
        reference?: string;
        errors?: ContactErrors;
        message?: string;
        code?: string;
      };

      if (res.ok && data.status === 'sent') {
        setStatus({ kind: 'success', reference: data.reference ?? '' });
        track('form_submit_success', { placement: 'contact', topic: String(raw.topic ?? '') });
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setShowSummary(true);
        setStatus({ kind: 'idle' });
        track('form_submit_error', { error: 'server_validation' });
        return;
      }
      track('form_submit_error', { error: data.code ?? String(res.status) });
      setStatus({
        kind: 'error',
        title: res.status === 503 ? 'Formulier nog niet gekoppeld' : 'Verzenden is niet gelukt',
        message: data.message ?? 'Je bericht is niet verzonden. Probeer het opnieuw.',
      });
    } catch {
      track('form_submit_error', { error: 'network' });
      setStatus({
        kind: 'error',
        title: 'Geen verbinding',
        message: 'Je bericht is niet verzonden. Controleer je internetverbinding en probeer het opnieuw.',
      });
    }
  }

  if (status.kind === 'success') {
    return (
      <div className={styles.success} ref={resultRef} tabIndex={-1} role="status" data-testid="contact-success">
        <Icon name="check" size={32} />
        <h2 className="h3" style={{ marginTop: 14 }}>
          Bedankt, je bericht is verzonden.
        </h2>
        <p>We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op via het opgegeven e-mailadres.</p>
        {status.reference && <p className="muted">Referentie: {status.reference}</p>}
      </div>
    );
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const describedBy = (f: ContactField, hint?: string) =>
    [hint, errors[f] ? `${f}-error` : null].filter(Boolean).join(' ') || undefined;
  const fieldError = (f: ContactField) =>
    errors[f] ? (
      <p id={`${f}-error`} className={styles.error}>
        <Icon name="alert" size={16} />
        <span>{errors[f]}</span>
      </p>
    ) : null;

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit} onInput={onFirstInput} aria-labelledby="form-title" id="formulier">
      <p className="eyebrow">Stuur een bericht</p>
      <h2 id="form-title">
        Laat hier je <span className="accent-green">gegevens achter.</span>
      </h2>

      {showSummary && errorList.length > 0 && (
        <div className={styles.summary} ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="error-summary-title">
          <h3 id="error-summary-title">Controleer de volgende {errorList.length === 1 ? 'gegevens' : `${errorList.length} velden`}:</h3>
          <ul>
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${f}`}>
                  {FIELD_LABELS[f]}: {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.kind === 'error' && (
        <div ref={resultRef} tabIndex={-1} style={{ marginBottom: 20 }}>
          <ErrorState
            title={status.title}
            description={
              <>
                {status.message}{' '}
                Je ingevulde gegevens zijn bewaard in het formulier.
              </>
            }
          />
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Naam <span aria-hidden="true">*</span>
          </label>
          <input id="name" name="name" className={styles.input} autoComplete="name" required maxLength={LIMITS.name} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} onBlur={() => onBlur('name')} />
          {fieldError('name')}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            E-mailadres <span aria-hidden="true">*</span>
          </label>
          <input id="email" name="email" type="email" inputMode="email" className={styles.input} autoComplete="email" required maxLength={LIMITS.email} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} onBlur={() => onBlur('email')} />
          {fieldError('email')}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="company">
          Bedrijfsnaam <span className={styles.optional}>(optioneel)</span>
        </label>
        <input id="company" name="company" className={styles.input} autoComplete="organization" maxLength={LIMITS.company} aria-invalid={Boolean(errors.company)} aria-describedby={describedBy('company')} />
        {fieldError('company')}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="topic">
          Waarmee kunnen we helpen? <span aria-hidden="true">*</span>
        </label>
        <select id="topic" name="topic" className={styles.input} required defaultValue={initialTopic} aria-invalid={Boolean(errors.topic)} aria-describedby={describedBy('topic')} onBlur={() => onBlur('topic')}>
          <option value="">Kies een onderwerp</option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {fieldError('topic')}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="message">
          Vertel kort over je plannen <span aria-hidden="true">*</span>
        </label>
        <textarea id="message" name="message" className={styles.input} required minLength={LIMITS.messageMin} maxLength={LIMITS.message} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy('message', 'message-hint')} onBlur={() => onBlur('message')} />
        <p id="message-hint" className={styles.footnote} style={{ marginTop: 6 }}>
          Minimaal {LIMITS.messageMin} tekens. Deel geen gevoelige persoonsgegevens.
        </p>
        {fieldError('message')}
      </div>

      {/* Honeypot: onzichtbaar voor mensen, aantrekkelijk voor bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <div className={styles.checkbox}>
          <input id="privacy" name="privacy" type="checkbox" required aria-invalid={Boolean(errors.privacy)} aria-describedby={describedBy('privacy')} />
          <label htmlFor="privacy">
            Ik ga akkoord met het verwerken van mijn gegevens voor deze aanvraag, zoals beschreven in de <Link href="/privacy">privacyverklaring</Link>.{' '}
            <span aria-hidden="true">*</span>
          </label>
        </div>
        {fieldError('privacy')}
      </div>

      <Button type="submit" fullWidth disabled={status.kind === 'submitting'} aria-disabled={status.kind === 'submitting'} icon={status.kind === 'submitting' ? 'loader' : 'arrowRight'}>
        {status.kind === 'submitting' ? 'Bezig met verzenden…' : status.kind === 'error' ? 'Opnieuw proberen' : 'Verstuur bericht'}
      </Button>
      <p className={styles.footnote}>Velden met * zijn verplicht.</p>
      <p className="visually-hidden" role="status" aria-live="polite">
        {status.kind === 'submitting' ? 'Bezig met verzenden' : ''}
      </p>
    </form>
  );
}
