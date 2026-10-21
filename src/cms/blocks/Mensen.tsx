import { MediaImage } from '@/components/MediaImage';
import { SectionHeading } from '@/components/SectionHeading';
import cardStyles from '@/components/Card.module.css';
import { getCmsContent } from '../client';
import { parseTeamMembers } from '../parse';
import { cmsAsset, num, text } from './fields';
import type { BlockProps } from './props';
import { BlockSection } from './Section';

/** `mensen`: teamleden uit de ingebouwde collectie (records.teamleden). */
export async function MensenBlock({ block, index }: BlockProps) {
  const c = block.content;
  const id = `blok-${index}`;
  const members = parseTeamMembers((await getCmsContent())?.records.teamleden).slice(0, num(c, 'maximaal', 99));
  if (!members.length) return null;
  return (
    <BlockSection bg={block.bg} labelledBy={text(c, 'titel') ? id : undefined}>
      {text(c, 'titel') && <SectionHeading id={id} eyebrow="" heading={text(c, 'titel')} description={text(c, 'intro') || undefined} />}
      <ul className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {members.map((m) => {
          const portrait = m.foto ? cmsAsset(m.foto, `Portret van ${m.naam}`) : undefined;
          return (
            <li key={m.id} style={{ display: 'grid' }}>
              <article className={cardStyles.card}>
                {portrait && <MediaImage asset={portrait} sizes="(max-width: 740px) 100vw, 33vw" className={cardStyles.photo} labelPlaceholder={false} />}
                <div className={cardStyles.body}>
                  <h3 className={cardStyles.title}>{m.naam}</h3>
                  {m.functie && <p className={cardStyles.num}>{m.functie}</p>}
                  {m.tekst && <p>{m.tekst}</p>}
                  {m.linkedin && (
                    <p style={{ marginTop: 12 }}>
                      <a href={m.linkedin} className="accent-cyan" target="_blank" rel="noopener noreferrer">
                        LinkedIn<span className="visually-hidden"> van {m.naam} (opent in nieuw venster)</span>
                      </a>
                    </p>
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
