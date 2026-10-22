import type { ReactNode } from 'react';
import { Icon, type AnyIconName } from './Icon';
import styles from './States.module.css';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: AnyIconName;
}

export function EmptyState({ title, description, action, icon = 'search' }: EmptyStateProps) {
  return (
    <div className={styles.state} role="status">
      <Icon name={icon} size={28} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
