import { SectionHeading } from '@/components/SectionHeading';
import blockStyles from '@/components/Blocks.module.css';
import { list, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';

/** `feiten`: label → waarde (bijv. resultaten met bron/periode, door de redacteur ingevuld). */
export function FeitenBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const facts = list(c, 'feiten').filter((f) => text(f, 'label') && text(f, 'waarde'));
  if (!facts.length) return null;
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow="" heading={text(c, 'titel')} description={text(c, 'intro') || undefined} />}
      <dl className={blockStyles.stats}>
        {facts.map((f) => (
          <div key={text(f, 'label')} className={blockStyles.stat}>
            <dt>{text(f, 'label')}</dt>
            <dd className={blockStyles.statValue}>{text(f, 'waarde')}</dd>
          </div>
        ))}
      </dl>
    </BlockSection>
  );
}
