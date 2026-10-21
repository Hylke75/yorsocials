import styles from './DemoBadge.module.css';

/** Markeert demo-/placeholdercontent expliciet (staging). */
export function DemoBadge({ children, className }: { children: string; className?: string }) {
  return <span className={[styles.badge, className].filter(Boolean).join(' ')}>{children}</span>;
}
