'use client';

import { useEffect } from 'react';
import { Icon } from './Icon';
import styles from './States.module.css';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  durationMs?: number;
}

export function Toast({ message, onClose, durationMs = 7000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [message, onClose, durationMs]);

  return (
    <div aria-live="polite" role="status">
      {message && (
        <div className={styles.toast}>
          <Icon name="info" size={20} />
          <p>{message}</p>
          <button type="button" className={styles.toastClose} onClick={onClose} aria-label="Melding sluiten">
            <Icon name="close" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
