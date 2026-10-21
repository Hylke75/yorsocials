'use client';

import Link from 'next/link';
import { Button } from '../Button';
import { useConsent } from './ConsentProvider';
import styles from './Consent.module.css';

/** Eerste-bezoekmelding. Accepteren en weigeren zijn even prominent (geen dark patterns). */
export function ConsentBanner() {
  const { acceptAll, rejectAll, openPreferences } = useConsent();
  return (
    <section className={styles.banner} aria-labelledby="consent-title" data-testid="consent-banner">
      <div>
        <h2 id="consent-title">Cookies op deze website</h2>
        <p>
          We gebruiken alleen noodzakelijke cookies, tenzij je toestemming geeft voor analytische cookies om de site te verbeteren. Lees meer in ons{' '}
          <Link href="/cookies">cookiebeleid</Link>.
        </p>
      </div>
      <div className={styles.buttons}>
        <Button size="small" variant="secondary" icon={null} onClick={rejectAll}>
          Alleen noodzakelijk
        </Button>
        <Button size="small" variant="secondary" icon={null} onClick={acceptAll}>
          Alles accepteren
        </Button>
        <button type="button" className={styles.linkButton} onClick={openPreferences}>
          Instellingen
        </button>
      </div>
    </section>
  );
}
