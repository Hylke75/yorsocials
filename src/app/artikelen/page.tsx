import type { Metadata } from 'next';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CTASection } from '@/components/CTASection';
import { EmptyState } from '@/components/EmptyState';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Notice } from '@/components/Notice';
import { media } from '@/content/data/media';
import { getArticleCategories, getArticles } from '@/content/repository';
import { buildMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Artikelen',
  description: 'Praktische inzichten over social strategie, content en campagnes van YorSocials.',
  path: '/artikelen',
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function ArticlesPage() {
  const articles = getArticles();
  const categories = getArticleCategories();
  return (
    <>
      <HeroEditorial
        before={<Breadcrumbs items={[{ name: 'Artikelen', href: '/artikelen' }]} />}
        eyebrow="Kennis & inspiratie"
        heading={
          <>
            Ideeën die <span className="accent-green">verder helpen.</span>
          </>
        }
        description="Praktische inzichten over social strategie, content en campagnes."
        image={media.strategy}
        size="compact"
      />
      <section className="section" aria-labelledby="artikelen-lijst">
        <div className="container">
          <h2 id="artikelen-lijst" className="visually-hidden">
            Alle artikelen
          </h2>
          {articles.some((a) => a.status === 'demo') && (
            <Notice tone="demo">
              <p>Voorbeeldartikelen: redactioneel nog niet gecontroleerd en zonder auteur of publicatiedatum.</p>
            </Notice>
          )}
          {articles.length === 0 ? (
            <EmptyState title="Binnenkort verschijnen hier artikelen" description="We werken aan praktische artikelen over social strategie, content en campagnes." />
          ) : (
            <>
              {categories.length > 1 && (
                <nav aria-label="Categorieën" className={styles.categories}>
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
      <CTASection placement="artikelen" />
    </>
  );
}
