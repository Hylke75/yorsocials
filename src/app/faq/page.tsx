import type { Metadata } from 'next';
import { AccordionFAQ } from '@/components/AccordionFAQ';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { EmptyState } from '@/components/EmptyState';
import { HeroEditorial } from '@/components/HeroEditorial';
import { getFaqs, getPages } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';

const content = getPages().faq;

export const metadata: Metadata = buildMetadata({ ...content.seo, path: '/faq' });

// FAQPage structured data wordt bewust niet toegevoegd: Google toont FAQ-rich results
// sinds 2023 alleen nog voor gezaghebbende overheids- en zorgsites.
export default function FaqPage() {
  const faqs = getFaqs();
  const categories = [...new Set(faqs.map((f) => f.category))];
  const { hero } = content;
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'FAQ', href: '/faq' }]} />}
        eyebrow={hero.eyebrow}
        heading={hero.heading}
        description={hero.description}
        image={hero.image}
        size="compact"
      />
      <section className="section">
        <div className="container">
          {faqs.length === 0 ? (
            <EmptyState title={content.empty.title} description={content.empty.description} />
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
      <CTASection content={content.cta} placement="faq" />
    </>
  );
}
