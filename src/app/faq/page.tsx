import type { Metadata } from 'next';
import { AccordionFAQ } from '@/components/AccordionFAQ';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { EmptyState } from '@/components/EmptyState';
import { HeroEditorial } from '@/components/HeroEditorial';
import { media } from '@/content/data/media';
import { getFaqs } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Veelgestelde vragen',
  description: 'Antwoorden op praktische vragen over de werkwijze en samenwerking met YorSocials.',
  path: '/faq',
});

// FAQPage structured data wordt bewust niet toegevoegd: Google toont FAQ-rich results
// sinds 2023 alleen nog voor gezaghebbende overheids- en zorgsites.
export default function FaqPage() {
  const faqs = getFaqs();
  const categories = [...new Set(faqs.map((f) => f.category))];
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'FAQ', href: '/faq' }]} />}
        eyebrow="Goed om te weten"
        heading={
          <>
            Veelgestelde <span className="accent-green">vragen.</span>
          </>
        }
        description="Antwoorden op praktische vragen over onze werkwijze en samenwerking."
        image={media.strategy}
        size="compact"
      />
      <section className="section">
        <div className="container">
          {faqs.length === 0 ? (
            <EmptyState title="Nog geen vragen" description="Heb je een vraag? Neem gerust contact met ons op." />
          ) : (
            categories.map((cat, i) => (
              <div key={cat} style={{ marginTop: i === 0 ? 0 : 56 }}>
                <h2 className="eyebrow" style={{ marginBottom: 18 }}>
                  {cat}
                </h2>
                <AccordionFAQ items={faqs.filter((f) => f.category === cat)} defaultOpen={i === 0 ? [faqs[0]?.id ?? ''] : []} headingLevel="h3" />
              </div>
            ))
          )}
        </div>
      </section>
      <CTASection
        placement="faq"
        eyebrow="Staat je vraag er niet tussen?"
        heading={
          <>
            Vraag het <span className="accent-green">ons gewoon.</span>
          </>
        }
        body="We denken graag met je mee en geven een eerlijk antwoord, ook als we niet de juiste partij voor je zijn."
      />
    </>
  );
}
