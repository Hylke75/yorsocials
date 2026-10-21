'use client';

import Link from 'next/link';
import type { GlobalContent } from '@/content/types';
import { Button } from '../Button';
import { useConsent } from './ConsentProvider';
import styles from './Consent.module.css';

/** Eerste-bezoekmelding. Accepteren en weigeren zijn even prominent (geen dark patterns). */
export function ConsentBanner({ content: t }: { content: GlobalContent['consentBanner'] }) {
  const { acceptAll, rejectAll, openPreferences } = useConsent();
  return (
    <section className={styles.banner} aria-labelledby="consent-title" data-testid="consent-banner">
      <div>
        <h2 id="consent-title">{t.title}</h2>
        <p>
          {t.text} <Link href="/cookies">{t.policyLinkLabel}</Link>.
        </p>
      </div>
      <div className={styles.buttons}>
        <Button size="small" variant="secondary" icon={null} onClick={rejectAll}>
          {t.rejectLabel}
        </Button>
        <Button size="small" variant="secondary" icon={null} onClick={acceptAll}>
          {t.acceptLabel}
        </Button>
        <button type="button" className={styles.linkButton} onClick={openPreferences}>
          {t.settingsLabel}
        </button>
      </div>
    </section>
  );
}
