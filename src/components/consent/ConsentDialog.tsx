'use client';

import { useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { ConsentPreferences } from './ConsentPreferences';
import { useConsent } from './ConsentProvider';
import styles from './Consent.module.css';

/** Native <dialog>: focus-trap, Escape en terugkeer van focus zitten in de browser. */
export function ConsentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const title = useConsent().texts.preferences.title;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="consent-dialog-title" onClose={onClose}>
      <div className={styles.dialogInner}>
        <div className={styles.dialogHead}>
          <h2 id="consent-dialog-title">{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Sluiten">
            <Icon name="close" size={22} />
          </button>
        </div>
        {open && <ConsentPreferences variant="dialog" />}
      </div>
    </dialog>
  );
}
