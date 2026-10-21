import { AccentText } from '@/components/AccentText';
import { formatDate } from '@/lib/format';
import { text } from './fields';
import type { BlockProps } from './props';
import { RichText } from './RichText';
import { BlockSection } from './Section';
import styles from './Blocks.module.css';

/** `tekst`: eyebrow, titel, rijke tekst en optioneel "laatst bijgewerkt" (bijv. juridische pagina's). */
export function TekstBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const updated = text(c, 'bijgewerkt');
  const validDate = updated && !Number.isNaN(Date.parse(updated));
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'eyebrow') && <p className="eyebrow">{text(c, 'eyebrow')}</p>}
      {text(c, 'titel') && (
        <h2 id={id} className="h2">
          <AccentText text={text(c, 'titel')} />
        </h2>
      )}
      {validDate && (
        <p className={styles.updated}>
          Laatst bijgewerkt op <time dateTime={updated}>{formatDate(updated)}</time>
        </p>
      )}
      <RichText value={c.tekst} className={styles.prose} />
    </BlockSection>
  );
}
