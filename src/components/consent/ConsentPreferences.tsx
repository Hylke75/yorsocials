'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '../Button';
import { fillTemplate } from '@/lib/text';
import { useConsent, type ConsentTexts } from './ConsentProvider';
import styles from './Consent.module.css';

function formatStatus(consent: ReturnType<typeof useConsent>['consent'], t: ConsentTexts['preferences']): string {
  if (consent === undefined) return t.loadingMessage;
  if (consent === null) return t.noChoiceMessage;
  const when = consent.updatedAt ? ` (${new Date(consent.updatedAt).toLocaleString('nl-NL')})` : '';
  return fillTemplate(t.currentChoiceMessage, { status: consent.analytics ? t.allowedWord : t.deniedWord, date: when });
}

/** Formulier met cookiecategorieën; gebruikt in de dialoog én inline op /cookies. */
export function ConsentPreferences({ variant = 'inline' }: { variant?: 'inline' | 'dialog' }) {
  const { consent, save, texts } = useConsent();
  const t = texts.preferences;
  const [saved, setSaved] = useState(false);
  // Key op de opgeslagen keuze, zodat het formulier na opslaan/laden de actuele waarde toont.
  return (
    <PreferencesForm
      key={consent ? consent.updatedAt : String(consent)}
      variant={variant}
      initial={Boolean(consent?.analytics)}
      status={saved ? t.savedMessage : formatStatus(consent, t)}
      texts={t}
      onSave={(choice) => {
        save(choice);
        setSaved(true);
      }}
    />
  );
}

function PreferencesForm({
  variant,
  initial,
  status,
  onSave,
  texts: t,
}: {
  variant: 'inline' | 'dialog';
  initial: boolean;
  status: string;
  onSave: (c: { analytics: boolean; marketing: boolean }) => void;
  texts: ConsentTexts['preferences'];
}) {
  const [analytics, setAnalytics] = useState(initial);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({ analytics, marketing: false });
  }

  return (
    <form onSubmit={submit} className={variant === 'inline' ? styles.inline : undefined} aria-label={t.title}>
      <p className={styles.status} aria-live="polite">
        {status}
      </p>
      <fieldset className={styles.categories}>
        <legend className="visually-hidden">Cookiecategorieën</legend>
        <div className={styles.category}>
          <input type="checkbox" id={`${variant}-necessary`} checked disabled />
          <div>
            <label htmlFor={`${variant}-necessary`}>{t.necessaryLabel}</label>
            <p>{t.necessaryDescription}</p>
          </div>
        </div>
        <div className={styles.category}>
          <input type="checkbox" id={`${variant}-analytics`} checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          <div>
            <label htmlFor={`${variant}-analytics`}>{t.analyticsLabel}</label>
            <p>{t.analyticsDescription}</p>
          </div>
        </div>
        <div className={styles.category}>
          <input type="checkbox" id={`${variant}-marketing`} checked={false} disabled aria-describedby={`${variant}-marketing-desc`} />
          <div>
            <label htmlFor={`${variant}-marketing`}>{t.marketingLabel}</label>
            <p id={`${variant}-marketing-desc`}>{t.marketingDescription}</p>
          </div>
        </div>
      </fieldset>
      <Button type="submit" icon={null}>
        {t.saveLabel}
      </Button>
    </form>
  );
}
