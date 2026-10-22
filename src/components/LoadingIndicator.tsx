import { Icon } from './Icon';
import styles from './States.module.css';

export function LoadingIndicator({ label = 'Bezig met laden…' }: { label?: string }) {
  return (
    <span className={styles.loading} role="status">
      <Icon name="loader" size={20} className={styles.spinner} />
      <span>{label}</span>
    </span>
  );
}
