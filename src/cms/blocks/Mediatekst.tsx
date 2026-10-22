import { AccentText } from '@/components/AccentText';
import { ButtonLink } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { FeatureImage } from '@/components/ServiceDetailIntro';
import { cmsAsset, list, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';
import styles from './Blocks.module.css';

/** `mediatekst`: tekst (alinea's + punten + knop) naast een beeld, beeld links of rechts. */
export function MediatekstBlock({ block, index, page }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const image = cmsAsset(text(c, 'beeld'), text(c, 'beeld_alt'));
  const paragraphs = list(c, 'alineas')
    .map((a) => text(a, 'tekst'))
    .filter(Boolean);
  const points = list(c, 'punten')
    .map((p) => text(p, 'tekst'))
    .filter(Boolean);
  const imageLeft = text(c, 'beeldzijde') === 'links';
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      <div className={['split', imageLeft ? '' : styles.reverse].filter(Boolean).join(' ')}>
        {image ? <FeatureImage image={image} /> : <div />}
        <div>
          {text(c, 'eyebrow') && <p className="eyebrow">{text(c, 'eyebrow')}</p>}
          {text(c, 'titel') && (
            <h2 id={id} className="h2">
              <AccentText text={text(c, 'titel')} />
            </h2>
          )}
          {paragraphs.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
          {points.length > 0 && (
            <ul className={styles.points}>
              {points.map((p) => (
                <li key={p}>
                  <Icon name="check" size={18} />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {text(c, 'knop') && text(c, 'knoptekst') && (
            <div className="actions">
              <ButtonLink href={text(c, 'knop')} placement={`cms-mediatekst${page.slug}`}>
                {text(c, 'knoptekst')}
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </BlockSection>
  );
}
