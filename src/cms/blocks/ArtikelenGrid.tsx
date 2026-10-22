import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { Icon } from '@/components/Icon';
import { MediaImage } from '@/components/MediaImage';
import { SectionHeading } from '@/components/SectionHeading';
import cardStyles from '@/components/Card.module.css';
import { getArticles, getGlobalContent } from '@/content/repository';
import { formatDate } from '@/lib/format';
import { getCmsContent } from '../client';
import { parseArticles } from '../parse';
import { cmsAsset, num, slugify, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';

/** `artikelen_grid`: artikelen uit de ingebouwde collectie; kaarten linken naar /artikelen/<slug>. */
export async function ArtikelenGridBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const rubriek = text(c, 'filter_rubriek');
  const all = parseArticles((await getCmsContent())?.records.artikelen);
  const articles = (rubriek ? all.filter((a) => slugify(a.rubriek) === slugify(rubriek)) : all).slice(0, num(c, 'maximaal', 99));
  if (!articles.length) {
    // Zolang het CMS (nog) geen artikelen levert, toont het blok de ingebouwde collectie.
    const local = getArticles()
      .filter((a) => !rubriek || slugify(a.category) === slugify(rubriek))
      .slice(0, num(c, 'maximaal', 99));
    if (!local.length) return null;
    return (
      <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
        {text(c, 'titel') && <SectionHeading id={id} eyebrow={text(c, 'eyebrow')} heading={text(c, 'titel')} />}
        <div className="grid grid--3">
          {local.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </BlockSection>
    );
  }
  const more = getGlobalContent().cardLinks.article;
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow={text(c, 'eyebrow')} heading={text(c, 'titel')} />}
      <ul className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {articles.map((a) => {
          const photo = a.foto ? cmsAsset(a.foto, '') : undefined;
          return (
            <li key={a.id} style={{ display: 'grid' }}>
              <article className={cardStyles.card}>
                {photo && <MediaImage asset={photo} decorative sizes="(max-width: 740px) 100vw, 33vw" className={cardStyles.photo} labelPlaceholder={false} />}
                <div className={cardStyles.body}>
                  {a.rubriek && (
                    <div className={cardStyles.meta}>
                      <span className={cardStyles.num}>{a.rubriek}</span>
                    </div>
                  )}
                  <h3 className={cardStyles.title}>
                    <Link href={`/artikelen/${a.slug}`} className={cardStyles.link}>
                      {a.titel}
                    </Link>
                  </h3>
                  {a.samenvatting && <p>{a.samenvatting}</p>}
                  {a.gepubliceerd_op && !Number.isNaN(Date.parse(a.gepubliceerd_op)) && (
                    <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
                      <time dateTime={a.gepubliceerd_op}>{formatDate(a.gepubliceerd_op)}</time>
                    </p>
                  )}
                  <span className={cardStyles.more} aria-hidden="true">
                    {more} <Icon name="arrowUpRight" size={16} />
                  </span>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </BlockSection>
  );
}
