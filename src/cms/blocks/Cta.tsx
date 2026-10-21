import { AccentText } from '@/components/AccentText';
import { Annotation } from '@/components/Annotation';
import blockStyles from '@/components/Blocks.module.css';
import { BookingCTA } from '@/components/BookingCTA';
import { ButtonLink } from '@/components/Button';
import { getGlobalContent } from '@/content/repository';
import { list, text } from './fields';
import type { BlockProps } from './props';
import styles from './Blocks.module.css';

/** `cta`: afsluitende oproep (eyebrow, titel, tekst, knop, meta-regels). Zonder knop → kennismakingsknop. */
export function CtaBlock({ block, index, page }: BlockProps) {
  const c = block.content;
  const id = `cta-blok-${index}`;
  const meta = list(c, 'meta')
    .map((m) => text(m, 'tekst'))
    .filter(Boolean);
  return (
    <section className={blockStyles.cta} aria-labelledby={id}>
      <Annotation lines={getGlobalContent().ctaAnnotation} arrow className={blockStyles.ctaAnnotation} />
      <div className={`container ${blockStyles.ctaInner}`}>
        <div>
          {text(c, 'eyebrow') && <p className="eyebrow">{text(c, 'eyebrow')}</p>}
          <h2 id={id} className="h2">
            <AccentText text={text(c, 'titel')} />
          </h2>
        </div>
        <div>
          {text(c, 'tekst') && <p className="lead">{text(c, 'tekst')}</p>}
          <div className="actions">
            {text(c, 'knop') && text(c, 'knoptekst') ? (
              <ButtonLink href={text(c, 'knop')} placement={`cms-cta${page.slug}`}>
                {text(c, 'knoptekst')}
              </ButtonLink>
            ) : (
              <BookingCTA placement={`cms-cta${page.slug}`} />
            )}
          </div>
          {meta.length > 0 && (
            <ul className={styles.metaList}>
              {meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
