'use client';

import { useId, useState } from 'react';
import { Icon } from './Icon';
import styles from './AccordionFAQ.module.css';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionFAQProps {
  items: AccordionItem[];
  /** Id's die standaard open staan. */
  defaultOpen?: string[];
  headingLevel?: 'h2' | 'h3';
}

/**
 * Toegankelijke accordeon (WAI-ARIA APG): <button> met aria-expanded/aria-controls,
 * bedienbaar met Tab/Enter/Spatie; antwoorden blijven in de DOM voor zoekmachines.
 */
export function AccordionFAQ({ items, defaultOpen = [], headingLevel = 'h3' }: AccordionFAQProps) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen));
  const baseId = useId();
  const H = headingLevel;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className={styles.item}>
            <H className={styles.heading}>
              <button
                type="button"
                id={triggerId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span>{item.question}</span>
                <Icon name="plus" size={22} className={styles.icon} />
              </button>
            </H>
            <div id={panelId} role="region" aria-labelledby={triggerId} className={styles.panel} hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
