import type { ReactNode } from 'react';
import type { MediaAsset } from '@/content/types';
import { Icon } from './Icon';
import { MediaImage } from './MediaImage';
import styles from './Blocks.module.css';

interface ServiceDetailIntroProps {
  eyebrow: string;
  heading: ReactNode;
  text: string;
  deliverables: string[];
  image: MediaAsset;
  actions?: ReactNode;
  headingId?: string;
}

export function ServiceDetailIntro({ eyebrow, heading, text, deliverables, image, actions, headingId }: ServiceDetailIntroProps) {
  return (
    <div className="split">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={headingId} className="h2">
          {heading}
        </h2>
        <p className="lead">{text}</p>
        <h3 className="visually-hidden">Wat je krijgt</h3>
        <ul className={styles.bullets}>
          {deliverables.map((d) => (
            <li key={d}>
              <Icon name="check" size={18} />
              {d}
            </li>
          ))}
        </ul>
        {actions}
      </div>
      <FeatureImage image={image} />
    </div>
  );
}

export function FeatureImage({ image, priority }: { image: MediaAsset; priority?: boolean }) {
  return <MediaImage asset={image} fill={false} priority={priority} sizes="(max-width: 740px) 100vw, 600px" className={styles.feature} />;
}
