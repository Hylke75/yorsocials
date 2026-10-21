import type { ReactNode } from 'react';
import type { LegalPage } from '@/content/types';
import { Breadcrumbs } from './Breadcrumbs';
import { HeroEditorial } from './HeroEditorial';
import styles from './LegalPageTemplate.module.css';

/** Juridische pagina. Zolang de status niet `published` is, blijft de pagina noindex (zie de page-metadata). */
export function LegalPageTemplate({ page, children }: { page: LegalPage; children?: ReactNode }) {
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: page.title, href: `/${page.slug}` }]} />}
        eyebrow={page.eyebrow}
        heading={page.title}
        size="compact"
      />
      <section className="section">
        <div className={`container ${styles.legal}`}>
          {page.lastReviewed && (
            <p className="muted" style={{ fontSize: 14 }}>
              Versie {page.version} · laatst bijgewerkt op {page.lastReviewed}
            </p>
          )}
          {page.sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ))}
          {children}
        </div>
      </section>
    </>
  );
}
