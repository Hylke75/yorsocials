import type { Metadata } from 'next';
import { AccordionFAQ } from '@/components/AccordionFAQ';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { EmptyState } from '@/components/EmptyState';
import { HeroEditorial } from '@/components/HeroEditorial';
import { getFaqs, getPages } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';

const content = getPages().faq;

const localMetadata: Metadata = buildMetadata({ ...content.seo, path: '/faq' });

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/faq', localMetadata);
}

// FAQPage structured data wordt bewust niet toegevoegd: Google toont FAQ-rich results
// sinds 2023 alleen nog voor gezaghebbende overheids- en zorgsites.
export default async function FaqPage() {
  const cmsView = await renderCmsPage('/faq');
  if (cmsView) return cmsView;

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
