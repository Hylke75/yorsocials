import styles from './MarqueeTicker.module.css';

/** Doorlopende merkticker; statisch bij prefers-reduced-motion. */
export function MarqueeTicker({ items, label = 'Waar we mee helpen' }: { items: string[]; label?: string }) {
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        <ul className={styles.list} aria-label={label}>
          {[...items, ...items].map((item, i) => (
            <li
              key={`${item}-${i}`}
              className={[styles.item, i >= items.length && styles.duplicate].filter(Boolean).join(' ')}
              aria-hidden={i >= items.length ? true : undefined}
            >
              {item}
            </li>
          ))}
        </ul>
        <ul className={`${styles.list} ${styles.duplicate}`} aria-hidden="true">
          {[...items, ...items].map((item, i) => (
            <li key={`${item}-dup-${i}`} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
