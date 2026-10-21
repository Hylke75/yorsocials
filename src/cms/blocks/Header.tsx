import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/Button';
import { HeroEditorial } from '@/components/HeroEditorial';
import { Icon } from '@/components/Icon';
import { getCmsPage } from '../client';
import { cmsAsset, list, text } from './fields';
import type { BlockProps } from './props';
import styles from './Blocks.module.css';

/** `header` (hero): eyebrow, kop, subkop, 2 knoppen, afbeelding met focuspunt, kruimelpad, USP's. */
export async function HeaderBlock({ block, page, isFirstHeader }: BlockProps) {
  const c = block.content;
  const image = text(c, 'media_type') === 'afbeelding' || text(c, 'media_afbeelding') ? cmsAsset(text(c, 'media_afbeelding'), text(c, 'media_alt'), c.focal_x, c.focal_y) : undefined;

  const manualCrumbs = list(c, 'kruimelpad')
    .map((k) => ({ name: text(k, 'titel'), href: text(k, 'href') }))
    .filter((k) => k.name && k.href);
  const autoCrumbs = text(c, 'auto_kruimelpad') !== 'uit' && page.slug !== '/' && isFirstHeader ? await autoBreadcrumbs(page.slug, page.titel || text(c, 'heading')) : [];
  const crumbs = manualCrumbs.length ? manualCrumbs : autoCrumbs;

  const usps = list(c, 'usps')
    .map((u) => text(u, 'tekst'))
    .filter(Boolean);
  const stats = text(c, 'extras') === 'stats' ? list(c, 'stats').filter((s) => text(s, 'waarde') && text(s, 'label')) : [];

  const primary = text(c, 'cta_primair_label') && text(c, 'cta_primair_link');
  const secondary = text(c, 'cta_secundair_label') && text(c, 'cta_secundair_link');
  const compact = text(c, 'hoogte') === 'compact' || text(c, 'layout') === 'compact';

  return (
    <HeroEditorial
      headingLevel={isFirstHeader ? 'h1' : 'h2'}
      before={crumbs.length ? <Breadcrumbs items={crumbs} /> : undefined}
      eyebrow={text(c, 'eyebrow')}
      heading={text(c, 'heading') || page.titel}
      description={text(c, 'subheading') || undefined}
      image={image}
      size={compact ? 'compact' : 'large'}
      actions={
        primary || secondary ? (
          <>
            {primary && (
              <ButtonLink href={text(c, 'cta_primair_link')} placement={`cms-header${page.slug}`}>
                {text(c, 'cta_primair_label')}
              </ButtonLink>
            )}
            {secondary && (
              <ButtonLink href={text(c, 'cta_secundair_link')} variant="secondary" placement={`cms-header-secundair${page.slug}`}>
                {text(c, 'cta_secundair_label')}
              </ButtonLink>
            )}
          </>
        ) : undefined
      }
    >
      {usps.length > 0 && (
        <ul className={styles.usps}>
          {usps.map((u) => (
            <li key={u}>
              <Icon name="check" size={16} />
              {u}
            </li>
          ))}
        </ul>
      )}
      {stats.length > 0 && (
        <ul className={styles.metaList} aria-label="Kerncijfers">
          {stats.map((s) => (
            <li key={text(s, 'label')}>
              <strong style={{ color: 'var(--color-brand-sage-light)' }}>{text(s, 'waarde')}</strong> {text(s, 'label')}
            </li>
          ))}
        </ul>
      )}
    </HeroEditorial>
  );
}

/** Kruimelpad uit de URL-structuur: elke bovenliggende CMS-pagina (bijv. /diensten) wordt een tussenstap. */
async function autoBreadcrumbs(slug: string, title: string) {
  const segments = slug.split('/').filter(Boolean);
  const parents = await Promise.all(
    segments.slice(0, -1).map(async (_, i) => {
      const href = `/${segments.slice(0, i + 1).join('/')}`;
      const parent = await getCmsPage(href);
      return parent?.titel ? { name: parent.titel, href } : null;
    }),
  );
  return [...parents.filter((p): p is { name: string; href: string } => p !== null), { name: title, href: slug }];
}
