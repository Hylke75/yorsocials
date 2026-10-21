import type { ReactNode } from 'react';
import { getSiteSettings } from '@/content/repository';
import { Annotation } from './Annotation';
import { BookingCTA } from './BookingCTA';
import { ButtonLink } from './Button';
import styles from './Blocks.module.css';

interface CTASectionProps {
  eyebrow?: string;
  heading?: ReactNode;
  body?: ReactNode;
  placement: string;
  /** Secundaire CTA naar het formulier; standaard aan. */
  secondary?: boolean;
}

export function CTASection({
  eyebrow = 'Klaar om te groeien?',
  heading = (
    <>
      Laten we iets <span className="accent-green">sterks</span> neerzetten.
    </>
  ),
  body = 'Of je nu net begint of al een gevestigd merk bent: we denken graag met je mee. Een helder gesprek is de beste eerste stap.',
  placement,
  secondary = true,
}: CTASectionProps) {
  // Zonder boekingslink wijzen beide knoppen naar het formulier; dan tonen we er één.
  const showSecondary = secondary && Boolean(getSiteSettings().bookingUrl);
  return (
    <section className={styles.cta} aria-labelledby={`cta-${placement}`}>
      <Annotation lines={['Zelfde energie?', 'Let’s talk.']} arrow className={styles.ctaAnnotation} />
      <div className={`container ${styles.ctaInner}`}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`cta-${placement}`} className="h2">
            {heading}
          </h2>
        </div>
        <div>
          <p className="lead">{body}</p>
          <div className="actions">
            <BookingCTA placement={`cta-${placement}`} />
            {showSecondary && (
              <ButtonLink href="/contact#formulier" variant="secondary" icon="mail" placement={`cta-${placement}-bericht`}>
                Stuur een bericht
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
