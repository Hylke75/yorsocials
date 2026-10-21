import type { ReactNode } from 'react';
import type { MediaAsset } from '@/content/types';
import { AccentText } from './AccentText';
import { Annotation } from './Annotation';
import { MediaImage } from './MediaImage';
import styles from './HeroEditorial.module.css';

interface HeroEditorialProps {
  eyebrow: string;
  /** De enige H1 van de pagina. */
  heading: ReactNode;
  description?: ReactNode;
  image?: MediaAsset;
  actions?: ReactNode;
  annotation?: string[];
  size?: 'large' | 'compact';
  /** Extra inhoud onder de beschrijving (bijv. demobadge of breadcrumbs). */
  children?: ReactNode;
  before?: ReactNode;
  /** Alleen de eerste hero van een pagina is de H1. */
  headingLevel?: 'h1' | 'h2';
}

export function HeroEditorial({ eyebrow, heading, description, image, actions, annotation, size = 'large', children, before, headingLevel = 'h1' }: HeroEditorialProps) {
  const H = headingLevel;
  const headingId = headingLevel === 'h1' ? 'page-title' : undefined;
  return (
    <section className={[styles.hero, size === 'compact' && styles.compact].filter(Boolean).join(' ')} aria-labelledby={headingId}>
      {image && (
        <MediaImage asset={image} fill priority sizes="(max-width: 740px) 100vw, 65vw" className={styles.media} imageClassName={styles.mediaImg} decorative />
      )}
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          {before}
          <p className="eyebrow">{eyebrow}</p>
          <H id={headingId} className="h1">
            {typeof heading === 'string' ? <AccentText text={heading} /> : heading}
          </H>
          {description && <p className={styles.description}>{description}</p>}
          {children}
          {actions && <div className="actions">{actions}</div>}
        </div>
        {annotation && <Annotation lines={annotation} className={styles.annotation} />}
      </div>
    </section>
  );
}
