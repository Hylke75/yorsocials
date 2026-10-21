'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '../Button';
import { useConsent } from './ConsentProvider';
import styles from './Consent.module.css';

function formatStatus(consent: ReturnType<typeof useConsent>['consent']): string {
  if (consent === undefined) return 'Je voorkeur wordt geladen…';
  if (consent === null) return 'Je hebt nog geen keuze gemaakt. Er worden alleen noodzakelijke cookies gebruikt.';
  const when = consent.updatedAt ? new Date(consent.updatedAt).toLocaleString('nl-NL') : '';
  return `Huidige keuze: analytische cookies ${consent.analytics ? 'toegestaan' : 'geweigerd'}${when ? ` (opgeslagen op ${when})` : ''}.`;
}

/** Formulier met cookiecategorieën; gebruikt in de dialoog én inline op /cookies. */
export function ConsentPreferences({ variant = 'inline' }: { variant?: 'inline' | 'dialog' }) {
  const { consent, save } = useConsent();
  const [saved, setSaved] = useState(false);
  // Key op de opgeslagen keuze, zodat het formulier na opslaan/laden de actuele waarde toont.
  return (
    <PreferencesForm
      key={consent ? consent.updatedAt : String(consent)}
      variant={variant}
      initial={Boolean(consent?.analytics)}
      status={saved ? 'Je voorkeuren zijn opgeslagen.' : formatStatus(consent)}
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
}: {
  variant: 'inline' | 'dialog';
  initial: boolean;
  status: string;
  onSave: (c: { analytics: boolean; marketing: boolean }) => void;
}) {
  const [analytics, setAnalytics] = useState(initial);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({ analytics, marketing: false });
  }

  return (
    <form onSubmit={submit} className={variant === 'inline' ? styles.inline : undefined} aria-label="Cookievoorkeuren">
      <p className={styles.status} aria-live="polite">
        {status}
      </p>
      <fieldset className={styles.categories}>
        <legend className="visually-hidden">Cookiecategorieën</legend>
        <div className={styles.category}>
          <input type="checkbox" id={`${variant}-necessary`} checked disabled />
          <div>
            <label htmlFor={`${variant}-necessary`}>Noodzakelijk (altijd aan)</label>
            <p>Nodig om de website te laten werken en je cookiekeuze te onthouden.</p>
          </div>
        </div>
        <div className={styles.category}>
          <input type="checkbox" id={`${variant}-analytics`} checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          <div>
            <label htmlFor={`${variant}-analytics`}>Analytisch</label>
            <p>Anonieme statistieken over het gebruik van de site, zodat we die kunnen verbeteren.</p>
          </div>
        </div>
        <div className={styles.category}>
          <input type="checkbox" id={`${variant}-marketing`} checked={false} disabled aria-describedby={`${variant}-marketing-desc`} />
          <div>
            <label htmlFor={`${variant}-marketing`}>Marketing</label>
            <p id={`${variant}-marketing-desc`}>Momenteel niet in gebruik op deze website.</p>
          </div>
        </div>
      </fieldset>
      <Button type="submit" icon={null}>
        Voorkeuren opslaan
      </Button>
    </form>
  );
}
