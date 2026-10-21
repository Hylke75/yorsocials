import type { Metadata } from 'next';
import { BookingCTA } from '@/components/BookingCTA';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Notice } from '@/components/Notice';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { SectionHeading } from '@/components/SectionHeading';
import { FeatureImage } from '@/components/ServiceDetailIntro';
import { TeamCard } from '@/components/TeamCard';
import { ValuesGrid } from '@/components/ValuesGrid';
import { media } from '@/content/data/media';
import { getTeam, getValues, getWorkProcess } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Over ons',
  description: 'Maak kennis met YorSocials: een creatieve partner die strategie en productie samenbrengt.',
  path: '/over-ons',
});

export default function AboutPage() {
  const team = getTeam();
  const staging = getContentMode() === 'staging';
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'Over ons', href: '/over-ons' }]} />}
        eyebrow="Dit zijn wij"
        heading={
          <>
            Meer dan <span className="accent-green">content.</span>
          </>
        }
        description="Een betrokken creatieve partner die strategie en productie samenbrengt. We houden van ideeën die niet alleen mooi zijn, maar ook iets teweegbrengen."
        image={media.creator}
        annotation={['Creatieve denkers.', 'Doeners.']}
        actions={<BookingCTA placement="over-ons-hero" />}
      />

      <section className="section" aria-labelledby="verhaal">
        <div className="container split">
          <FeatureImage image={media.shoot} />
          <div>
            <p className="eyebrow">Ons verhaal</p>
            <h2 id="verhaal" className="h2">
              Van passie naar <span className="accent-green">impact.</span>
            </h2>
            <p className="lead">
              We geloven dat goede social media begint met aandacht: voor mensen, voor merken en voor wat een verhaal bijzonder maakt. Daarom
              combineren we strategie, creatie en data in één team.
            </p>
            {staging && (
              <Notice tone="demo">
                <p>Conceptcopy. Het echte ontstaansverhaal, de medewerkers en portretten moeten nog door YorSocials worden aangeleverd.</p>
              </Notice>
            )}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="waarden">
        <div className="container">
          <SectionHeading
            id="waarden"
            eyebrow="Waar we voor staan"
            heading={
              <>
                Creatief. Persoonlijk. <span className="accent-green">Doelgericht.</span>
              </>
            }
          />
          <ValuesGrid values={getValues()} />
        </div>
      </section>

      <section className="section" aria-labelledby="werkwijze">
        <div className="container">
          <SectionHeading
            id="werkwijze"
            eyebrow="Werkwijze"
            heading={
              <>
                Van strategie tot shoot. <span className="accent-green">Alles in-huis.</span>
              </>
            }
          />
          <ProcessTimeline steps={getWorkProcess()} />
        </div>
      </section>

      {(team.length > 0 || staging) && (
        <section className="section section--soft" aria-labelledby="team">
          <div className="container">
            <SectionHeading
              id="team"
              eyebrow="Het team"
              heading={
                <>
                  De mensen achter <span className="accent-green">YorSocials.</span>
                </>
              }
            />
            {team.length > 0 ? (
              <div className="grid grid--3">
                {team.map((m) => (
                  <TeamCard key={m.name} member={m} />
                ))}
              </div>
            ) : (
              <Notice tone="demo">
                <p>
                  Teamleden worden hier getoond zodra er echte portretten, rollen en publicatietoestemming zijn aangeleverd. Er wordt geen fictief
                  team getoond. (Deze melding is alleen zichtbaar in staging.)
                </p>
              </Notice>
            )}
          </div>
        </section>
      )}

      <CTASection placement="over-ons" />
    </>
  );
}
