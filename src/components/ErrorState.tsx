import type { ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './States.module.css';

export function ErrorState({ title, description, action, id }: { title: string; description?: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className={`${styles.state} ${styles.error}`} role="alert" id={id} tabIndex={-1}>
      <Icon name="alert" size={28} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
