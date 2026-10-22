import type { Metadata } from 'next';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { EmptyState } from '@/components/EmptyState';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Notice } from '@/components/Notice';
import { getArticleCategories, getArticles, getPages } from '@/content/repository';
import { cmsMetadata, renderCmsPage } from '@/cms/render';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

const content = getPages().articles;

const localMetadata: Metadata = buildMetadata({ ...content.seo, path: '/artikelen' });

export async function generateMetadata(): Promise<Metadata> {
  return cmsMetadata('/artikelen', localMetadata);
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default async function ArticlesPage() {
  const cmsView = await renderCmsPage('/artikelen');
  if (cmsView) return cmsView;

  const articles = getArticles();
  const categories = getArticleCategories();
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: content.seo.title, href: '/artikelen' }]} />}
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.description}
        image={content.hero.image}
        size="compact"
      />
      <section className="section" aria-labelledby="artikelen-lijst">
        <div className="container">
          <h2 id="artikelen-lijst" className="visually-hidden">
            {content.seo.title}
          </h2>
          {articles.some((a) => a.status === 'demo') && (
            <Notice tone="demo">
              <p>{content.demoNotice}</p>
            </Notice>
          )}
          {articles.length === 0 ? (
            <EmptyState title={content.empty.title} description={content.empty.description} />
          ) : (
            <>
              {categories.length > 1 && (
                <nav aria-label={content.categoriesLabel} className={styles.categories}>
                  <ul>
                    {categories.map((c) => (
                      <li key={c}>
                        <a href={`#categorie-${slugify(c)}`}>{c}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              {categories.map((c) => (
                <div key={c} className={styles.group}>
                  <h3 id={`categorie-${slugify(c)}`} className={styles.groupTitle}>
                    {c}
                  </h3>
                  <div className="grid grid--3">
                    {articles
                      .filter((a) => a.category === c)
                      .map((a) => (
                        <ArticleCard key={a.slug} article={a} />
                      ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
      <CTASection content={content.cta} placement="artikelen" />
    </>
  );
}
