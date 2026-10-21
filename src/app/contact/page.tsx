import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { ContactForm } from '@/components/ContactForm';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Icon } from '@/components/Icon';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Notice } from '@/components/Notice';
import { SectionHeading } from '@/components/SectionHeading';
import { media } from '@/content/data/media';
import { getSiteSettings } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description: 'Vertel ons over je merk en plannen. Neem contact op met YorSocials of plan een kennismaking.',
  path: '/contact',
});

const steps = [
  { icon: 'messages' as const, title: 'Kennismaking', copy: 'We luisteren naar jouw merk, doelen en uitdagingen.' },
  { icon: 'lightbulb' as const, title: 'Een eerste richting', copy: 'We bespreken kansen en aandachtspunten en geven eerlijk advies.' },
  { icon: 'strategy' as const, title: 'Een voorstel', copy: 'Als het past, werken we een concrete aanpak voor je uit.' },
];

export default function ContactPage() {
  const site = getSiteSettings();
  const hasDirect = Boolean(site.email || site.phone);
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'Contact', href: '/contact' }]} />}
        eyebrow="Samen aan de slag"
        heading={
          <>
            Let’s <span className="accent-green">talk.</span>
          </>
        }
        description="Vertel ons over je merk en je plannen. We denken graag met je mee over strategie, content en campagnes."
        image={media.hero}
        size="compact"
        annotation={['Jouw merk.', 'Onze missie.']}
      />

      <section className="section" aria-labelledby="direct-contact">
        <div className={`container ${styles.layout}`}>
          <div>
            <p className="eyebrow">Direct contact</p>
            <h2 id="direct-contact" className="h2">
              Goed idee? <span className="accent-green">Laat van je horen.</span>
            </h2>
            <p className="lead">Vul het formulier in en we nemen contact met je op. Je kunt ook direct een kennismaking inplannen zodra onze agenda online staat.</p>

            {hasDirect ? (
              <ul className={styles.channels}>
                {site.email && (
                  <li>
                    <Icon name="mail" size={26} />
                    <div>
                      <strong>E-mail</strong>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </div>
                  </li>
                )}
                {site.phone && (
                  <li>
                    <Icon name="messages" size={26} />
                    <div>
                      <strong>Telefoon</strong>
                      <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                    </div>
                  </li>
                )}
              </ul>
            ) : (
              getContentMode() === 'staging' && (
                <Notice tone="demo">
                  <p>E-mailadres, telefoonnummer, social-profielen en agenda-URL moeten nog door YorSocials worden bevestigd. Tot die tijd tonen we ze niet.</p>
                </Notice>
              )
            )}

            <div className={styles.booking}>
              <Icon name="calendar" size={30} />
              <div>
                <h3 className="h3">Een kennismaking inplannen?</h3>
                {site.bookingUrl ? (
                  <>
                    <p className="muted">Kies zelf een moment dat jou past in onze agenda.</p>
                    <ButtonLink href={site.bookingUrl} external trackAs="booking" placement="contact-agenda" icon="calendar">
                      Open de agenda
                    </ButtonLink>
                  </>
                ) : (
                  <p className="muted" style={{ margin: 0 }}>
                    Online inplannen is binnenkort mogelijk. Laat via het formulier weten wanneer het je uitkomt, dan stellen we een moment voor.
                  </p>
                )}
              </div>
            </div>
          </div>
          <Suspense fallback={<LoadingIndicator label="Formulier laden…" />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="verwachtingen">
        <div className="container">
          <SectionHeading
            id="verwachtingen"
            eyebrow="Wat kun je verwachten?"
            heading={
              <>
                Van een goed gesprek naar <span className="accent-green">concrete plannen.</span>
              </>
            }
            description="Een kennismaking is vrijblijvend en bedoeld om elkaar te leren kennen."
          />
          <ol className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {steps.map((s, i) => (
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
