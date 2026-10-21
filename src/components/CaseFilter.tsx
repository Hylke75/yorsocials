'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import type { Sector } from '@/content/types';
import { track } from '@/lib/analytics';
import { ALL_SECTORS, parseSectorParam, sectorHref } from '@/lib/caseFilter';
import { EmptyState } from './EmptyState';
import styles from './CaseFilter.module.css';

export interface FilterableItem {
  slug: string;
  sector: string;
  /** Server-gerenderde kaart. */
  card: ReactNode;
}

interface CaseFilterProps {
  items: FilterableItem[];
  sectors: Sector[];
  emptyAction?: ReactNode;
}

/** Sectorfilter met de keuze in de URL (?sector=…), zodat filters deelbaar en terug-navigeerbaar zijn. */
export function CaseFilter({ items, sectors, emptyAction }: CaseFilterProps) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const active = parseSectorParam(params.get('sector'), sectors);

  const visible = useMemo(() => (active === ALL_SECTORS ? items : items.filter((i) => i.sector === active)), [items, active]);
  const options = [{ id: ALL_SECTORS, label: 'Alle cases' }, ...sectors];
  const activeLabel = options.find((o) => o.id === active)?.label ?? '';

  function select(id: string) {
    router.replace(sectorHref(pathname, id), { scroll: false });
    track('case_filter', { sector: id });
  }

  return (
    <div>
      <p className="eyebrow" id="filter-label">
        Filter op sector
      </p>
      <div className={styles.filters} role="group" aria-labelledby="filter-label">
        {options.map((o) => (
          <button key={o.id} type="button" className={styles.filter} aria-pressed={o.id === active} onClick={() => select(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className={styles.count} aria-live="polite" data-testid="case-count">
        {visible.length === 1 ? '1 case' : `${visible.length} cases`}
        {active !== ALL_SECTORS && ` in ${activeLabel}`}
      </p>
      {visible.length > 0 ? (
        <ul className="grid grid--2" style={{ listStyle: 'none', padding: 0, margin: 0 }} data-testid="case-grid">
          {visible.map((i) => (
            <li key={i.slug} style={{ display: 'grid' }}>
              {i.card}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={`Nog geen cases in ${activeLabel}`}
          description="We voegen hier cases toe zodra ze met toestemming van de klant gepubliceerd kunnen worden. Benieuwd wat we voor jouw merk kunnen doen?"
          action={emptyAction}
        />
      )}
    </div>
  );
}
