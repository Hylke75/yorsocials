import { getGlobalContent, getSiteSettings } from '@/content/repository';
import type { CtaContent } from '@/content/types';
import { AccentText } from './AccentText';
import { Annotation } from './Annotation';
import { BookingCTA } from './BookingCTA';
import { ButtonLink } from './Button';
import styles from './Blocks.module.css';

interface CTASectionProps {
  content: CtaContent;
  placement: string;
  /** Secundaire CTA naar het formulier; standaard aan. */
  secondary?: boolean;
}

export function CTASection({ content, placement, secondary = true }: CTASectionProps) {
  const g = getGlobalContent();
  // Zonder boekingslink wijzen beide knoppen naar het formulier; dan tonen we er één.
  const showSecondary = secondary && Boolean(getSiteSettings().bookingUrl);
  return (
    <section className={styles.cta} aria-labelledby={`cta-${placement}`}>
      <Annotation lines={g.ctaAnnotation} arrow className={styles.ctaAnnotation} />
      <div className={`container ${styles.ctaInner}`}>
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id={`cta-${placement}`} className="h2">
            <AccentText text={content.heading} />
          </h2>
        </div>
        <div>
          <p className="lead">{content.body}</p>
          <div className="actions">
            <BookingCTA placement={`cta-${placement}`} />
            {showSecondary && (
              <ButtonLink href="/contact#formulier" variant="secondary" icon="mail" placement={`cta-${placement}-bericht`}>
                {g.messageLabel}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
