import type { Metadata } from 'next';
import { AccentText } from '@/components/AccentText';
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
import { getPages, getTeam, getValues, getWorkProcess } from '@/content/repository';
import { getContentMode } from '@/lib/env';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';

const content = getPages().about;

const localMetadata: Metadata = buildMetadata({ ...content.seo, path: '/over-ons' });

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/over-ons', localMetadata);
}

export default async function AboutPage() {
  const cmsView = await renderCmsPage('/over-ons');
  if (cmsView) return cmsView;

  const team = getTeam();
  const staging = getContentMode() === 'staging';
  const { hero, story } = content;
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: content.seo.title, href: '/over-ons' }]} />}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        description={hero.description}
        image={hero.image}
        annotation={hero.annotation}
        actions={<BookingCTA placement="over-ons-hero" />}
      />

      <section className="section" aria-labelledby="verhaal">
        <div className="container split">
          <FeatureImage image={story.image} />
          <div>
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 id="verhaal" className="h2">
              <AccentText text={story.heading} />
            </h2>
            <p className="lead">{story.text}</p>
            {staging && content.storyDraftNotice && (
              <Notice tone="demo">
                <p>{content.storyDraftNotice}</p>
              </Notice>
            )}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="waarden">
        <div className="container">
          <SectionHeading id="waarden" {...content.values} />
          <ValuesGrid values={getValues()} />
        </div>
      </section>

      <section className="section" aria-labelledby="werkwijze">
        <div className="container">
          <SectionHeading id="werkwijze" {...content.process} />
          <ProcessTimeline steps={getWorkProcess()} />
        </div>
      </section>

      {(team.length > 0 || staging) && (
        <section className="section section--soft" aria-labelledby="team">
          <div className="container">
            <SectionHeading id="team" {...content.team} />
            {team.length > 0 ? (
              <div className="grid grid--3">
                {team.map((m) => (
                  <TeamCard key={m.name} member={m} />
                ))}
              </div>
            ) : (
              <Notice tone="demo">
                <p>{content.teamEmptyNotice}</p>
              </Notice>
            )}
          </div>
        </section>
      )}

      <CTASection content={content.cta} placement="over-ons" />
    </>
  );
}
