import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import { AccordionFAQ } from '@/components/AccordionFAQ';
import { Annotation } from '@/components/Annotation';
import { ArticleCard } from '@/components/ArticleCard';
import { BookingCTA } from '@/components/BookingCTA';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button, ButtonLink } from '@/components/Button';
import { CaseCard } from '@/components/CaseCard';
import { CaseFilter } from '@/components/CaseFilter';
import { CaseResults } from '@/components/CaseResults';
import { DemoBadge } from '@/components/DemoBadge';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import { Notice } from '@/components/Notice';
import { PortfolioGallery } from '@/components/PortfolioGallery';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceDetailIntro } from '@/components/ServiceDetailIntro';
import { ToastDemo } from '@/components/styleguide/ToastDemo';
import { ValuesGrid } from '@/components/ValuesGrid';
import { media } from '@/content/data/media';
import { getArticles, getCases, getFaqs, getGlobalContent, getPages, getSectors, getServices, getValues, getWorkProcess } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { tokens } from '@/styles/tokens';

export const metadata: Metadata = { title: 'Componentenbibliotheek', robots: { index: false, follow: false } };

function Specimen({ name, props, children }: { name: string; props?: string; children: ReactNode }) {
  return (
    <section style={{ padding: '48px 0', borderBottom: '1px solid var(--color-border)' }} aria-labelledby={`sg-${name}`}>
      <h2 id={`sg-${name}`} style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--color-accent)', margin: 0 }}>
        &lt;{name} /&gt;
      </h2>
      {props && <p className="muted" style={{ fontFamily: 'monospace', fontSize: 13, marginBottom: 24 }}>{props}</p>}
      {children}
    </section>
  );
}

/**
 * Componentenbibliotheek (Storybook-equivalent): elk component met zijn varianten en
 * toestanden. Alleen beschikbaar in staging; in productie een 404.
 */
export default function StyleguidePage() {
  if (getContentMode() === 'production') notFound();
  const services = getServices();
  const cases = getCases('staging');
  const articles = getArticles('staging');
  return (
    <div className="container" style={{ paddingBlock: 48 }}>
      <p className="eyebrow">Intern</p>
      <h1 className="h2">Componentenbibliotheek</h1>
      <p className="lead">Alle bouwblokken uit de componentinventaris met hun props, varianten en toestanden. Niet geïndexeerd; alleen in staging.</p>

      <Specimen name="Tokens" props="src/styles/tokens.css · design/design-tokens.json">
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 12, listStyle: 'none', padding: 0 }}>
          {Object.entries(tokens.colors).map(([k, v]) => (
            <li key={k} style={{ width: 140 }}>
              <div style={{ height: 64, borderRadius: 10, background: v, border: '1px solid var(--color-border)' }} />
              <p style={{ fontSize: 13, margin: '8px 0 0' }}>
                {k}
                <br />
                <code className="muted">{v}</code>
              </p>
            </li>
          ))}
        </ul>
        <p className="h1" style={{ margin: '24px 0 0' }}>H1 display</p>
        <p className="h2">H2 display</p>
        <p className="h3">H3 kop</p>
        <p className="lead">Lead-tekst 18px voor introducties.</p>
        <p>Broodtekst 16px.</p>
      </Specimen>

      <Specimen name="Button / ButtonLink / BookingCTA" props="variant: primary | secondary | green · size · icon · disabled">
        <div className="actions">
          <Button icon="arrowRight">Primair</Button>
          <Button variant="secondary">Secundair</Button>
          <Button variant="green">Groen</Button>
          <Button size="small">Klein</Button>
          <Button disabled>Uitgeschakeld</Button>
          <Button icon="loader" disabled>
            Bezig…
          </Button>
          <ButtonLink href="/contact">Link-knop</ButtonLink>
          <BookingCTA placement="styleguide" />
        </div>
      </Specimen>

      <Specimen name="Breadcrumbs" props="items: { name, href }[]">
        <Breadcrumbs items={[{ name: 'Services', href: '/services' }, { name: 'Social strategie', href: '/services/social-strategie' }]} />
      </Specimen>

      <Specimen name="SectionHeading" props="eyebrow, heading, description, alignment">
        <SectionHeading eyebrow="Eyebrow" heading={<>Sectie <span className="accent-green">kop.</span></>} description="Optionele beschrijving rechts." />
        <SectionHeading eyebrow="Gecentreerd" heading="Gecentreerde kop" alignment="center" />
      </Specimen>

      <Specimen name="Annotation" props="lines[], variant: underline | circle, arrow">
        <div className="actions" style={{ gap: 60 }}>
          <Annotation lines={['Van idee', 'naar impact.']} />
          <Annotation lines={['Meer dan', 'alleen content.']} variant="circle" arrow={false} />
        </div>
      </Specimen>

      <Specimen name="Notice / DemoBadge">
        <Notice>
          <p>Informatieve melding.</p>
        </Notice>
        <Notice tone="demo">
          <p>Demo-/placeholdermelding.</p>
        </Notice>
        <DemoBadge>{getGlobalContent().demoBadge}</DemoBadge>
      </Specimen>

      <Specimen name="MarqueeTicker" props="items[] · stopt bij prefers-reduced-motion">
        <MarqueeTicker items={['Strategie', 'Content', 'Campagnes', 'Community']} />
      </Specimen>

      <Specimen name="ServiceCard" props="service">
        <div className="grid grid--3">
          {services.slice(0, 3).map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </Specimen>

      <Specimen name="ServiceDetailIntro" props="eyebrow, heading, text, deliverables[], image">
        <ServiceDetailIntro eyebrow="Aanbod" heading="Deliverables" text="Introtekst." deliverables={services[0]?.deliverables ?? []} image={media.strategy} />
      </Specimen>

      <Specimen name="CaseCard / CaseFilter" props="items, sectors · URL ?sector= · lege toestand bij Personal brand">
        <Suspense fallback={<LoadingIndicator />}>
          <CaseFilter items={cases.map((c) => ({ slug: c.slug, sector: c.sector, card: <CaseCard item={c} /> }))} sectors={getSectors()}
            labels={{ filterLabel: getPages().cases.filterLabel, allLabel: getPages().cases.filterAllLabel, emptyTitle: getPages().cases.filterEmptyTitle, emptyDescription: getPages().cases.filterEmptyDescription }}
          />
        </Suspense>
      </Specimen>

      <Specimen name="CaseResults (StatBlock)" props="results[] · alleen approved + bron + periode">
        <CaseResults results={[]} emptyText={getPages().caseDetail.resultsEmpty} />
        <p className="muted" style={{ margin: '20px 0 8px' }}>Variant met goedgekeurde resultaten (FICTIEVE voorbeeldwaarden, alleen voor de styleguide):</p>
        <CaseResults
          results={[
            { metric: 'Voorbeeldmetriek A', value: '00', unit: '%', period: 'Periode X', source: 'Bron Y', approved: true },
            { metric: 'Voorbeeldmetriek B', value: '0,0', unit: 'k', period: 'Periode X', source: 'Bron Y', approved: true },
          ]}
          emptyText={getPages().caseDetail.resultsEmpty}
        />
      </Specimen>

      <Specimen name="PortfolioGallery" props="images[] met alt + caption">
        <PortfolioGallery images={[{ ...media.shoot, caption: 'Caption bij beeld' }, media.creator]} />
      </Specimen>

      <Specimen name="ArticleCard" props="article">
        <div className="grid grid--3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </Specimen>

      <Specimen name="ValuesGrid" props="values[]: icon, title, description">
        <ValuesGrid values={getValues()} />
      </Specimen>

      <Specimen name="ProcessTimeline" props="steps[], showImages">
        <ProcessTimeline steps={getWorkProcess()} showImages />
      </Specimen>

      <Specimen name="AccordionFAQ" props="items[], defaultOpen[], headingLevel">
        <AccordionFAQ items={getFaqs().slice(0, 3)} defaultOpen={[getFaqs()[0]?.id ?? '']} />
      </Specimen>

      <Specimen name="EmptyState / ErrorState / LoadingIndicator / Toast">
        <div className="grid grid--2">
          <EmptyState title="Leeg resultaat" description="Er is niets gevonden." />
          <ErrorState title="Er ging iets mis" description="Probeer het opnieuw." />
        </div>
        <div className="actions">
          <LoadingIndicator />
          <ToastDemo />
        </div>
      </Specimen>


      <p className="muted" style={{ marginTop: 32 }}>
        ContactForm, SiteHeader, MobileNav, SiteFooter, HeroEditorial, CTASection en NewsletterPopup zijn live te zien op de pagina’s zelf (bijv. /contact).
      </p>
    </div>
  );
}
