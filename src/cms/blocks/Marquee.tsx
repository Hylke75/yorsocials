import { MarqueeTicker } from '@/components/MarqueeTicker';
import { list, text } from './fields';
import type { BlockProps } from './props';

/** `marquee`: bewegende tekstband (staat stil bij prefers-reduced-motion). */
export function MarqueeBlock({ block }: BlockProps) {
  const items = list(block.content, 'items')
    .map((i) => text(i, 'tekst'))
    .filter(Boolean);
  return items.length ? <MarqueeTicker items={items} /> : null;
}
