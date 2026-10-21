import Link from 'next/link';
import { getGlobalContent } from '@/content/repository';
import type { Service } from '@/content/types';
import { fillTemplate } from '@/lib/text';
import { Icon } from './Icon';
import { MediaImage } from './MediaImage';
import styles from './Card.module.css';

export function ServiceCard({ service, headingLevel = 'h3' }: { service: Service; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const g = getGlobalContent();
  return (
    <article className={`${styles.card} ${styles.service}`}>
      <MediaImage asset={service.heroImage} fill decorative sizes="(max-width: 740px) 100vw, (max-width: 1199px) 50vw, 420px" className={styles.serviceBg} labelPlaceholder={false} />
      <div className={styles.body}>
        <span className={styles.num}>{fillTemplate(g.serviceNumberLabel, { number: service.number })}</span>
        <Icon name={service.icon} size={36} className={styles.icon} />
        <H className={styles.title}>
          <Link href={`/services/${service.slug}`} className={styles.link}>
            {service.title}
          </Link>
        </H>
        <p>{service.summary}</p>
        <span className={styles.more} aria-hidden="true">
          {g.cardLinks.service} <Icon name="arrowUpRight" size={16} />
        </span>
      </div>
    </article>
  );
}
