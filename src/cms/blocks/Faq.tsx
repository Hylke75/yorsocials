import { AccordionFAQ } from '@/components/AccordionFAQ';
import { SectionHeading } from '@/components/SectionHeading';
import { list, slugify, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';

/** `faq`: vragen met antwoorden (`vragen`, of `items` volgens de oudere notatie). */
export function FaqBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const raw = list(c, 'vragen').length ? list(c, 'vragen') : list(c, 'items');
  const items = raw
    .filter((q) => text(q, 'vraag') && text(q, 'antwoord'))
    .map((q, i) => ({ id: `${slugify(text(q, 'vraag'))}-${i}`, question: text(q, 'vraag'), answer: text(q, 'antwoord') }));
  if (!items.length) return null;
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow="" heading={text(c, 'titel')} />}
      <AccordionFAQ items={items} defaultOpen={[items[0]!.id]} />
    </BlockSection>
  );
}
