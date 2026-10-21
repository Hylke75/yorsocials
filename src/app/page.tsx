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
import { media } from '@/content/data/media';
import { getCases, getServices, getSiteSettings, getWorkProcess } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  description: getSiteSettings().defaultSeo.description,
  path: '/',
});

export default function HomePage() {
  const services = getServices();
  const cases = getCases().slice(0, 2);
  const hasDemoCases = cases.some((c) => c.status === 'demo');

  return (
    <>
      <HeroEditorial
        eyebrow="Social-first creative agency"
        heading={
          <>
            Social die opvalt.
            <br />
            <span className="accent-green">Content die blijft.</span>
          </>
        }
        description="Strategie, content en campagnes voor merken die willen opvallen. Persoonlijk, creatief en gericht op wat écht telt."
        image={media.hero}
        annotation={['Van idee', 'naar impact.']}
        actions={
          <>
            <BookingCTA placement="home-hero" />
            <ButtonLink href={cases.length > 0 ? '/cases' : '/services'} variant="secondary" icon="play" placement="home-hero-secundair">
              {cases.length > 0 ? 'Bekijk onze cases' : 'Bekijk onze services'}
            </ButtonLink>
          </>
        }
      />
      <MarqueeTicker items={['Strategie', 'Content', 'Campagnes', 'Community', 'Video', 'Analyse']} />

      <section className="section" aria-labelledby="home-services">
        <div className="container">
          <SectionHeading
            id="home-services"
            eyebrow="Onze services"
            heading={
              <>
                Alles voor jouw <span className="accent-green">social groei.</span>
              </>
            }
            description="Van het eerste idee tot de laatste optimalisatie: één samenhangende aanpak."
          />
          <div className="grid grid--3">
            {services.slice(0, 3).map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
          <div className="actions" style={{ marginTop: 28 }}>
            <ButtonLink href="/services" placement="home-services">
              Bekijk alle {services.length} diensten
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="home-approach">
        <div className="container split">
          <div>
            <p className="eyebrow">Onze aanpak</p>
            <h2 id="home-approach" className="h2">
              Goede content.
              <br />
              <span className="accent-green">Slimme keuzes.</span>
            </h2>
            <p className="lead">
              We verbinden sterke ideeën aan een heldere strategie. Zo werk je aan herkenning, betrokkenheid en groei — stap voor stap en
              meetbaar.
            </p>
            <div className="actions">
              <ButtonLink href="/over-ons" variant="secondary" placement="home-aanpak">
                Leer ons kennen
              </ButtonLink>
            </div>
          </div>
          <FeatureImage image={media.shoot} />
        </div>
      </section>

      <section className="section" aria-labelledby="home-process">
        <div className="container">
          <SectionHeading
            id="home-process"
            eyebrow="Zo werken we"
            heading={
              <>
                Van idee naar <span className="accent-green">impact.</span>
              </>
            }
          />
          <ProcessTimeline steps={getWorkProcess()} />
        </div>
      </section>

      {cases.length > 0 && (
        <section className="section section--soft" aria-labelledby="home-cases">
          <div className="container">
            <SectionHeading
              id="home-cases"
              eyebrow="Werk dat raakt"
              heading={
                <>
                  Resultaten beginnen met <span className="accent-green">een goed verhaal.</span>
                </>
              }
            />
            {hasDemoCases && (
              <Notice tone="demo">
                <p>Onderstaande cases zijn demonstratievoorbeelden, geen geverifieerde klantcases.</p>
              </Notice>
            )}
            <div className="grid grid--2">
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
            <div className="actions" style={{ marginTop: 28 }}>
              <ButtonLink href="/cases" placement="home-cases">
                Bekijk alle cases
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <CTASection placement="home" />
    </>
  );
}
