import Image from 'next/image';
import type { MediaAsset } from '@/content/types';
import { getContentMode } from '@/lib/env';
import styles from './MediaImage.module.css';

interface MediaImageProps {
  asset: MediaAsset;
  /** `fill`: vult de (positioned) ouder; anders intrinsieke verhouding. */
  fill?: boolean;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Leeg = decoratief (alt=""). */
  decorative?: boolean;
  showCaption?: boolean;
  /** Toon "Placeholder"-label in staging. */
  labelPlaceholder?: boolean;
}

/** Responsieve afbeelding (AVIF/WebP via next/image) met focal point en placeholdermarkering. */
export function MediaImage({
  asset,
  fill,
  sizes,
  priority,
  className,
  imageClassName,
  decorative,
  showCaption,
  labelPlaceholder = true,
}: MediaImageProps) {
  const showLabel = labelPlaceholder && asset.isPlaceholder && getContentMode() === 'staging';
  const img = (
    <Image
      src={asset.src}
      alt={decorative ? '' : asset.alt}
      sizes={sizes}
      priority={priority}
      className={[styles.image, imageClassName].filter(Boolean).join(' ')}
      style={{ objectPosition: asset.focalPoint }}
      {...(fill ? { fill: true } : { width: asset.width, height: asset.height })}
    />
  );

  if (showCaption && asset.caption) {
    return (
      <figure className={className} style={{ margin: 0 }}>
        <div className={styles.frame}>
          {img}
          {showLabel && <span className={styles.label}>Placeholder</span>}
        </div>
        <figcaption className={styles.caption}>{asset.caption}</figcaption>
      </figure>
    );
  }

  return (
    <div className={[styles.frame, fill && styles.fill, className].filter(Boolean).join(' ')}>
      {img}
      {showLabel && <span className={styles.label}>Placeholder</span>}
    </div>
  );
}
