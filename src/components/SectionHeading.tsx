import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow: string;
  /** Mag spans met accentkleur bevatten. */
  heading: ReactNode;
  description?: ReactNode;
  alignment?: 'split' | 'center';
  id?: string;
  as?: 'h1' | 'h2';
}

export function SectionHeading({ eyebrow, heading, description, alignment = 'split', id, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className={[styles.head, alignment === 'center' && styles.center].filter(Boolean).join(' ')}>
      <div>
        <div className={styles.eyebrowWrap}>
          <p className="eyebrow">{eyebrow}</p>
        </div>
        <Tag id={id} className="h2">
          {heading}
        </Tag>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
