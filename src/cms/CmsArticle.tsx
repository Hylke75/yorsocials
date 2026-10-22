import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { CTASection } from '@/components/CTASection';
import { HeroEditorial } from '@/components/HeroEditorial';
import { JsonLd } from '@/components/JsonLd';
import { Notice } from '@/components/Notice';
import { getPages, getSiteSettings } from '@/content/repository';
import { formatDate } from '@/lib/format';
import { absoluteUrl } from '@/lib/seo';
import { fillTemplate } from '@/lib/text';
import { cmsAsset } from './blocks/fields';
import { RichText } from './blocks/RichText';
import blockStyles from './blocks/Blocks.module.css';
import type { CmsArticle } from './types';

/** Detailweergave van een artikel uit de CMS-collectie (records.artikelen). */
export function CmsArticleView({ article }: { article: CmsArticle }) {
  const t = getPages().articleDetail;
  const site = getSiteSettings();
  const published = article.gepubliceerd_op && !Number.isNaN(Date.parse(article.gepubliceerd_op)) ? article.gepubliceerd_op : null;
  const path = `/artikelen/${article.slug}`;
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.titel,
          description: article.samenvatting,
          ...(article.foto ? { image: article.foto } : {}),
          ...(published ? { datePublished: published } : {}),
          author: article.auteur ? { '@type': 'Person', name: article.auteur } : { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name },
          mainEntityOfPage: absoluteUrl(path),
        }}
      />
      <HeroEditorial
        before={
          <Breadcrumbs
            items={[
              { name: getPages().articles.seo.title, href: '/artikelen' },
              { name: article.titel, href: path },
            ]}
          />
        }
        eyebrow={article.rubriek}
        heading={article.titel}
        description={article.samenvatting || undefined}
        image={article.foto ? cmsAsset(article.foto, '') : undefined}
        size="compact"
      >
        <p className="muted" style={{ fontSize: 14 }}>
          {article.auteur ? fillTemplate(t.byline, { name: article.auteur, role: '' }).replace(/,\s*$/, '') : null}
          {article.auteur && published ? ' · ' : null}
          {published && <time dateTime={published}>{formatDate(published)}</time>}
        </p>
      </HeroEditorial>
      <section className="section" aria-label="Artikel">
        <div className="container">
          <article>
            {article.antwoordblok && (
              <Notice>
                <p>{article.antwoordblok}</p>
              </Notice>
            )}
            <RichText value={article.hoofdtekst} className={blockStyles.prose} />
          </article>
          <div className="actions" style={{ marginTop: 40 }}>
            <ButtonLink href="/artikelen" variant="secondary" icon="arrowLeft" iconPosition="start" placement="artikel-terug">
              {t.backLabel}
            </ButtonLink>
          </div>
        </div>
      </section>
      <CTASection content={t.cta} placement={`artikel-${article.slug}`} />
    </>
  );
}
