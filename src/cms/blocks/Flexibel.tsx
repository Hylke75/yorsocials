import type { CSSProperties } from 'react';
import { MediaImage } from '@/components/MediaImage';
import { SectionHeading } from '@/components/SectionHeading';
import { cmsAsset, list, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';
import styles from './Blocks.module.css';

/** `flexibel`: vrije sectie met 1–3 kolommen items (kop, tekst, optioneel beeld) — werkwijze, waarden, galerij. */
export function FlexibelBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const cols = Math.min(3, Math.max(1, Number(text(c, 'kolommen')) || 3));
  const items = list(c, 'items').filter((i) => text(i, 'kop') || text(i, 'tekst') || text(i, 'beeld'));
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow={text(c, 'eyebrow')} heading={text(c, 'titel')} description={text(c, 'intro') || undefined} />}
      <ul className={styles.items} style={{ '--cols': cols } as CSSProperties}>
        {items.map((item, i) => {
          const image = cmsAsset(text(item, 'beeld'), text(item, 'beeld_alt'));
          return (
            <li key={`${text(item, 'kop')}-${i}`} className={styles.item}>
              {image && <MediaImage asset={image} fill sizes={`(max-width: 740px) 100vw, ${Math.round(100 / cols)}vw`} className={styles.itemImage} labelPlaceholder={false} />}
              {(text(item, 'kop') || text(item, 'tekst')) && (
                <div className={styles.itemBody}>
                  {text(item, 'kop') && <h3 className="h3">{text(item, 'kop')}</h3>}
                  {text(item, 'tekst') && <p>{text(item, 'tekst')}</p>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </BlockSection>
  );
}
