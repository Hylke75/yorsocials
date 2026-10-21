import type { CSSProperties } from 'react';
import type { ProcessStep } from '@/content/types';
import { MediaImage } from './MediaImage';
import styles from './Blocks.module.css';

export function ProcessTimeline({ steps, showImages = false }: { steps: ProcessStep[]; showImages?: boolean }) {
  return (
    <ol className={styles.steps} style={{ '--steps': steps.length } as CSSProperties}>
      {steps.map((step, i) => (
        <li key={step.title} className={styles.step}>
          {showImages && step.image && (
            <MediaImage asset={step.image} decorative sizes="(max-width: 740px) 100vw, 260px" className={styles.stepImage} labelPlaceholder={false} />
          )}
          <div className={styles.stepBody}>
            <span className={styles.stepNum} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>
              <span className="visually-hidden">Stap {i + 1}: </span>
              {step.title}
            </h3>
            <p>{step.copy}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
