import type { Metadata } from 'next';
import { BookingCTA } from '@/components/BookingCTA';
import { ButtonLink } from '@/components/Button';
import { CaseCard } from '@/components/CaseCard';
import { CTASection } from '@/components/CTASection';
import { HeroEditorial } from '@/components/HeroEditorial';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import { Notice } from '@/components/Notice';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { FeatureImage } from '@/components/ServiceDetailIntro';
import { AccentText } from '@/components/AccentText';
import { getCases, getGlobalContent, getPages, getServices, getWorkProcess } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';
import { fillTemplate } from '@/lib/text';

const content = getPages().home;

const localMetadata: Metadata = buildMetadata({
  title: content.seo.title || undefined,
  description: content.seo.description,
  path: '/',
});

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/', localMetadata);
}

export default async function HomePage() {
  const cmsView = await renderCmsPage('/');
  if (cmsView) return cmsView;

  const services = getServices();
  const cases = getCases().slice(0, 2);
  const hasDemoCases = cases.some((c) => c.status === 'demo');
  const { hero, approach } = content;

  return (
    <>
      <HeroEditorial
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        description={hero.description}
        image={hero.image}
        annotation={hero.annotation}
        actions={
          <>
            <BookingCTA placement="home-hero" />
            <ButtonLink href={cases.length > 0 ? '/cases' : '/diensten'} variant="secondary" icon="play" placement="home-hero-secundair">
              {cases.length > 0 ? content.heroSecondaryCasesLabel : content.heroSecondaryServicesLabel}
            </ButtonLink>
          </>
        }
      />
      <MarqueeTicker items={getGlobalContent().ticker} />

      <section className="section" aria-labelledby="home-services">
        <div className="container">
          <SectionHeading id="home-services" {...content.services} />
          <div className="grid grid--3">
            {services.slice(0, 3).map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
          <div className="actions" style={{ marginTop: 28 }}>
            <ButtonLink href="/diensten" placement="home-services">
              {fillTemplate(content.allServicesLabel, { count: services.length })}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="home-approach">
        <div className="container split">
          <div>
            <p className="eyebrow">{approach.eyebrow}</p>
            <h2 id="home-approach" className="h2">
              <AccentText text={approach.heading} />
            </h2>
            <p className="lead">{approach.text}</p>
            <div className="actions">
              <ButtonLink href="/over-ons" variant="secondary" placement="home-aanpak">
                {approach.buttonLabel}
              </ButtonLink>
            </div>
          </div>
          <FeatureImage image={approach.image} />
        </div>
      </section>

      <section className="section" aria-labelledby="home-process">
        <div className="container">
          <SectionHeading id="home-process" {...content.process} />
          <ProcessTimeline steps={getWorkProcess()} />
        </div>
      </section>

      {cases.length > 0 && (
        <section className="section section--soft" aria-labelledby="home-cases">
          <div className="container">
            <SectionHeading id="home-cases" {...content.cases} />
            {hasDemoCases && (
              <Notice tone="demo">
                <p>{content.casesDemoNotice}</p>
              </Notice>
            )}
            <div className="grid grid--2">
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
            <div className="actions" style={{ marginTop: 28 }}>
              <ButtonLink href="/cases" placement="home-cases">
                {content.allCasesLabel}
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <CTASection content={content.cta} placement="home" />
    </>
  );
}
