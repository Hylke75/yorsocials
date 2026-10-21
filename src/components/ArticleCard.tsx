import Link from 'next/link';
import type { Article } from '@/content/types';
import { DemoBadge } from './DemoBadge';
import { Icon } from './Icon';
import { MediaImage } from './MediaImage';
import { formatDate } from '@/lib/format';
import styles from './Card.module.css';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className={styles.card}>
      <MediaImage asset={article.heroImage} decorative sizes="(max-width: 740px) 100vw, (max-width: 1199px) 50vw, 420px" className={styles.photo} labelPlaceholder={false} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.num}>{article.category}</span>
          {article.status === 'demo' && <DemoBadge>Voorbeeld</DemoBadge>}
        </div>
        <h3 className={styles.title}>
          <Link href={`/artikelen/${article.slug}`} className={styles.link}>
            {article.title}
          </Link>
        </h3>
        <p>{article.excerpt}</p>
        {article.publishedAt && (
          <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </p>
        )}
        <span className={styles.more} aria-hidden="true">
          Lees artikel <Icon name="arrowUpRight" size={16} />
        </span>
      </div>
    </article>
  );
}
