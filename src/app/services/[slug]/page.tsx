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
import { getArticlesForService, getOtherServices, getPages, getService, getServices } from '@/content/repository';
import { AccentText } from '@/components/AccentText';
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
  const t = getPages().serviceDetail;

  return (
    <>
      <ServiceViewTracker slug={service.slug} />
      <HeroEditorial
        before={
          <Breadcrumbs
            items={[
              { name: getPages().services.seo.title, href: '/services' },
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
              {t.askQuestionLabel}
            </ButtonLink>
          </>
        }
      />

      <section className="section" aria-labelledby="herkenning">
        <div className="container split split--top">
          <div>
            <p className="eyebrow">{t.problem.eyebrow}</p>
            <h2 id="herkenning" className="h2">
              <AccentText text={t.problem.heading} />
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
            eyebrow={t.offer.eyebrow}
            heading={<AccentText text={t.offer.heading} />}
            text={t.offer.text}
            deliverables={service.deliverables}
            image={service.heroImage}
            actions={
              <ButtonLink href={contactHref} placement={`service-${service.slug}-aanbod`}>
                {t.offer.buttonLabel}
              </ButtonLink>
            }
          />
        </div>
      </section>

      <section className="section" aria-labelledby="werkwijze">
        <div className="container">
          <SectionHeading id="werkwijze" {...t.process} />
          <ProcessTimeline steps={service.process} />
        </div>
      </section>

      {service.faqs.length > 0 && (
        <section className="section section--soft" aria-labelledby="dienst-faq">
          <div className="container split split--top">
            <div>
              <p className="eyebrow">{t.faq.eyebrow}</p>
              <h2 id="dienst-faq" className="h2">
                <AccentText text={t.faq.heading} />
              </h2>
              <ButtonLink href="/faq" variant="secondary" placement={`service-${service.slug}-faq`}>
                {t.faq.allQuestionsLabel}
              </ButtonLink>
            </div>
            <AccordionFAQ items={service.faqs} />
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="section" aria-labelledby="dienst-artikelen">
          <div className="container">
            <SectionHeading id="dienst-artikelen" {...t.articles} />
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
          <SectionHeading id="andere-diensten" {...t.otherServices} />
          <div className="grid grid--3">
            {others.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <CTASection content={t.cta} placement={`service-${service.slug}`} />
    </>
  );
}
