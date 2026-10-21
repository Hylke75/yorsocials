import type { Metadata } from 'next';
import { BookingCTA } from '@/components/BookingCTA';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { HeroEditorial } from '@/components/HeroEditorial';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { media } from '@/content/data/media';
import { getServices, getWorkProcess } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description: 'Social strategie, content creatie, video & Reels, paid social, community management en analyse: de services van YorSocials.',
  path: '/services',
});

export default function ServicesPage() {
  const services = getServices();
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'Services', href: '/services' }]} />}
        eyebrow="Wat we doen"
        heading={
          <>
            Onze <span className="accent-green">services.</span>
          </>
        }
        description="Van strategie en productie tot campagnes en optimalisatie. We zetten de juiste disciplines in om jouw merk verder te brengen — alles onder één dak."
        image={media.hero}
        annotation={['Strategie. Content.', 'Groei.']}
        actions={<BookingCTA placement="services-hero" />}
      />

      <section className="section" aria-labelledby="services-overzicht">
        <div className="container">
          <SectionHeading
            id="services-overzicht"
            eyebrow="Onze expertises"
            heading={
              <>
                Creatieve oplossingen voor <span className="accent-green">jouw groei.</span>
              </>
            }
            description="Kies één dienst of combineer er meerdere. Elke dienst is uit te breiden naarmate je merk groeit."
          />
          <div className="grid grid--3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="services-werkwijze">
        <div className="container">
          <SectionHeading
            id="services-werkwijze"
            eyebrow="Zo werkt YorSocials"
            heading={
              <>
                Van idee naar <span className="accent-green">impact.</span>
              </>
            }
            description="Een helder proces, een sterk resultaat. Zo gaan we samen aan de slag."
          />
          <ProcessTimeline steps={getWorkProcess()} showImages />
        </div>
      </section>

      <CTASection
        placement="services"
        heading={
          <>
            Plan een <span className="accent-green">kennismaking.</span>
          </>
        }
        body="Ontdek wat we voor jouw merk kunnen betekenen. In een vrijblijvende kennismaking bespreken we je doelen, kansen en een passende aanpak."
      />
    </>
  );
}
