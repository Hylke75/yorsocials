import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookingCTA } from '@/components/BookingCTA';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CaseCard } from '@/components/CaseCard';
import { CaseFilter } from '@/components/CaseFilter';
import { CTASection } from '@/components/CTASection';
import { EmptyState } from '@/components/EmptyState';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Notice } from '@/components/Notice';
import { getCases, getPages, getSectors } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const content = getPages().cases;

export const metadata: Metadata = buildMetadata({ ...content.seo, path: '/cases' });

export default function CasesPage() {
  const cases = getCases();
  const items = cases.map((c) => ({ slug: c.slug, sector: c.sector, card: <CaseCard item={c} /> }));
  const cta = <BookingCTA placement="cases-leeg" variant="secondary" />;
  const { hero } = content;

  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: content.seo.title, href: '/cases' }]} />}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        description={hero.description}
        image={hero.image}
        size="compact"
        annotation={hero.annotation}
      />

      <section className="section" aria-labelledby="alle-cases">
        <div className="container">
          <h2 id="alle-cases" className="visually-hidden">
            {content.seo.title}
          </h2>
          {cases.some((c) => c.status === 'demo') && (
            <Notice tone="demo">
              <p>{content.demoNotice}</p>
            </Notice>
          )}
          {cases.length === 0 ? (
            <EmptyState title={content.empty.title} description={content.empty.description} action={cta} />
          ) : (
            <Suspense
              fallback={
                <ul className="grid grid--2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {items.map((i) => (
                    <li key={i.slug} style={{ display: 'grid' }}>
                      {i.card}
                    </li>
                  ))}
                </ul>
              }
            >
              <CaseFilter
                items={items}
                sectors={getSectors()}
                emptyAction={cta}
                labels={{
                  filterLabel: content.filterLabel,
                  allLabel: content.filterAllLabel,
                  emptyTitle: content.filterEmptyTitle,
                  emptyDescription: content.filterEmptyDescription,
                }}
              />
            </Suspense>
          )}
        </div>
      </section>

      <CTASection content={content.cta} placement="cases" />
    </>
  );
}
