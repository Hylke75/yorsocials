import styles from './Annotation.module.css';

interface AnnotationProps {
  lines: string[];
  variant?: 'underline' | 'circle';
  arrow?: boolean;
  className?: string;
}

/**
 * Handgetekend accent (spaarzaam gebruiken). Puur decoratief: de inhoud staat altijd ook
 * elders in tekst, daarom aria-hidden.
 */
export function Annotation({ lines, variant = 'underline', arrow = true, className }: AnnotationProps) {
  return (
    <span className={[styles.annotation, variant === 'circle' && styles.circle, className].filter(Boolean).join(' ')} aria-hidden="true">
      {variant === 'circle' && (
        <svg className={styles.ring} viewBox="0 0 200 80" preserveAspectRatio="none" fill="none">
          <path
            d="M18 44C10 22 60 6 112 8c48 2 84 14 82 34-2 22-56 32-104 30C40 70 4 60 12 38 18 24 44 14 70 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
      {variant === 'underline' && (
        <svg className={styles.swoosh} viewBox="0 0 160 14" preserveAspectRatio="none" fill="none">
          <path d="M3 10C40 3 90 2 157 6M20 12c30-3 60-4 96-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {arrow && (
        <svg className={styles.arrow} viewBox="0 0 40 40" fill="none">
          <path d="M8 4c-4 14 2 26 22 28m0 0-7-7m7 7-8 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}
