import type { ReactNode } from 'react';
import { backgroundClass } from './background';

/** Sectie-omhulsel voor een CMS-blok, met de achtergrond uit het `bg`-token. */
export function BlockSection({ bg, children, labelledBy }: { bg: string | null; children: ReactNode; labelledBy?: string }) {
  return (
    <section className={['section', backgroundClass(bg)].filter(Boolean).join(' ')} aria-labelledby={labelledBy}>
      <div className="container">{children}</div>
    </section>
  );
}
