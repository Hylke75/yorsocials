import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { CaseResults } from '@/components/CaseResults';
import { CTASection } from '@/components/CTASection';
import { DemoBadge } from '@/components/DemoBadge';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Icon } from '@/components/Icon';
import { Notice } from '@/components/Notice';
import { PortfolioGallery } from '@/components/PortfolioGallery';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { CaseViewTracker } from '@/components/ViewTracker';
import { getCase, getCases, getDisplayClientName, getRelatedServices, getSectorLabel } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getCase((await params).slug);
  if (!item) return {};
  return buildMetadata({ title: item.seo.title, description: item.seo.description, path: `/cases/${item.slug}`, noIndex: item.seo.noIndex });
}

export default async function CaseDetailPage({ params }: Props) {
  const item = getCase((await params).slug);
  if (!item) notFound();
  const client = getDisplayClientName(item);
  const related = getRelatedServices(item.relatedServices);
  const quote = item.quote?.approved ? item.quote : null;

  return (
    <>
      <CaseViewTracker slug={item.slug} />
      <HeroEditorial
        before={
          <Breadcrumbs
            items={[
              { name: 'Cases', href: '/cases' },
              { name: item.title, href: `/cases/${item.slug}` },
            ]}
          />
        }
        eyebrow={`${getSectorLabel(item.sector)}${client ? ` · ${client}` : ''}`}
        heading={item.title}
        description={item.summary}
        image={item.heroImage}
        size="compact"
      >
        {item.status === 'demo' && <DemoBadge>Demonstratiecase — geen echte klantopdracht</DemoBadge>}
      </HeroEditorial>

      <section className="section" aria-labelledby="case-vraag">
        <div className="container">
          {item.status === 'demo' && (
            <Notice tone="demo">
              <p>Deze pagina toont de beoogde opbouw van een case: beginsituatie, doel, aanpak, materiaal en geverifieerde resultaten. Teksten zijn placeholders.</p>
            </Notice>
          )}
          <div className={styles.facts}>
            <div>
              <p className="eyebrow">De vraag</p>
              <h2 id="case-vraag" className="h3" style={{ marginTop: 14 }}>
                Context
              </h2>
              <p className="lead">{item.context}</p>
            </div>
            <div>
              <p className="eyebrow">Het doel</p>
              <h2 className="h3" style={{ marginTop: 14 }}>
                Doelstelling
              </h2>
              <p className="lead">{item.objective}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="case-aanpak">
        <div className="container split split--top">
          <div>
            <p className="eyebrow">De aanpak</p>
            <h2 id="case-aanpak" className="h2">
              Wat we <span className="accent-green">deden.</span>
            </h2>
            <ol className={styles.approach}>
              {item.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="h3">Opgeleverd</h3>
            <ul className={styles.outputs}>
              {item.outputs.map((o) => (
                <li key={o}>
                  <Icon name="check" size={18} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {item.gallery.length > 0 && (
        <section className="section" aria-labelledby="case-beeld">
          <div className="container">
            <SectionHeading id="case-beeld" eyebrow="Materiaal" heading={<>Beeld uit het <span className="accent-green">project.</span></>} />
            <PortfolioGallery images={item.gallery} />
          </div>
        </section>
      )}

      <section className="section section--soft" aria-labelledby="case-resultaat">
        <div className="container">
          <SectionHeading id="case-resultaat" eyebrow="Het resultaat" heading={<>Wat het <span className="accent-green">opleverde.</span></>} />
          <CaseResults results={item.results} />
          {quote && (
            <figure className={styles.quote}>
              <blockquote>“{quote.text}”</blockquote>
              <figcaption>
                — {quote.author}, {quote.role}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" aria-labelledby="case-diensten">
          <div className="container">
            <SectionHeading id="case-diensten" eyebrow="Ingezette diensten" heading={<>Hiermee <span className="accent-green">werkten we.</span></>} />
            <div className="grid grid--3">
              {related.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
            <div className="actions" style={{ marginTop: 28 }}>
              <ButtonLink href="/cases" variant="secondary" icon="arrowLeft" iconPosition="start" placement="case-terug">
                Alle cases
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <CTASection placement={`case-${item.slug}`} />
    </>
  );
}
