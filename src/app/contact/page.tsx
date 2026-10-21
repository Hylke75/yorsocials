import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AccentText } from '@/components/AccentText';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { ContactForm } from '@/components/ContactForm';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Icon } from '@/components/Icon';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Notice } from '@/components/Notice';
import { SectionHeading } from '@/components/SectionHeading';
import { getGlobalContent, getPages, getSiteSettings } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

const content = getPages().contact;

const localMetadata: Metadata = buildMetadata({ ...content.seo, path: '/contact' });

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/contact', localMetadata);
}

export default async function ContactPage() {
  const cmsView = await renderCmsPage('/contact');
  if (cmsView) return cmsView;

  const site = getSiteSettings();
  const hasDirect = Boolean(site.email || site.phone);
  const { hero, intro, booking } = content;
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: content.seo.title, href: '/contact' }]} />}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        description={hero.description}
        image={hero.image}
        size="compact"
        annotation={hero.annotation}
      />

      <section className="section" aria-labelledby="direct-contact">
        <div className={`container ${styles.layout}`}>
          <div>
            <p className="eyebrow">{intro.eyebrow}</p>
            <h2 id="direct-contact" className="h2">
              <AccentText text={intro.heading} />
            </h2>
            <p className="lead">{intro.text}</p>

            {hasDirect ? (
              <ul className={styles.channels}>
                {site.email && (
                  <li>
                    <Icon name="mail" size={26} />
                    <div>
                      <strong>{content.emailLabel}</strong>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </div>
                  </li>
                )}
                {site.phone && (
                  <li>
                    <Icon name="messages" size={26} />
                    <div>
                      <strong>{content.phoneLabel}</strong>
                      <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                    </div>
                  </li>
                )}
              </ul>
            ) : (
              getContentMode() === 'staging' && (
                <Notice tone="demo">
                  <p>{content.missingContactNotice}</p>
                </Notice>
              )
            )}

            <div className={styles.booking}>
              <Icon name="calendar" size={30} />
              <div>
                <h3 className="h3">{booking.title}</h3>
                {site.bookingUrl ? (
                  <>
                    <p className="muted">{booking.textWithUrl}</p>
                    <ButtonLink href={site.bookingUrl} external trackAs="booking" placement="contact-agenda" icon="calendar">
                      {booking.buttonLabel}
                    </ButtonLink>
                  </>
                ) : (
                  <p className="muted" style={{ margin: 0 }}>
                    {booking.textWithoutUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <ContactForm content={getGlobalContent().contactForm} />
          </Suspense>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="verwachtingen">
        <div className="container">
          <SectionHeading id="verwachtingen" {...content.expectations} />
          <ol className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {content.steps.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon name={s.icon} size={32} />
                <h3 className="h3">{s.title}</h3>
                <p>{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
