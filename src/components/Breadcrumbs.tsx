import Link from 'next/link';
import type { Crumb } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/seo';
import { Icon } from './Icon';
import { JsonLd } from './JsonLd';
import styles from './Breadcrumbs.module.css';

/** Kruimelpad + BreadcrumbList structured data. Laatste item is de huidige pagina. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Home', href: '/' }, ...items];
  return (
    <nav aria-label="Kruimelpad" className={styles.nav}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className={styles.list}>
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href}>
              {last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <>
                  <Link href={c.href}>{c.name}</Link>
                  <Icon name="chevronRight" size={14} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
