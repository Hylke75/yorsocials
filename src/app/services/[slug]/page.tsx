import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccordionFAQ } from '@/components/AccordionFAQ';
import { ArticleCard } from '@/components/ArticleCard';
import { BookingCTA } from '@/components/BookingCTA';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { CTASection } from '@/components/CTASection';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Icon } from '@/components/Icon';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceDetailIntro } from '@/components/ServiceDetailIntro';
import { ServiceViewTracker } from '@/components/ViewTracker';
import { getArticlesForService, getOtherServices, getService, getServices } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return buildMetadata({ title: service.seo.title, description: service.seo.description, path: `/services/${service.slug}`, noIndex: service.seo.noIndex });
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const others = getOtherServices(service.slug, 3);
  const articles = getArticlesForService(service.slug).slice(0, 3);
  const contactHref = `/contact?onderwerp=${encodeURIComponent(service.title)}#formulier`;
  const [first, ...rest] = service.title.split(' ');

  return (
    <>
      <ServiceViewTracker slug={service.slug} />
      <HeroEditorial
        before={
          <Breadcrumbs
            items={[
              { name: 'Services', href: '/services' },
              { name: service.title, href: `/services/${service.slug}` },
            ]}
          />
        }
        eyebrow={service.eyebrow}
        heading={
          rest.length > 0 ? (
            <>
              {first} <span className="accent-green">{rest.join(' ')}.</span>
            </>
          ) : (
            <span className="accent-green">{service.title}.</span>
          )
        }
        description={service.summary}
        image={service.heroImage}
        size="compact"
        actions={
          <>
            <BookingCTA placement={`service-${service.slug}-hero`} />
            <ButtonLink href={contactHref} variant="secondary" icon="mail" placement={`service-${service.slug}-vraag`}>
              Stel een vraag
            </ButtonLink>
          </>
        }
      />

      <section className="section" aria-labelledby="herkenning">
        <div className="container split split--top">
          <div>
            <p className="eyebrow">Herken je dit?</p>
            <h2 id="herkenning" className="h2">
              Waar we je <span className="accent-green">mee helpen.</span>
            </h2>
            <p className="lead">{service.intro}</p>
          </div>
          <ul className={styles.problems}>
            {service.problem.map((p) => (
              <li key={p}>
                <Icon name="target" size={22} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="aanbod">
        <div className="container">
          <ServiceDetailIntro
            headingId="aanbod"
            eyebrow="Wat je kunt verwachten"
            heading={
              <>
                Van plan naar <span className="accent-green">praktijk.</span>
              </>
            }
            text="Geen standaardpakket. We kijken welke onderdelen aansluiten bij jouw doelen en werken vanuit een herkenbare merkidentiteit. Concreet kun je rekenen op:"
            deliverables={service.deliverables}
            image={service.heroImage}
            actions={
              <ButtonLink href={contactHref} placement={`service-${service.slug}-aanbod`}>
                Bespreek jouw plannen
              </ButtonLink>
            }
          />
        </div>
      </section>

      <section className="section" aria-labelledby="werkwijze">
        <div className="container">
          <SectionHeading
            id="werkwijze"
            eyebrow="Werkwijze"
            heading={
              <>
                Zo pakken we <span className="accent-green">het aan.</span>
              </>
            }
          />
          <ProcessTimeline steps={service.process} />
        </div>
      </section>

      {service.faqs.length > 0 && (
        <section className="section section--soft" aria-labelledby="dienst-faq">
          <div className="container split split--top">
            <div>
              <p className="eyebrow">Veelgestelde vragen</p>
              <h2 id="dienst-faq" className="h2">
                Goed om te <span className="accent-green">weten.</span>
              </h2>
              <ButtonLink href="/faq" variant="secondary" placement={`service-${service.slug}-faq`}>
                Alle vragen
              </ButtonLink>
            </div>
            <AccordionFAQ items={service.faqs} />
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="section" aria-labelledby="dienst-artikelen">
          <div className="container">
            <SectionHeading
              id="dienst-artikelen"
              eyebrow="Kennis"
              heading={
                <>
                  Lees <span className="accent-green">verder.</span>
                </>
              }
            />
            <div className="grid grid--3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--soft" aria-labelledby="andere-diensten">
        <div className="container">
          <SectionHeading
            id="andere-diensten"
            eyebrow="Andere expertises"
            heading={
              <>
                Dit kunnen we ook <span className="accent-green">voor je doen.</span>
              </>
            }
          />
          <div className="grid grid--3">
            {others.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <CTASection placement={`service-${service.slug}`} />
    </>
  );
}
