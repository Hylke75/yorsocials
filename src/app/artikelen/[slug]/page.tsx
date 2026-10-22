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
import { getArticle, getArticles, getPages, getRelatedArticles, getRelatedServices, getSiteSettings } from '@/content/repository';
import { fillTemplate } from '@/lib/text';
import { formatDate } from '@/lib/format';
import { CmsArticleView } from '@/cms/CmsArticle';
import { getCmsContent } from '@/cms/client';
import { parseArticles } from '@/cms/parse';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 60;

async function cmsArticles() {
  return parseArticles((await getCmsContent())?.records.artikelen);
}

export async function generateStaticParams() {
  const cmsPages = (await getCmsContent())?.paginas.filter((p) => p.slug.startsWith('/artikelen/')).map((p) => p.slug.slice('/artikelen/'.length)) ?? [];
  const slugs = [...getArticles().map((a) => a.slug), ...cmsPages, ...(await cmsArticles()).map((a) => a.slug)];
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const record = (await cmsArticles()).find((a) => a.slug === slug);
  const a = getArticle(slug);
  const local: Metadata = record
    ? buildMetadata({ title: record.titel, description: record.samenvatting, path: `/artikelen/${slug}`, type: 'article', publishedTime: record.gepubliceerd_op })
    : a
      ? buildMetadata({
    title: a.seo.title,
    description: a.seo.description,
    path: `/artikelen/${a.slug}`,
    noIndex: a.seo.noIndex,
    type: 'article',
    publishedTime: a.publishedAt,
  })
      : {};
  return cmsMetadata(`/artikelen/${slug}`, local);
}

export default async function ArticleDetailPage({ params }: Props) {
  const slug = (await params).slug;
  const cmsView = await renderCmsPage(`/artikelen/${slug}`);
  if (cmsView) return cmsView;
  const record = (await cmsArticles()).find((a) => a.slug === slug);
  if (record) return <CmsArticleView article={record} />;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = getRelatedArticles(article, 3);
  const services = getRelatedServices(article.relatedServices);
  const site = getSiteSettings();
  const t = getPages().articleDetail;

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
              { name: getPages().articles.seo.title, href: '/artikelen' },
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
          {article.author ? fillTemplate(t.byline, { name: article.author.name, role: article.author.role }) : t.noAuthor}
          {' · '}
          {article.publishedAt ? <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> : t.notPublished}
        </p>
        {article.status === 'demo' && <DemoBadge>{t.demoBadge}</DemoBadge>}
      </HeroEditorial>

      <section className="section" aria-label="Artikel">
        <div className="container">
          <article>
            {article.status === 'demo' && (
              <Notice tone="demo">
                <p>{t.demoNotice}</p>
              </Notice>
            )}
            <ArticleContent blocks={article.body} />
          </article>
          <div className="actions" style={{ marginTop: 40 }}>
            <ButtonLink href="/artikelen" variant="secondary" icon="arrowLeft" iconPosition="start" placement="artikel-terug">
              {t.backLabel}
            </ButtonLink>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="section section--soft" aria-labelledby="artikel-diensten">
          <div className="container">
            <SectionHeading id="artikel-diensten" {...t.services} />
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
            <SectionHeading id="artikel-gerelateerd" {...t.related} />
            <div className="grid grid--3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection content={t.cta} placement={`artikel-${article.slug}`} />
    </>
  );
}
