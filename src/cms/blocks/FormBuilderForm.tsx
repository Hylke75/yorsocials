'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { Icon } from '@/components/Icon';
import formStyles from '@/components/ContactForm.module.css';
import { track } from '@/lib/analytics';
import { fieldKey, isFieldVisible, missingRequired, toLead, type FieldDef } from '@/lib/formBuilder';
import { isValidEmail } from '@/lib/validation';
import { RichText } from './RichText';

interface Props {
  fields: FieldDef[];
  submitLabel: string;
  confirmation: string;
  footnote: string;
  page: string;
}

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'error'; message: string };

/** Formulier uit het CMS-blok `formulier_bouwer`: redacteur bepaalt de velden, e-mail is altijd aanwezig. */
export function FormBuilderForm({ fields, submitLabel, confirmation, footnote, page }: Props) {
  const params = useSearchParams();
  // Links als /contact?onderwerp=Paid%20social vullen het eerste keuzeveld met die optie voor.
  const [values, setValues] = useState<Record<string, string>>(() => {
    const preset = params.get('onderwerp');
    const index = fields.findIndex((f) => f.type === 'keuze' && preset && f.options.includes(preset));
    const field = fields[index];
    return preset && field ? { [fieldKey(field.label, index)]: preset } : {};
  });
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const startedAt = useRef(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.kind === 'success' || status.kind === 'error') resultRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === 'submitting') return;
    const next: Record<string, string> = {};
    const missing = new Set(missingRequired(fields, values));
    fields.forEach((f, i) => {
      if (missing.has(f.label)) next[fieldKey(f.label, i)] = `Vul ${f.label.toLowerCase()} in.`;
    });
    if (!email.trim()) next.email = 'Vul je e-mailadres in.';
    else if (!isValidEmail(email.trim().toLowerCase())) next.email = 'Vul een geldig e-mailadres in.';
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      track('form_submit_error', { error: 'validation' });
      return;
    }
    setStatus({ kind: 'submitting' });
    const honeypot = String(new FormData(e.currentTarget).get('_website') ?? '');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...toLead(fields, values), email: email.trim(), bron_pagina: page, _website: honeypot, _ts: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; melding?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: 'success' });
        track('form_submit_success', { placement: 'formulier_bouwer' });
      } else {
        setStatus({ kind: 'error', message: data.melding ?? 'Verzenden is niet gelukt. Probeer het opnieuw.' });
        track('form_submit_error', { error: String(res.status) });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Geen verbinding. Je aanvraag is níet verzonden.' });
    }
  }

  if (status.kind === 'success') {
    return (
      <div className={formStyles.success} ref={resultRef} tabIndex={-1} role="status">
        <Icon name="check" size={32} />
        <p style={{ marginTop: 14 }}>{confirmation}</p>
      </div>
    );
  }

  const errorKeys = Object.keys(errors);
  const fieldError = (key: string) =>
    errors[key] ? (
      <p id={`fb-${key}-error`} className={formStyles.error}>
        <Icon name="alert" size={16} />
        <span>{errors[key]}</span>
      </p>
    ) : null;
  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const rest = { ...prev };
      delete rest[key];
      return rest;
    });

  return (
    <form id="formulier" className={formStyles.form} noValidate onSubmit={onSubmit}>
      {errorKeys.length > 0 && (
        <div className={formStyles.summary} ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="fb-summary-title">
          <h3 id="fb-summary-title">Controleer de volgende {errorKeys.length === 1 ? 'gegevens' : `${errorKeys.length} velden`}:</h3>
          <ul>
            {errorKeys.map((k) => (
              <li key={k}>
                <a href={`#fb-${k}`}>{errors[k]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {status.kind === 'error' && (
        <div ref={resultRef} tabIndex={-1} style={{ marginBottom: 20 }}>
          <ErrorState title="Verzenden is niet gelukt" description={<>{status.message} Je ingevulde gegevens zijn bewaard in het formulier.</>} />
        </div>
      )}
      {fields.map((f, i) => {
        if (!isFieldVisible(f, fields, values)) return null;
        const key = fieldKey(f.label, i);
        const id = `fb-${key}`;
        const common = {
          id,
          name: key,
          className: formStyles.input,
          required: f.required,
          value: values[key] ?? '',
          'aria-invalid': errors[key] ? true : undefined,
          'aria-describedby': errors[key] ? `${id}-error` : undefined,
        };
        const set = (v: string) => {
          setValues((prev) => ({ ...prev, [key]: v }));
          if (v.trim()) clearError(key);
        };
        return (
          <div key={key} className={formStyles.field}>
            <label className={formStyles.label} htmlFor={id}>
              {f.label} {f.required ? <span aria-hidden="true">*</span> : <span className={formStyles.optional}>(optioneel)</span>}
            </label>
            {f.type === 'tekstvak' ? (
              <textarea {...common} maxLength={4000} onChange={(e) => set(e.target.value)} />
            ) : f.type === 'keuze' ? (
              <select {...common} onChange={(e) => set(e.target.value)}>
                <option value="">Kies…</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                type={f.type === 'telefoon' ? 'tel' : 'text'}
                autoComplete={f.type === 'telefoon' ? 'tel' : f.type === 'bedrijf' ? 'organization' : f.label.toLowerCase().includes('naam') ? 'name' : undefined}
                maxLength={200}
                onChange={(e) => set(e.target.value)}
              />
            )}
            {fieldError(key)}
          </div>
        );
      })}
      <div className={formStyles.field}>
        <label className={formStyles.label} htmlFor="fb-email">
          E-mailadres <span aria-hidden="true">*</span>
        </label>
        <input
          id="fb-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className={formStyles.input}
          value={email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'fb-email-error' : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (isValidEmail(e.target.value.trim().toLowerCase())) clearError('email');
          }}
        />
        {fieldError('email')}
      </div>
      <div className={formStyles.honeypot} aria-hidden="true">
        <label htmlFor="fb-website">Website</label>
        <input id="fb-website" name="_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <Button type="submit" fullWidth disabled={status.kind === 'submitting'} icon={status.kind === 'submitting' ? 'loader' : 'arrowRight'}>
        {status.kind === 'submitting' ? 'Bezig met verzenden…' : submitLabel}
      </Button>
      {footnote && <RichText value={footnote} className={formStyles.footnote} />}
    </form>
  );
}
