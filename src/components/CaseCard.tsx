import Link from 'next/link';
import { getApprovedResults, getDisplayClientName, getGlobalContent, getSectorLabel } from '@/content/repository';
import type { CaseStudy } from '@/content/types';
import { DemoBadge } from './DemoBadge';
import { Icon } from './Icon';
import { MediaImage } from './MediaImage';
import styles from './Card.module.css';

export function CaseCard({ item }: { item: CaseStudy }) {
  const client = getDisplayClientName(item);
  const metrics = getApprovedResults(item).slice(0, 2);
  const g = getGlobalContent();
  return (
    <article className={styles.card}>
      <MediaImage asset={item.heroImage} decorative sizes="(max-width: 740px) 100vw, 50vw" className={styles.photo} labelPlaceholder={false} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.tag}>{getSectorLabel(item.sector)}</span>
          {item.status === 'demo' && <DemoBadge>{g.demoBadge}</DemoBadge>}
        </div>
        {client && <p className={styles.num}>{client}</p>}
        <h3 className={styles.title}>
          <Link href={`/cases/${item.slug}`} className={styles.link}>
            {item.title}
          </Link>
        </h3>
        <p>{item.summary}</p>
        {metrics.length > 0 && (
          <ul aria-label="Resultaten" style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', gap: 18 }}>
            {metrics.map((m) => (
              <li key={m.metric}>
                <strong style={{ color: 'var(--color-brand-sage-light)' }}>
                  {m.value}
                  {m.unit}
                </strong>{' '}
                <span className="muted">{m.metric}</span>
              </li>
            ))}
          </ul>
        )}
        <span className={styles.more} aria-hidden="true">
          {g.cardLinks.caseStudy} <Icon name="arrowUpRight" size={16} />
        </span>
      </div>
    </article>
  );
}
