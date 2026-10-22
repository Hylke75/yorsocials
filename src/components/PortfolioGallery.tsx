import type { CSSProperties } from 'react';
import type { MediaAsset } from '@/content/types';
import { MediaImage } from './MediaImage';
import styles from './Blocks.module.css';

export function PortfolioGallery({ images, columns = 2 }: { images: MediaAsset[]; columns?: number }) {
  if (images.length === 0) return null;
  return (
    <ul className={styles.gallery} style={{ '--cols': columns } as CSSProperties}>
      {images.map((img, i) => (
        <li key={`${img.src}-${i}`} className={styles.galleryItem}>
          <MediaImage asset={img} sizes={`(max-width: 740px) 100vw, ${Math.round(100 / columns)}vw`} showCaption />
        </li>
      ))}
    </ul>
  );
}
