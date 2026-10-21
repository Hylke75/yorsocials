import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Icon, type AnyIconName } from '@/components/Icon';
import { MediaImage } from '@/components/MediaImage';
import { SectionHeading } from '@/components/SectionHeading';
import cardStyles from '@/components/Card.module.css';
import { getCmsContent } from '../client';
import { normalizeSlug } from '../parse';
import { cmsAsset, list, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';
import styles from './Blocks.module.css';

const ICONS: Record<string, AnyIconName> = {
  doel: 'target',
  gesprek: 'messages',
  groei: 'trend',
  schakel: 'link',
  klok: 'clock',
  schild: 'shield',
  kompas: 'compass',
  vonk: 'sparkles',
  post: 'mail',
  lijst: 'list',
};

/**
 * `kaarten`: rij kaarten met icoon, titel, tekst en optionele link. Linkt een kaart naar een
 * CMS-pagina (bijv. /diensten/<slug>), dan wordt het headerbeeld van die pagina de kaartachtergrond —
 * zo krijgt het dienstenoverzicht beeld zonder extra veld.
 */
export async function KaartenBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const content = await getCmsContent();
  const imageFor = (href: string) => {
    if (!href.startsWith('/')) return undefined;
    const target = content?.paginas.find((p) => p.slug === normalizeSlug(href));
    const header = target?.blokken.find((b) => b.type === 'header');
    return header ? cmsAsset(text(header.content, 'media_afbeelding'), '', header.content.focal_x, header.content.focal_y) : undefined;
  };
  const items = list(c, 'items').filter((i) => text(i, 'titel'));
  const cols = text(c, 'kolommen') === '4' ? 4 : 3;
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow={text(c, 'eyebrow')} heading={text(c, 'titel')} description={text(c, 'intro') || undefined} />}
      <ul className={styles.cards} style={{ '--cols': cols } as CSSProperties}>
        {items.map((item, i) => {
          const href = text(item, 'link');
          const icon = ICONS[text(item, 'icoon')];
          const bgImage = href ? imageFor(href) : undefined;
          return (
            <li key={`${text(item, 'titel')}-${i}`} style={{ display: 'grid' }}>
              <article className={`${cardStyles.card} ${bgImage ? cardStyles.service : ''}`} style={bgImage ? undefined : { minHeight: 0 }}>
                {bgImage && <MediaImage asset={bgImage} fill decorative sizes="(max-width: 740px) 100vw, 33vw" className={cardStyles.serviceBg} labelPlaceholder={false} />}
                <div className={cardStyles.body}>
                  {icon && <Icon name={icon} size={34} className={cardStyles.icon} />}
                  <h3 className={cardStyles.title}>
                    {href ? (
                      <Link href={href} className={cardStyles.link}>
                        {text(item, 'titel')}
                      </Link>
                    ) : (
                      text(item, 'titel')
                    )}
                  </h3>
                  {text(item, 'tekst') && <p>{text(item, 'tekst')}</p>}
                  {href && text(item, 'knoptekst') && (
                    <span className={cardStyles.more} aria-hidden="true">
                      {text(item, 'knoptekst')} <Icon name="arrowUpRight" size={16} />
                    </span>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </BlockSection>
  );
}
