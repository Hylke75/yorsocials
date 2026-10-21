import type { ReactNode } from 'react';
import type { LegalPage } from '@/content/types';
import { Breadcrumbs } from './Breadcrumbs';
import { HeroEditorial } from './HeroEditorial';
import { Notice } from './Notice';
import styles from './LegalPageTemplate.module.css';

/** Juridische pagina. Zolang de status niet `published` is, staat er een duidelijke conceptmelding (en noindex). */
export function LegalPageTemplate({ page, children }: { page: LegalPage; children?: ReactNode }) {
  const isDraft = page.status !== 'published';
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: page.title, href: `/${page.slug}` }]} />}
        eyebrow={page.eyebrow}
        heading={page.title}
        size="compact"
        description={isDraft ? 'Concept — deze tekst is nog niet juridisch vastgesteld.' : undefined}
      />
      <section className="section">
        <div className={`container ${styles.legal}`}>
          {isDraft && (
            <Notice tone="demo">
              <p>
                <strong>Niet definitief.</strong> {page.intro}
              </p>
            </Notice>
          )}
          <p className="muted" style={{ fontSize: 14 }}>
            Versie {page.version}
            {page.lastReviewed ? ` · laatst beoordeeld op ${page.lastReviewed}` : ' · nog niet beoordeeld'}
          </p>
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
