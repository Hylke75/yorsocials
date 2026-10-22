import type { TeamMember } from '@/content/types';
import { MediaImage } from './MediaImage';
import styles from './Card.module.css';

/** Wordt alleen gerenderd voor teamleden met publicatietoestemming (zie repository.getTeam). */
export function TeamCard({ member }: { member: TeamMember }) {
  if (!member.consentConfirmed) return null;
  return (
    <article className={styles.card}>
      <MediaImage asset={member.portrait} sizes="(max-width: 740px) 100vw, 33vw" className={styles.photo} />
      <div className={styles.body}>
        <h3 className={styles.title}>{member.name}</h3>
        <p className={styles.num}>{member.role}</p>
        <p>{member.bio}</p>
        {member.links.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', gap: 14 }}>
            {member.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} className="accent-cyan" target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <span className="visually-hidden"> van {member.name} (opent in nieuw venster)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
