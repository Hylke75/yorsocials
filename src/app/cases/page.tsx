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
import { media } from '@/content/data/media';
import { getCases, getSectors } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cases',
  description: 'Bekijk hoe YorSocials merken helpt met strategie, content en campagnes. Filter op sector.',
  path: '/cases',
});

export default function CasesPage() {
  const cases = getCases();
  const items = cases.map((c) => ({ slug: c.slug, sector: c.sector, card: <CaseCard item={c} /> }));
  const cta = <BookingCTA placement="cases-leeg" variant="secondary" />;

  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'Cases', href: '/cases' }]} />}
        eyebrow="Ons werk"
        heading={
          <>
            Onze <span className="accent-green">cases.</span>
          </>
        }
        description="Werk dat het merkverhaal versterkt en de juiste mensen bereikt. We publiceren alleen cases met toestemming van de klant en controleerbare resultaten."
        image={media.fitness}
        size="compact"
        annotation={['Van content', 'naar resultaat.']}
      />

      <section className="section" aria-labelledby="alle-cases">
        <div className="container">
          <h2 id="alle-cases" className="visually-hidden">
            Alle cases
          </h2>
          {cases.some((c) => c.status === 'demo') && (
            <Notice tone="demo">
              <p>Conceptportfolio: dit zijn voorbeeldcases zonder echte klanten of resultaten. Merknamen, cijfers en quotes worden pas toegevoegd na toestemming en verificatie.</p>
            </Notice>
          )}
          {cases.length === 0 ? (
            <EmptyState
              title="Binnenkort: onze cases"
              description="We werken aan een selectie cases die we met toestemming van onze klanten kunnen delen. Benieuwd wat we voor jouw merk kunnen doen?"
              action={cta}
            />
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
              <CaseFilter items={items} sectors={getSectors()} emptyAction={cta} />
            </Suspense>
          )}
        </div>
      </section>

      <CTASection
        placement="cases"
        eyebrow="Klaar om jouw verhaal te schrijven?"
      />
    </>
  );
}
