import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleContent } from '@/components/ArticleContent';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { CTASection } from '@/components/CTASection';
import { DemoBadge } from '@/components/DemoBadge';
import { HeroEditorial } from '@/components/HeroEditorial';
import { JsonLd } from '@/components/JsonLd';
import { Notice } from '@/components/Notice';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { getArticle, getArticles, getRelatedArticles, getRelatedServices, getSiteSettings } from '@/content/repository';
import { formatDate } from '@/lib/format';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return buildMetadata({
    title: a.seo.title,
    description: a.seo.description,
    path: `/artikelen/${a.slug}`,
    noIndex: a.seo.noIndex,
    type: 'article',
    publishedTime: a.publishedAt,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const related = getRelatedArticles(article, 3);
  const services = getRelatedServices(article.relatedServices);
  const site = getSiteSettings();

  return (
    <>
      {article.status === 'published' && article.publishedAt && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            image: absoluteUrl(article.heroImage.src),
            datePublished: article.publishedAt,
            author: article.author ? { '@type': 'Person', name: article.author.name } : { '@type': 'Organization', name: site.name },
            publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: absoluteUrl(site.logo.original.src) } },
            mainEntityOfPage: absoluteUrl(`/artikelen/${article.slug}`),
          }}
        />
      )}
      <HeroEditorial
        before={
          <Breadcrumbs
            items={[
              { name: 'Artikelen', href: '/artikelen' },
              { name: article.title, href: `/artikelen/${article.slug}` },
            ]}
          />
        }
        eyebrow={article.category}
        heading={article.title}
        description={article.excerpt}
        image={article.heroImage}
        size="compact"
      >
        <p className="muted" style={{ fontSize: 14 }}>
          {article.author ? `Door ${article.author.name}, ${article.author.role}` : 'Auteur nog toe te voegen'}
          {' · '}
          {article.publishedAt ? <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> : 'Nog niet gepubliceerd'}
        </p>
        {article.status === 'demo' && <DemoBadge>Voorbeeldartikel</DemoBadge>}
      </HeroEditorial>

      <section className="section" aria-label="Artikel">
        <div className="container">
          <article>
            {article.status === 'demo' && (
              <Notice tone="demo">
                <p>Voorbeeldartikel voor de ontwerpfase. Voor publicatie redactioneel beoordelen, auteur en datum toevoegen en bronnen vermelden.</p>
              </Notice>
            )}
            <ArticleContent blocks={article.body} />
          </article>
          <div className="actions" style={{ marginTop: 40 }}>
            <ButtonLink href="/artikelen" variant="secondary" icon="arrowLeft" iconPosition="start" placement="artikel-terug">
              Alle artikelen
            </ButtonLink>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="section section--soft" aria-labelledby="artikel-diensten">
          <div className="container">
            <SectionHeading id="artikel-diensten" eyebrow="Relevante diensten" heading={<>Hulp nodig <span className="accent-green">hierbij?</span></>} />
            <div className="grid grid--3">
              {services.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section" aria-labelledby="artikel-gerelateerd">
          <div className="container">
            <SectionHeading id="artikel-gerelateerd" eyebrow="Lees ook" heading={<>Meer <span className="accent-green">inzichten.</span></>} />
            <div className="grid grid--3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection placement={`artikel-${article.slug}`} />
    </>
  );
}
