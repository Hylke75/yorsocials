import { Suspense } from 'react';
import { ButtonLink } from '@/components/Button';
import { CaseCard as LocalCaseCard } from '@/components/CaseCard';
import { CaseFilter } from '@/components/CaseFilter';
import { MediaImage } from '@/components/MediaImage';
import { SectionHeading } from '@/components/SectionHeading';
import cardStyles from '@/components/Card.module.css';
import { Notice } from '@/components/Notice';
import { getCases, getPages, getSectorLabel } from '@/content/repository';
import { getCmsContent } from '../client';
import { parseCases } from '../parse';
import type { CmsCase } from '../types';
import { cmsAsset, num, slugify, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';
import styles from './Blocks.module.css';

function CaseCard({ item }: { item: CmsCase }) {
  const photo = item.foto ? cmsAsset(item.foto, item.klantnaam ? `Beeld bij de case van ${item.klantnaam}` : 'Beeld bij de case') : undefined;
  return (
    <article className={cardStyles.card}>
      {photo && <MediaImage asset={photo} sizes="(max-width: 740px) 100vw, 50vw" className={cardStyles.photo} labelPlaceholder={false} />}
      <div className={cardStyles.body}>
        {item.sector && (
          <div className={cardStyles.meta}>
            <span className={cardStyles.tag}>{item.sector}</span>
          </div>
        )}
        <h3 className={cardStyles.title}>{item.klantnaam || item.uitdaging}</h3>
        <dl className={styles.caseMeta}>
          {item.uitdaging && item.klantnaam && (
            <div>
              <dt>Uitdaging</dt>
              <dd>{item.uitdaging}</dd>
            </div>
          )}
          {item.aanpak && (
            <div>
              <dt>Aanpak</dt>
              <dd>{item.aanpak}</dd>
            </div>
          )}
          {item.resultaat_cijfer && (
            <div>
              <dt>Resultaat</dt>
              <dd>
                <strong style={{ color: 'var(--color-brand-sage-light)' }}>{item.resultaat_cijfer}</strong>
                {item.resultaat_periode && ` · ${item.resultaat_periode}`}
              </dd>
            </div>
          )}
        </dl>
        {item.citaat && <p style={{ marginTop: 12, fontStyle: 'italic' }}>“{item.citaat}”</p>}
      </div>
    </article>
  );
}

/** `cases_grid`: cases uit de ingebouwde collectie, met sectorfilter (?sector=) of een vaste sector. */
export async function CasesGridBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const fixedSector = text(c, 'filter_sector');
  const max = num(c, 'maximaal', 99);
  const matches = (sector: string) => !fixedSector || slugify(sector) === slugify(fixedSector);
  const cmsCases = parseCases((await getCmsContent())?.records.cases).filter((x) => matches(x.sector));
  // Zolang het CMS (nog) geen cases levert, toont het blok de ingebouwde collectie.
  const local = cmsCases.length ? [] : getCases().filter((x) => matches(getSectorLabel(x.sector)) || matches(x.sector));
  const items = cmsCases.length
    ? cmsCases.slice(0, max).map((x) => ({ slug: x.id, sector: slugify(x.sector), label: x.sector, card: <CaseCard item={x} /> }))
    : local.slice(0, max).map((x) => ({ slug: x.slug, sector: slugify(getSectorLabel(x.sector)), label: getSectorLabel(x.sector), card: <LocalCaseCard item={x} /> }));
  if (!items.length) return null;
  const sectorLabels = [...new Set(items.map((x) => x.label).filter(Boolean))];
  const showDemoNotice = local.slice(0, max).some((x) => x.status === 'demo');
  const p = getPages().cases;
  const grid = (
    <ul className="grid grid--2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((i) => (
        <li key={i.slug} style={{ display: 'grid' }}>
          {i.card}
        </li>
      ))}
    </ul>
  );
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow={text(c, 'eyebrow')} heading={text(c, 'titel')} />}
      {showDemoNotice && (
        <Notice tone="demo">
          <p>{p.demoNotice}</p>
        </Notice>
      )}
      {fixedSector || sectorLabels.length < 2 ? (
        grid
      ) : (
        <Suspense fallback={grid}>
          <CaseFilter
            items={items}
            sectors={sectorLabels.map((s) => ({ id: slugify(s), label: s }))}
            labels={{ filterLabel: p.filterLabel, allLabel: p.filterAllLabel, emptyTitle: p.filterEmptyTitle, emptyDescription: p.filterEmptyDescription }}
          />
        </Suspense>
      )}
      {text(c, 'link_naar_overzicht') && (
        <div className="actions" style={{ marginTop: 28 }}>
          <ButtonLink href={text(c, 'link_naar_overzicht')} placement="cms-cases-overzicht">
            {getPages().home.allCasesLabel}
          </ButtonLink>
        </div>
      )}
    </BlockSection>
  );
}
