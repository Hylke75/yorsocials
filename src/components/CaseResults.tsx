import type { CaseResult } from '@/content/types';
import { Notice } from './Notice';
import styles from './Blocks.module.css';

/**
 * Toont uitsluitend goedgekeurde resultaten met bron en meetperiode.
 * Zonder geverifieerde cijfers: een eerlijke melding in plaats van verzonnen statistieken.
 */
export function CaseResults({ results }: { results: CaseResult[] }) {
  const approved = results.filter((r) => r.approved && r.source && r.period);
  if (approved.length === 0) {
    return (
      <Notice>
        <p>Voor deze case zijn (nog) geen geverifieerde resultaten gepubliceerd. Cijfers worden alleen getoond met bron, meetperiode en akkoord van de klant.</p>
      </Notice>
    );
  }
  return (
    <dl className={styles.stats}>
      {approved.map((r) => (
        <div key={r.metric} className={styles.stat}>
          <dt>{r.metric}</dt>
          <dd className={styles.statValue}>
            {r.value}
            {r.unit}
          </dd>
          <dd className={styles.statSource}>
            {r.period} · Bron: {r.source}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export { CaseResults as StatBlock };
