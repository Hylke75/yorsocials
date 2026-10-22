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
import { getCase, getCases, getDisplayClientName, getPages, getRelatedServices, getSectorLabel } from '@/content/repository';
import { AccentText } from '@/components/AccentText';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { getCmsContent } from '@/cms/client';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const cms = (await getCmsContent())?.paginas.filter((p) => p.slug.startsWith('/cases/')).map((p) => p.slug.slice('/cases/'.length)) ?? [];
  return [...new Set([...getCases().map((c) => c.slug), ...cms])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const item = getCase(slug);
  const local = item ? buildMetadata({ title: item.seo.title, description: item.seo.description, path: `/cases/${item.slug}`, noIndex: item.seo.noIndex }) : {};
  return cmsMetadata(`/cases/${slug}`, local);
}

export default async function CaseDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const cmsView = await renderCmsPage(`/cases/${slug}`);
  if (cmsView) return cmsView;
  const item = getCase(slug);
  if (!item) notFound();
  const client = getDisplayClientName(item);
  const related = getRelatedServices(item.relatedServices);
  const quote = item.quote?.approved ? item.quote : null;
  const t = getPages().caseDetail;

  return (
    <>
      <CaseViewTracker slug={item.slug} />
      <HeroEditorial
        before={
          <Breadcrumbs
            items={[
              { name: getPages().cases.seo.title, href: '/cases' },
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
        {item.status === 'demo' && <DemoBadge>{t.demoBadge}</DemoBadge>}
      </HeroEditorial>

      <section className="section" aria-labelledby="case-vraag">
        <div className="container">
          {item.status === 'demo' && (
            <Notice tone="demo">
              <p>{t.demoNotice}</p>
            </Notice>
          )}
          <div className={styles.facts}>
            <div>
              <p className="eyebrow">{t.contextEyebrow}</p>
              <h2 id="case-vraag" className="h3" style={{ marginTop: 14 }}>
                {t.contextHeading}
              </h2>
              <p className="lead">{item.context}</p>
            </div>
            <div>
              <p className="eyebrow">{t.objectiveEyebrow}</p>
              <h2 className="h3" style={{ marginTop: 14 }}>
                {t.objectiveHeading}
              </h2>
              <p className="lead">{item.objective}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="case-aanpak">
        <div className="container split split--top">
          <div>
            <p className="eyebrow">{t.approach.eyebrow}</p>
            <h2 id="case-aanpak" className="h2">
              <AccentText text={t.approach.heading} />
            </h2>
            <ol className={styles.approach}>
              {item.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="h3">{t.outputsHeading}</h3>
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
            <SectionHeading id="case-beeld" {...t.gallery} />
            <PortfolioGallery images={item.gallery} />
          </div>
        </section>
      )}

      <section className="section section--soft" aria-labelledby="case-resultaat">
        <div className="container">
          <SectionHeading id="case-resultaat" {...t.results} />
          <CaseResults results={item.results} emptyText={t.resultsEmpty} />
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
            <SectionHeading id="case-diensten" {...t.relatedServices} />
            <div className="grid grid--3">
              {related.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
            <div className="actions" style={{ marginTop: 28 }}>
              <ButtonLink href="/cases" variant="secondary" icon="arrowLeft" iconPosition="start" placement="case-terug">
                {t.backLabel}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <CTASection content={t.cta} placement={`case-${item.slug}`} />
    </>
  );
}
