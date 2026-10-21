import type { Metadata } from 'next';
import { BookingCTA } from '@/components/BookingCTA';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { HeroEditorial } from '@/components/HeroEditorial';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { getPages, getServices, getWorkProcess } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';
import { plainText } from '@/lib/text';

const content = getPages().services;

const localMetadata: Metadata = buildMetadata({ ...content.seo, path: '/services' });

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/services', localMetadata);
}

export default async function ServicesPage() {
  const cmsView = await renderCmsPage('/services');
  if (cmsView) return cmsView;

  const { hero } = content;
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: plainText(content.seo.title), href: '/services' }]} />}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        description={hero.description}
        image={hero.image}
        annotation={hero.annotation}
        actions={<BookingCTA placement="services-hero" />}
      />

      <section className="section" aria-labelledby="services-overzicht">
        <div className="container">
          <SectionHeading id="services-overzicht" {...content.overview} />
          <div className="grid grid--3">
            {getServices().map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="services-werkwijze">
        <div className="container">
          <SectionHeading id="services-werkwijze" {...content.process} />
          <ProcessTimeline steps={getWorkProcess()} showImages />
        </div>
      </section>

      <CTASection content={content.cta} placement="services" />
    </>
  );
}
