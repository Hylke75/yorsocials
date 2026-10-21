import type { ReactNode } from 'react';
import { AccentText } from './AccentText';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow: string;
  /** String met mini-opmaak (`*accent*`, \n) of eigen JSX. */
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
          {typeof heading === 'string' ? <AccentText text={heading} /> : heading}
        </Tag>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
